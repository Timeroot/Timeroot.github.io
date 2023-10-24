# Hello!

Hi! My name's Alex Meiburg.

I'm at postdoc at [University of Waterloo's IQC](https://uwaterloo.ca/institute-for-quantum-computing/) and the [Perimeter Institute](https://perimeterinstitute.ca/). My interests generally consist of quantum information and quantum complexity theory. I got my physics PhD at [UC Santa Barbara](https://www.physics.ucsb.edu/) in June 2023, advised by [Bela Bauer](https://scholar.google.com/citations?user=38AoAQ8AAAAJ&hl=en), funded by [Microsoft Station Q](https://www.microsoft.com/en-us/research/people/belabaue/). My undergrad was at Caltech where I earned a dual B.S. in Math and Physics.

## This site

I've got a few pages you might like, if you like complexity theory, graph theory, or math in general.

I have a page for discussing different types of [graph substrcture](./graph_substructure), such as the different ways to combine graphs together, modify them, or recognize different types of graph 'containment'. There's a related page for [graph parameters](./graph_parameters).

I collect [fun math terms](./fun_names). Please let me know about other ones to add!

And then I (try to) maintain a [browseable complexity zoo](./ZooClasses/). This is based on the [Complexity Zoo wiki](https://complexityzoo.net/Complexity_Zoo), but mine aims to be machine readable. [This](./ZooClasses/) is the pretty viewer and [this](https://github.com/Timeroot/ZooClasses/) is the GitHub repo if you have suggestions.

## Stuff I've Done

Below I've gathered my more successful pursuits. You can also check out [my blog](http://blog.ohaithe.re), <a href='javascript:;' id='email_button' onclick='document.getElementById("email_button").outerHTML=atob("ZW1haWwgbWU6IGFsZXhAb2hhaXRoZS5yZSwgb3IgYW1laWJ1cmdAdWNzYi5lZHU=");'>email me (click to show)</a>, or look at [other links](/links.html).  Here's a link to [my resume](resume.pdf).

### Papers

 * In 2016, I became interested in the CSP Dichotomy Conjecture, which was  proved independently by [Zhuk](https://arxiv.org/abs/1704.01914) and [Bulatov](https://arxiv.org/abs/1703.03021) at essentially the same time in 2017. This states that all constraint problems are in **P**  or are **NP-Complete**. Since quantum constraint problems were known to include at least the additional cases of **QMA_1**, and **MA**, I wanted to know what other possibilities there were -- the obvious one being **BQP**, the problems efficiently solvable by a quantum computer. I successfully [showed this in 2021](https://arxiv.org/abs/2101.08381), also getting the cases **QCMA** and **coRP** in the process.
 * I was trying to work out some more exact formulas for [Quantum State Tomography](https://en.wikipedia.org/wiki/Quantum_tomography) when I realized that the expressions were in fact [matrix permanents](https://en.wikipedia.org/wiki/Permanent_(mathematics)). I failed to find an efficient algorithm for computing these formulas, and instead showed that they were NP-hard to compute. But, [this resolved an important open problem](https://arxiv.org/abs/2111.03142) about the hardness of Positive Semidefinite Permanents, which [arise in thermal BosonSampling problems](https://strawberryfields.ai/photonics/demos/run_boson_sampling.html) and has [been discussed in several contexts](http://ieee-focs.org/FOCS-2017-Papers/3464a914.pdf). [The paper](https://ieeexplore.ieee.org/iel7/9996589/9996592/09996919.pdf) was presented at FOCS 2022.
 * [My first paper with my advisor](https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.4.023128) has involved applying Gaussian Fermionic Matrix Product States to more efficiently simulate quasi-1D fermion systems (read: problems involving electrons, where the material is much longer than it is wide). We showed that we could use this to e.g. explore superconductivity at weak couplings much faster and more accurately.
 * My second paper with my advisor is on better inference of Green's functions from noisy NISQy samaples, based on [his prior work](https://journals.aps.org/prx/abstract/10.1103/PhysRevX.6.031045). It seems to reasonably provide a factor of ~100x improvement on sample complexity, on problems of interest.
 * An internship with [Zapata Computing](https://www.zapatacomputing.com/) in Summer 2022 lead to a work on extending Matrix Product States to continuous-valued data. Paper still in preparation, but I [presented](./papers_presentations/Meiburg-ContinuousMPS-APS_March23.pptx) on it at March Meeting 2023.

On the less serious side,
 * The summer before college I worked with the [Climate Hazards Center](https://chc.ucsb.edu/) at UCSB's Geography department. My small portion of the work consisted of trying various ways to filter clouds out of infrared satellite imagery, in order to infer a more complete temperature record. [The paper](https://journals.ametsoc.org/view/journals/clim/32/17/jcli-d-18-0698.1.xml) has more citations than the rest of my work combined, ironically.
 * I'm interested in the [PACE challenge](https://pacechallenge.org/), and I participated in the 2022 version, of computing a minimal Directed Feedback Vertex Set. My submission was the second-highest scoring, but a bug at submission time (fixed shortly after) disqualified it from a prize. The submission was somewhat unique in that I did not code any search routines whatsoever: it just (_very_) aggressively simplifies the problem, and then hands it off to an ILP optimizer (SCIP). 🥲 Code is [here](https://github.com/Timeroot/DVFS_PACE2022), writeup is [here](https://arxiv.org/abs/2208.01119).
   * This led to development of Java support for SCIP, a separate project [here](https://github.com/Timeroot/JNA_SCIP).
 * There's a cute question regarding the convergence of the [Flint-Hills series](https://mathworld.wolfram.com/FlintHillsSeries.html) and the irrationality measure of Pi. This was pointed out in a [work](https://arxiv.org/abs/1104.5100) of Max Alekseyev. I was able to prove a [converse](https://arxiv.org/abs/2208.13356), at which point I was informed that the converse had already been proven [in a MathOverflow comment](https://mathoverflow.net/a/24712/97603)!

In the likely event that this page is out of date (Last Updated: Jun 2023), you can check my [Google Scholar](https://scholar.google.com/citations?user=ef4Pv9YAAAAJ&hl=en).

#### Presentations

You can see my [PhD defense](./papers_presentations/phd_defense_presentation.mp4) and [accompanying slides](./papers_presentations/Thesis_Defense.pdf).

[Here's](./papers_presentations/Advancement%20to%20Candidacy%20Presentation.pdf) my Advancement to Candidacy presentation, which was on the BQP-complete constraint problems.

[This](./papers_presentations/Permanents__FOCS22_presentation.pdf) was my presentations on PSD permanent hardness for FOCS 2022.

[This](./papers_presentations/APS%20March%202022_%20GFMPS%20gHF.pdf) was my presentation on generalized Hartree-Fock, for APS March Meeting 2022.

[This](./papers_presentations/Meiburg-ContinuousMPS-APS_March23.pdf) was my presentation ([PPT](./papers_presentations/Meiburg-ContinuousMPS-APS_March23.pptx)) on Continuous-valued Matrix Product States, for APS March Meeting 2023. 

### Teaching
In Fall 2022, I taught a course on numerical algorithms for engineers. Course webpage [here](./ME140A/ME140A.md).

### Computer Security

In high school I co-founded 1064CBread, a [competitive computer-hacking team](https://www.hackthebox.com/blog/what-is-ctf). We won first place in [PicoCTF 2013](https://picoctf.org/about), which was aimed at high schoolers. We then decided to aim higher at the college-level [CSAW CTF](https://www.csaw.io/ctf). To our surprise, we qualified for the finals, and got to fly across the country to NYC. After that we had a decently successful run, becoming finalists or winners in quite a number of competitions and winning prize money here and there. Although we've been less active in recent years, we were finalists in [Hack-A-Sat 2020](https://www.hackasat.com/hackasat1), an Air Force competition about satellite hacking, where _**we won $10k and a satellite**_.

You can [find a lot of my writeups on my blog](https://blog.ohaithe.re/search/ctf). The team also has [a Github repo](https://github.com/1064CBread), and [a CTFTime page](https://ctftime.org/team/5320).

I've also played with UCSB's team [Shellphish](https://shellphish.net/index.html) a few times, although I've never been a core member by any means.

#### Vulnerabilities

In 2016, I found a security vulnerability in Facebook Messenger and received a bug bounty for reporting it. They promptly fixed it.

In 2012 I found a trivially exploitable vulnerability in a popular online education platform. They have still have not patched it, despite a few reminders on my part.

In 2020 I found a vulnerability in a popular online cloud computing platform. It was patched quicky, but sadly I did not receive a bounty, and they've expressed that they would prefer I not talk about it publically -- as some users likely using old versions of the software locally and could remain vulnerable.

### Finance

I've enjoyed applying my math knowledge to win some money with [Quantiacs](https://quantiacs.com/). My code has managed several million USD for them over the years, and [they came to Caltech and did an inteview with me](https://quantiacs.com/community/topic/19/interview-with-alex-trust-the-numbers). It's given me a useful side-income. I think that a worrying large fraction of quantitative finance is essentially numerology, and that approaches should either rely on news and principals (which I will readily I admit I know nothing about) or principled mathematical foundations - _not_ just drawing lines on a graph or magic numbers.

Here are some examples of "explanations" that I think are, frankly, garbage: [1](https://www.fxstreet.com/education/lessons-from-the-pros-forex-201106280000), [2](https://www.tradingview.com/chart/TVIX/wAzZ5VBq-TVIX-Futures-Pivotal-Point/), [3](https://www.kotaksecurities.com/blog/intelligence/technical-funda/heres-how-to-use-golden-ratio-and-fibonacci-sequence-in-trading.html).

I'm legally required, I think, to make clear that _I'm not providing investment advice!_ - but if you want to talk math and stocks, I'd be happy to chat. Just email.

### Fun

I enjoy the card game _Magic: the Gathering_ and have [a page to sort and search](./mtg_search.html) through my pretty sizable card collection. It intelligently cross-references with Scryfall, to allow more sophisticated searching. I also had a [phone-based scavenger hunt](/.hunt.html) that I used to propose to my now-wife.

I made a simple little game and got it featured on Steam! It's called [Quatris](https://store.steampowered.com/app/888140/Quatris/) and it's _Free_, wow, what a steal! I made it with my friends Charlie and Cole in high school but didn't put it online until a while later. Hey, it even has achievements!

I enjoy attending [MIT Mystery Hunt](https://www.mit.edu/~puzzle/) each year, and [other](http://2018.caltechpuzzlehunt.org/), [similar](https://2020.galacticpuzzlehunt.com/), [events](https://2021.teammatehunt.com/).

Back in high school I ran a coded chat platfom for fans of the webcomic [https://www.homestuck.com/](Homestuck) to hang out together. During its prime years, the site had roughly 100k distinct monthly users.
