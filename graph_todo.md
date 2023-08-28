# TODO List
For [this](./graph_parameters) and [this](./graph_substructure) page.

Relationships [here](https://manyu.pro/assets/parameter-hierarchy.pdf) and [here](https://core.ac.uk/download/pdf/30926677.pdf)

Subgraph finding as I started [here](https://complexityzoo.net/User:Timeroot)

Different kinds of relationships based on categories: [1](https://scholarworks.umt.edu/cgi/viewcontent.cgi?referer=&httpsredir=1&article=1986&context=etd), [2](https://cstheory.stackexchange.com/questions/40769/the-chromatic-number-of-a-graph-as-a-functor), [3](https://cstheory.stackexchange.com/questions/40769/the-chromatic-number-of-a-graph-as-a-functor)

Other good things to add:

[https://en.wikipedia.org/wiki/Crossing_number_inequality]

[`μ(G) >= cr(G) + 3`](https://en.wikipedia.org/wiki/Colin_de_Verdi%C3%A8re_graph_invariant#Other_properties)

Conjecture: [`μ(G) + 1 >= χ(G)`](https://en.wikipedia.org/wiki/Colin_de_Verdi%C3%A8re_graph_invariant#Chromatic_number)

Conjecture: [relationship between μ and χ](https://en.wikipedia.org/wiki/Albertson_conjecture)

[Pebbling](https://en.wikipedia.org/wiki/Graph_pebbling#Graham's_pebbling_conjecture)

[Turza](https://en.wikipedia.org/wiki/Tuza%27s_conjecture)

[Book embedding](https://en.wikipedia.org/wiki/Book_embedding#Relation_to_other_graph_invariants)

Vizing's theorem

[https://en.wikipedia.org/wiki/Goldberg%E2%80%93Seymour_conjecture]

[thickness](https://en.wikipedia.org/wiki/Thickness_(graph_theory))

Standard FPT parameters (treewidth/branchwidth/pathwidth/[twinwidth](https://en.wikipedia.org/wiki/Twin-width))

[FVS](https://en.wikipedia.org/wiki/Feedback_vertex_set)

[Spectral radius](https://en.wikipedia.org/wiki/Spectral_radius)

[Largest nonblocker](https://en.wikipedia.org/wiki/Nonblocker)

[Brooks' theorem](https://en.wikipedia.org/wiki/Brooks%27_theorem)

[Queue](https://en.wikipedia.org/wiki/Queue_number) number (analogous to stacknumber aka book thickness)

[k-planarity?](https://en.wikipedia.org/wiki/1-planar_graph) - not sure if this is really a parameter

[Bondage number](https://en.wikipedia.org/wiki/Bondage_number)

[Fractional chromatic number](https://mathworld.wolfram.com/FractionalChromaticNumber.html) - note that `chi_F(G) * alpha(G) >= V`, which is coolVarious "quantum homomorphism" and "chromatic" numbers

[Linear aboricity](https://en.wikipedia.org/wiki/Linear_arboricity), arboricity, [Acyclic coloring](https://en.wikipedia.org/wiki/Acyclic_coloring), and the [Thue number](https://en.wikipedia.org/wiki/Thue_number) are all mentioned on the "Edge coloring" page with different relationships

"Broadcast coloring" aka "Packing coloring" as mentioned in [this paper](https://www.dmgt.uz.zgora.pl/publish/pdf.php?doi=2337). Also mentions "packing numbers" `η_i`. Here `η_1` is the independence number, and `η_2` is the largest independent set with all vertices more than distance 2, etc. Nice fact: `η_2` is preserved by the Mycielskian if there's no isolated vertices, and `η_3` is preserved if connected.

See [this](https://en.wikipedia.org/wiki/Induced_path#Algorithms_and_complexity) -- maximum induced path length ("detour number"), maximum induced cycle length, induced path number, and induced path cover -- seem related to parameterized complexity (detour number ~= tree-depth (only for sparse graphs?)), and it's cool that detour number is within a constant factor hard to approximate as independent sets. Check [Hostad](https://en.wikipedia.org/wiki/Induced_path#CITEREFH%C3%A5stad1996) for info on how hard that is

[Bandwidth](https://mathworld.wolfram.com/GraphBandwidth.html) and ... [broadcast time](https://mathworld.wolfram.com/BroadcastTime.html) for "gossip"?

Average distance-ish things: [Wiener](https://mathworld.wolfram.com/WienerIndex.html), [Wiener Sum](https://mathworld.wolfram.com/WienerSumIndex.html), [Balaban](https://mathworld.wolfram.com/BalabanIndex.html), [Kirckhoff](https://mathworld.wolfram.com/KirchhoffIndex.html) 

[Algebraic connectivity](https://en.wikipedia.org/wiki/Algebraic_connectivity) describes mixing time. It has good relationships and bounds. Unfortunately, standards are a bit of a mess of _which_ Laplacian matrix you use. See [MathWorld](https://mathworld.wolfram.com/FiedlerVector.html) too.