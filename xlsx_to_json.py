import pandas as pd
import os
import requests
import json
import urllib
import string

INCLUDE_PENNY_CUBE = True
NAME_STRICT = False #force the right punctuation, capitalization etc.
PRINT_CANONICALIZE = False #when fixing names, print out the fixes?

#How to get data on a card by making an API
def get_scry_json_uri(card_name):
  url_name = urllib.parse.quote(card_name)
  scry_req = requests.get('https://api.scryfall.com/cards/search?q=!"'+url_name+'"+unique:prints+-is:digital')
  scry_json = json.loads(scry_req.text)['data']
  return scry_json
#but that's really slow, let's load from bulk file instead.

#Load the scryfall bulk data
bulk_file = open("scryfall_bulk_default_cards.json")
scry_bulk = json.load(bulk_file)

#Function to ask "does this card have this name"? see e.g. "Era of Enlightenment" which
#has that name but also has the full card name 'Era of Enlightenment // Hand of Enlightenment'.
#We also normalize away punctuation and capitalization. We leave /'s though, just in case
def normalize(name):
  if NAME_STRICT:
    return name
  return name.translate(str.maketrans('', '', '!"#$%&\'()*+,-.:;<=>?@[\\]^_`{|}~')).replace(' ','').lower()

def card_name_match(card_json, name):
  if normalize(card_json['name']) == normalize(name):
    return True
  if 'card_faces' in card_json and normalize(card_json['card_faces'][0]['name']) == normalize(name):
    return True
  return False

#index by card name for quick lookup
scry_dict = {}
for obj in scry_bulk:
  if obj['digital'] or obj['set_type'] == 'memorabilia':
    continue
  names = [obj['name'], normalize(obj['name'])]
  if ('card_faces' in obj):# and (not NAME_STRICT):
    face1 = obj['card_faces'][0]['name']
    names += [face1, normalize(face1)]
  for name in names:
    if name not in scry_dict:
      scry_dict[name] = []
    scry_dict[name].append(obj)

#Function to get from dict
def get_scry_json(card_name):
  card_name = normalize(card_name)
  if card_name not in scry_dict:
    raise NameError("unknown card "+card_name)
  return scry_dict[card_name]

#(Slow-ish) function to get printing by set + number
def get_json_setnum(cset, num):
  res = [card for card in scry_bulk if card['set'].upper()==cset and card['collector_number']==num]
  if len(res) == 0:
    raise NameError("unknown set/num "+cset+" #",num)
  if len(res) > 1:
    raise ValueError("multiple matches set/num "+cset+" #",num)
  return res[0]

#Get the cheapest printing of a given card name
def min_price(scry_json):
  prices = []
  for card in scry_json:
    for printing in ['usd', 'usd_foil', 'usd_etched']:
      if card['prices'][printing] != None:
        prices += [float(card['prices'][printing])]
  return min(prices)

#Do cleanups on the google sheet
def fix_sheet(sheet):
	sheet['Card Name'] = sheet['Card Name'].str.strip() #clean any whitespace
	sheet['Card Name'] = sheet['Card Name'].str.replace("Lim-Dul", "Lim-Dûl") #weird character
	sheet['Total Copies'] = sheet['Total Copies'].astype(int)
	sheet['In Use'] = sheet['In Use'].astype(int)
	sheet = sheet.replace(float("nan"), "")
	sheet = sheet.replace({"/+2 Mace": "+2 Mace"})
	return sheet

delta_price = 0

#Read through the Google sheet, doing sanity checks and so on
def parse_rows(sheet):
	global delta_price
	sheet['LinkPrints'] = None
	for ind, row in sheet.iterrows():
		#replace the name with the official name
		#e.g. "Devoted Grafkeeper" -> "Devoted Grafkeeper // Departed Soulkeeper", 
		# "Beanstalk Giant" -> "Beanstalk Giant // Fertile Footsteps"
		xlsx_name = row['Card Name']
		official_name = get_scry_json(xlsx_name)[0]['name']
		if xlsx_name != official_name:
		  if PRINT_CANONICALIZE:
		    print("Canonicalizing ",xlsx_name," to ",official_name)
		  sheet.loc[ind, 'Card Name'] = official_name
		  row['Card Name'] = official_name
		#Check that the decks + storage info are reasonable
		owned = row['Total Copies']
		used = row['In Use']
		deck_str = row['Decks']
		deck_list = deck_str.split(";")
		deck_list = [s.strip() for s in deck_list]
		if deck_list == [""]:
			deck_list = []
		for deck in deck_list:
			if deck not in known_decks:
				print("Unknown deck: ",deck)
		store_str = row['Storage']
		store_list = store_str.split(",")
		store_list = [s.strip() for s in store_list]
		if store_list == [""]:
			store_list = []
		tot_stor = len(deck_list)
		for stor in store_list:
			if stor.split(" ")[0].isnumeric():
				stor_num = int(stor.split(" ",1)[0])
				stor = stor.split(" ",1)[1]
			else:
				stor_num = 1
			if stor not in known_storage:
				print("Unknown storage: ",stor)
			tot_stor += stor_num
		#print(used," = ",len(deck_list)," < ",tot_stor)
		if used != len(deck_list):
			print("Bad card: '"+row["Card Name"]+"'. Used in",used,"places, only lists",deck_list)
			print()
			continue
		if tot_stor > owned:
			print("Bad card: '"+row["Card Name"]+"'. Used in",used,"places, stored in",store_str,"but only",owned,"owned")
			print()
			continue
		#Check for special printing info
		prints = row["Prints"]
		prints_with_links = []
		if prints != "":
		  prints = prints.split(",")#can be multiple, comma delimited
		  for printing in prints:
		    mult = 1
		    foil = False
		    etched = False
		    set_and_num = None
		    printing = printing.strip()
		    parts = printing.split(" ")
		    for p in parts:
		      if p.isnumeric():
		        mult = int(p)
		      elif p == "Foil":
		        foil = True
		      elif p == "Etched":
		        etched = True
		      elif "#" in p:
		        set_and_num = p
		      elif p in ["German","Russian","Chinese"]:
		        pass #just a foreign printing, whatever
		      else:
		        print()
		        print("Unknown printing line",printing,"for",row['Card Name'])
		        print()
		    #get the set/num
		    if set_and_num == None:
		      print("Warning: No set + number given for printing",printing,"of",row['Card Name']," -- skipping")
		      print()
		      continue
		    cset,num = set_and_num.split("#")
		    json = get_json_setnum(cset,num)
		    if not card_name_match(json, row['Card Name']):
		      print("Warning: printing",printing,"is",json['name'],"and not",row['Card Name'])
		      print()
		    basic_price = min_price(get_scry_json(row['Card Name']))
		    if etched:
		      price = json['prices']['usd_etched']
		    elif foil:
		      price = json['prices']['usd_foil']
		    else:
		      price = json['prices']['usd']
		    if price == None:
		      print("Warning: price for",row["Card Name"],"in printing",printing,"gave price None")
		      print()
		    else:
		      delta_price += mult * (float(price) - basic_price)
		      #only print big price bumps
		      if float(price) >= basic_price + 1.00:
		        print(row["Card Name"]+": Bump price from",basic_price,"to",price,"for","foil"if foil else"nonfoil","printing",set_and_num)
		    prints_with_links += ['<a href="'+json['scryfall_uri'].split("?")[0]+'">'+printing+'</a>']
		prints_with_links = ", ".join(prints_with_links)
		sheet.loc[ind, "LinkPrints"] = prints_with_links


known_decks = ["Chatterfang","Anje","Silverquill","Rakdos","Augustin","Queza","Slivers","Trelasarra","Karametra","Adrix and Nev","Kudro"]
known_decks += [s+" Sideboard" for s in known_decks]

known_storage = ["Black Binder", "Pink Binder", "Rare Box", "Eldrazi Bag", "Lesson Bag", "Art Box", "Teferi Box", "Secret Lair", "Werewolf Bag", "Elf Bag", "Penny Cube"]

#Download sheet from
#https://docs.google.com/spreadsheets/d/16PGYqRC3ZkD7fj1u6864EibV97iQGhuuijnm3aMsCug/export?format=xlsx&id=16PGYqRC3ZkD7fj1u6864EibV97iQGhuuijnm3aMsCug

#Used to have a price column to fetch from scryfall, like
#   =MIN(INDEX(IFERROR(IMPORTHTML("https://scryfall.com/search?q=!"""&SUBSTITUTE(SUBSTITUTE(LOWER(REGEXREPLACE(A55,"[.,'-]","")),"+","%2B")," ","+")&"""", "table", 2, "en_US"),IMPORTHTML("https://scryfall.com/search?q=!"""&SUBSTITUTE(SUBSTITUTE(LOWER(REGEXREPLACE(A55,"[.,'-]","")),"+","%2B")," ","+")&"""", "table", 1, "en_US")),0,2))
#but that was too many requests and didn't update.

print("Downloading from sheet")
os.system('wget "https://docs.google.com/spreadsheets/d/16PGYqRC3ZkD7fj1u6864EibV97iQGhuuijnm3aMsCug/export?format=xlsx&id=16PGYqRC3ZkD7fj1u6864EibV97iQGhuuijnm3aMsCug" -O "MTG Ultimate List.xlsx"')
print("Download complete")

file = pd.read_excel("MTG Ultimate List.xlsx", sheet_name=None)
good_sheet_names = ["White","Black","Blue","Red","Green","Multicolored","Colorless","Land"]
good_sheets = [file[color] for color in good_sheet_names]

merge_sheet = pd.concat(good_sheets)

#Check for duplicates
dups = merge_sheet.duplicated(subset="Card Name")

if len(merge_sheet[dups]) > 0:
        print("Duplicates in spreadsheet, can't continue")
        print(merge_sheet[dups])
        exit()

if INCLUDE_PENNY_CUBE:
  merge_sheet = pd.concat([merge_sheet, file["Penny Cube"]])

#Clean up the sheet
merge_sheet = fix_sheet(merge_sheet)

if INCLUDE_PENNY_CUBE:
  smart_join = lambda delim: lambda ss: delim.join(s for s in ss if len(s.strip()) > 0)
  merge_sheet = merge_sheet.groupby('Card Name').agg({
	'Total Copies': sum, 
	'In Use': sum, 
	'Prints': smart_join(', '),
	'Decks' : smart_join('; '),
	'Storage': smart_join(', '),
	'Notes' : smart_join('; ')
	}).reset_index()

#Check the sheet for bad data
print()
print("Checking price changes due to art, printing info on bumps of $1 or more.")
parse_rows(merge_sheet)

#Make a 'decklist' .txt of all free cards
with open('free_cards.txt', 'w') as f:
        for ind, row in merge_sheet.iterrows():
                name, have, used = row["Card Name"], row["Total Copies"], row["In Use"]
                if have == used:
                        #print("No free copies of ",name)
                        continue
                else:
                        _ = f.write(str(have-used)+" "+name+"\n")

#Split into more manageable chunks for e.g. Scryfall decks
os.system("split -l 1000 free_cards.txt free_card_ --additional-suffix=.txt")

print()
print("Printing most expensive cards. Cards over $8:")
prices = []
for cc in merge_sheet["Card Name"]:
  basic_price = min_price(get_scry_json(cc))
  prices += [basic_price]
  if basic_price >= 8:
    print(cc,": "+str(basic_price))

merge_sheet['basic_price'] = prices

card_count = 0
sum_value = 0
max_value = 0
max_card = None
for ind, row in merge_sheet.iterrows():
  price = row['basic_price']
  cnt = row['Total Copies']
  card_count += row['Total Copies']
  sum_value += price*cnt
  if price > max_value:
    max_value = price
    max_card = row['Card Name']

print()
print(len(merge_sheet),"Distinct cards")
print(card_count,"Total Cards")
print("Total Value (any printing):",'${:,.2f}'.format(sum_value),)
print("Additional value due to printings:",'${:,.2f}'.format(delta_price))
print("Highest value card: "+max_card+", "+'${:,.2f}'.format(max_value))


#Make a JSON of all the info
merge_sheet.to_json("MTG.json", orient="records", lines=False)

