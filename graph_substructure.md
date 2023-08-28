# Graph Substructure

There's a lot of fun things to do with graphs! Ways to combine them, or break them apart, or simplify them or make them more complex. And then there's parameters: numbers that quantify something "easy" or "hard" or "big" about the graph, that may or may not play nicely with these operations. And finally, we can run algorithms on graphs, and the runtimes of these algorithms may or may not play nicely with structural changes. This page is my place to collect facts about relative comes of substructure. It's far too disorganized to put anywhere else, but if you ended up here, I hope you get something useful or at least interesting out of it. 😃

Some useful pages elsewhere: [1](https://en.wikipedia.org/wiki/Graph_operations) [2](https://en.wikipedia.org/wiki/Graph_product) [3](https://en.wikipedia.org/wiki/Graph_property)

This page is focused on statements about **unlabelled, simple graphs**. Self-edges may be allowed, those are discussed in the relevant parts. A lack of labelling means that some operations (e.g. zig-zag products) don't apply.

## Binary graph operations

These are operations that combine two graphs into a larger one. The table also describes how the number of vertices and edges grows; whether the operation is commutative and/or associative; what the identity graph is; and then, later maybe, some information about how it affects graph properties. We call our input graphs `G1` and `G2`, and say they have `V1`/`E1` and `V2`/`E2` vertices and edges, respectively. In the "Identity" column, `B1` refers to the single-vertex [Bouquet](https://en.wikipedia.org/wiki/Bouquet_graph): a single self-loop.

| Operation   | Notation/Description | V(f(G,H)) | E(f(G,H)) | Com. | Ass. | Id |
| ----------- | ----------- | --------- | --------- | -- | -- | -- |
| **Product-like**|
| [Cartesian Product](https://en.wikipedia.org/wiki/Cartesian_product_of_graphs) | `G1□G2` | `V1*V2` | `V1*E2 + V2*E1` | ✅ | ✅ | `K1`
| [Tensor Product](https://en.wikipedia.org/wiki/Tensor_product_of_graphs)[^tensorname]    | `G1⨯G2` | `V1*V2` | `2*E1*E2` | ✅ | ✅ | `B1`[^b1id]
| [Strong Product](https://en.wikipedia.org/wiki/Strong_product_of_graphs)  | `G1⊠G2` <br /> Union of `G1□G2` and `G1⨯G2`. | `V1*V2` | `V1*E2 + V2*E1 + 2*E1*E2` | ✅ | ✅ | `K1`
| Co-normal Product | No standard notation <br /> Union of `G1[G2]` and `G2[G1]` | `V1*V2` | `E2*V1^2 + E1*V2^2 - 2*E1*E2` | ✅ | ✅ | `K1`
| [Modular Product](https://en.wikipedia.org/wiki/Modular_product_of_graphs)   | No standard notation <br /> Union of `G1⨯G2` and `G̅1⨯G̅2` | `V1*V2` | `E1*E2 + ((V1^2-V1)/2-E1)*((V2^2-V2)/2-E2)` | ✅ | ✅ | `B1`[^b1id]
| [Lexicographical Product](https://en.wikipedia.org/wiki/Lexicographical_product_of_graphs)[^lexiconame]  | `G1[G2]` | `V1 * V2` | `V1*E2 + E1*V2^2` | ❌ | ✅ | `K1`/`K1`[^lexicoid]
| [Homomorphic Product](https://arxiv.org/abs/1212.1724) | `G1⋉G2` | `V1*V2` | `V1*(V2^2-V2)/2 + E1*V2^2 - 2*E1*E2` | ❌ | ❌ | ❌/`K1`[^homoid]
| [Corona Product](https://link.springer.com/article/10.1007/BF01844162) | `G1○G2` | `V1*(1+V2)` | `E1 + V1*E2 + V1*V2` | ❌ | ❌ | ❌/`K0`[^corona_id]
| **Sum-like** |
| Disjoint Union[^disjointname] | `G1+G2` or `G1⊕G2`| `V1 + V2` | `E1 + E2` | ✅ | ✅ | `K0`
| Graph Join |  No standard notation <br /> `Comp(G̅1⊕G̅2)` | `V1 + V2` | `E1 + E2 + V1*V2` | ✅ | ✅ | `K0`

[^b1id]: Tensor products can be described to have an identity in the form of a single self-loop, the [bouqet](https://en.wikipedia.org/wiki/Bouquet_graph) `B1`. This also works for modular products, if the definition is modified appropriately to handle self-loops a particular way.
[^homoid]: Homomorphic products have the one-vertex zero-edge graph as an identity, but only when on the right side of the operation. On the left side, you _could_ modify the definition to handle self-loops such that `B1` is an identity, but this would be extremely unnatural (while staying compatible with the definition on simple graphs).
[^lexicoid]: `K1` is a two-sided inverse for this non-commutative operation.
[^corona_id]: Corona products have no identity on the left (not even with self-loop tricks), but `K0` is an identity on the right.
[^lexiconame]: Also called the _composition_ of graphs.
[^tensorname]: Also called the _categorical_ product, because it forms the natural product in the category of graphs under graph homomorphisms.

Somewhat notable operations absent from this list include the [rooted product](https://en.wikipedia.org/wiki/Rooted_product_of_graphs), [zigzag product](https://en.wikipedia.org/wiki/Zig-zag_product), [replacement product](https://en.wikipedia.org/wiki/Replacement_product), [series-parallel composition](https://en.wikipedia.org/wiki/Series%E2%80%93parallel_graph), and the [Hajós construction](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction) which require other "information" about the graphs, or only apply to certain graphs.

## Unary Graph Operations
Simple ways to alter a graph. These are "nonspecific": they take a graph and give a graph out. Other actions that target a specific spot, like "trim away a degree zero vertex" or Delta-Wye transformations or vertex contraction, are in the next section.

| Operation       | V | E |
| --------------- | - | - |
| Vertex addition | V+1 | E |
| Universal neighbor addition | V+1 | E+V |
| Complement | V | `V*(V-1)/2 - E`
| Line graph | E | `((sum of d^2)-V)/2`
| [Mycielskian](https://en.wikipedia.org/wiki/Mycielskian) | `2V+1` | `3E+V`
| [Double graph](https://mathworld.wolfram.com/DoubleGraph.html) | `2V` | `4E`
| [Bipartite double](https://mathworld.wolfram.com/BipartiteDoubleGraph.html)[^bipartite_is_tensor] | `2V` | `2E`

## Modifications
These are actions that may often be some kind of simplification.

| Operation | Targets a ... |
| --------- | ------------- |
| Vertex deletion | vertex |
| Edge deletion | edge |
| Dissolution | deg-2 vertex |
| Subdivision | edge |
| Contraction | edge |
| Y-Δ | degree-3 vertex |
| Δ-Y | triangle |

## Graph Parameters

These are different numerical graph parameters that can be computed. They range from very simple (vertex count) to difficult (Shannon capacity). Some are integer, some are real valued.

I try to give the complexity of computing them: P or [NPC](## "NP-Complete"), mostly. I also try to give their parameterized complexity and their complexity of approximation. When the complexity is already P, I mark the other two complexity columns with `-` to show that it's pretty irrelevant[^approxing_p].

"Monotonic" means "how does this change when you add edges?". ⬆️ means it's weakly increasing with edge additions, ⬇️ means it weakly decreasing with edges, and ❌ means that it isn't monotonic.

The "relationship" column is purely subjective: it's the one relationship (to other parameters) that I view as most important in summarizing their relationship to each other. There's certainly room to build this out.

| Name | Notation | Integer? | Complexity | Parameterized | Approximation | Monotonic | Relationship |
| ---- | -------- | -------- | ---------- | ------------- | ------------- | ----------| ------------ |
| **Sizes** |
| Order | V(G) | Y | P | - | - | = | |
| Size | E(G) | Y | P | - | - | ⬆️ | `E ≤ V*(V-1)/2` |
| Max Degree | Δ(G) | Y | P | - | - | ⬆️ | |
| Min Degree |  δ(G) | Y | P | - | - | ⬆️ | |
| **Constraint-Based** |
| Clique No. | ω(G) | Y | NPC | W[1]C | ? | ⬆️ | `ceil(V^2/(V^2 - 2*E)) ≤ ω`[^8] |
| Chromatic No. | χ(G) | Y | NPC | paraNPC[^4] | ... | ⬆️ | ω ≤ χ |
| [Chromatic Index](https://en.wikipedia.org/wiki/Edge_coloring#Definitions) | χ'(G)  | Y | NPC | | | ⬆️ | [Δ ≤ χ' ≤ Δ+1](https://en.wikipedia.org/wiki/Vizing%27s_theorem) |
| Independence No. | α(G) | Y | NPC | ? | ? | ⬇️ | α(G) = ω(G̅) |
| Domination No. | γ(G) | Y | NPC | W[2]C | LogAPXC | ⬆️ | γ ≤ α |
| Independent domination No. | i(G) | Y | ? | ? | ? | ? | γ ≤ i ≤ α |
| [Intersection No.](https://en.wikipedia.org/wiki/Intersection_number_(graph_theory)) | ? | Y | NPC | FPT | NPC?[^9] | ? | ... |
| [Minimum Vertex Cover](https://en.wikipedia.org/wiki/Vertex_cover) |  β(G) | |
| **Connectivity** |
| [Crossing No.](https://en.wikipedia.org/wiki/Crossing_number_(graph_theory)) | cr(G) | Y
| [Hadwiger No.](https://en.wikipedia.org/wiki/Hadwiger_number) | h(G) | Y | NPC | FPT | | ⬆️ | [Does `χ(G) ≤ h(G)`?](https://en.wikipedia.org/wiki/Hadwiger_conjecture_(graph_theory))
| [Conductance](https://en.wikipedia.org/wiki/Conductance_(graph))[^conductance_name] | ϕ(G)[^conductance_name] | N | P | - | - | ⬆️ |
| [Genus](https://mathworld.wolfram.com/GraphGenus.html) | g(G)[^genusnotation] | Y | [NPC](https://www.sciencedirect.com/science/article/pii/0196677489900060?via%3Dihub) | [FPT](https://epubs.siam.org/doi/10.1137/S089548019529248X) | | ⬆️ 
| **Matrix Ranks**
| [Verdière's invariant](https://en.wikipedia.org/wiki/Colin_de_Verdi%C3%A8re_graph_invariant) | μ(G)
| [Minimum rank](https://en.wikipedia.org/wiki/Minimum_rank_of_a_graph) | mr(G)
| **Communication**
| [Lovasz No.](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϑ(G) | N | P | - | - | ? | ω(G) <= ϑ(G̅) <= χ(G) | 
| [Shannon Capacity](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϴ(G) | N | ?[^shannonhard] | - | - | ⬇️ | α <= ϴ <= ϑ |
| [Entanglement-assisted Shannon capacity](https://arxiv.org/pdf/1212.1724.pdf) | ϴ<sup>*</sup>(G)
| [Entanglement-assisted One-Shot Zero-Error capacity](https://arxiv.org/pdf/1212.1724.pdf) | c<sub>0</sub><sup>*</sup>(G)
| **Chromatic-like**
| [Orthogonal rank](https://arxiv.org/pdf/1806.02734.pdf) | ξ(G)
| [Normalized orthogonal rank](https://arxiv.org/pdf/1806.02734.pdf) | ξ'(G)
| [Projective rank](https://arxiv.org/pdf/1212.1724.pdf) | ξ<sub>f</sub>(G)
| [Circular Chromatic No.](https://en.wikipedia.org/wiki/Circular_coloring) | χ<sub>c</sub>(G)
| [Fractional Chromatic No.](https://mathworld.wolfram.com/FractionalChromaticNumber.html) | χ<sub>f</sub>(G)
| [Vector Chromatic No.](https://arxiv.org/abs/cs/9812008) | χ<sub>v</sub>(G)
| [Vectorial Chromatic No.](https://arxiv.org/abs/quant-ph/0608016) | χ<sub>vect</sub>(G)
| [Quantum Chromatic No.](https://arxiv.org/abs/quant-ph/0608016) | χ<sub>q</sub>(G)
| [Rank-1 Quantum Chromatic No.](https://arxiv.org/abs/quant-ph/0608016) | χ<sup>(1)</sup><sub>q</sub>(G)
| **Approximations** |
| [Hajós No.](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number) | h(G) | Y | ?[^6] | - | - | ? | `h <= 2^(V^2/3 - E + 1)`[^6] |
| ["Beta Parameter"](https://arxiv.org/pdf/2308.00753.pdf)[^betaname] | β(G) | N | P? | - | - | ⬇️ | α <= β <= ϑ

[^approxing_p]: It would be an interesting question to see if there are parameters in P that can be efficiently approximated much faster. Spectral radius is an obvious candidate, as current SOTA algorithms compute it in O(n^2.38), which might be slow for some people's tastes. Something like "average pairwise distance" can be computed in O(n^3) time but maybe approximated better. The Lovasz number can be efficiently computed with an SDP but that's moderately slow. Have at it, ye lovers of the [fine-grained](http://people.csail.mit.edu/virgi/6.s078/)!
[^betaname]: I'd personally propose naming this the "quantum independence radius". The authors simply call it the "beta parameter".
[^genusnotation]: Graph genus is often notated as `γ(G)`. We write `g(G)` to avoid conflict with the domination number.
[^shannonhard]: It is unknown whether the Shannon capacity is even decidable.
[^conductance_name]: Conductance is also often called the [Cheeger constant](https://en.wikipedia.org/wiki/Cheeger_constant_(graph_theory)), which is more typical for unweighted graphs. In those contexts, it is written `h(G)`. We use the conductance notation of `ϕ(G)` to avoid conflict with the Hadwiger number.

## Parameters and binary operations

This table describes how parameters change under operations. V and E are omitted, as those are already discussed above.

| Parameter → <br /> ↓ Op| ω | χ | α | γ | i | ϑ | ϴ | β |
| ----------------------- | - | - | - | - | - | - | - | - |
| Cartesian Prod          | ? | [= Max](https://math.stackexchange.com/q/3270041/127777) | [some bounds](https://en.wikipedia.org/wiki/Cartesian_product_of_graphs#Properties) | [≥ Prod?](https://en.wikipedia.org/wiki/Vizing%27s_conjecture) | ? | ? | ? | ? |
| Tensor Prod             | ? | ≤ Min[^hedet] | ? | ? | ? | ? | ? | ? |
| Strong Prod             | = Prod | ? | ? | ? | ? | ? | ? | ? |
| Conormal Prod           | ? | ? | ? | ? | ? | ? | ? | ? |
| Modular Prod            | ? | ? | ? | ? | ? | ? | ? | = Prod |
| Lexico. Prod            | ? | ? | ? | ? | ? | ? | ? | ≥ Prod |
| Homomorphic Prod        | ? | ? | ? | ? | ? | ? | ? | ? |
| Disjoint Union          | = Max | = Max | = Sum | = Sum | ? | ? | ? | ? |
| Graph Join              | = Sum | = Sum | = Max | ≤ 2[^joindomination] | ? | ? | ? | ? |
| **Unary** |
| Mycielskian             | [Max(2,ω)](https://en.wikipedia.org/wiki/Mycielskian#Properties) | χ+1 | [a formula](https://link.springer.com/article/10.1007/s00010-017-0520-9) | γ+1 | ? | ? | ? | ? |

[^hedet]: It was believed that the chromatic number of tensor product was _exatly_ the minimum of the chromatic number of the factors, known as [Hedetniemi's_conjecture](https://en.wikipedia.org/wiki/Hedetniemi%27s_conjecture). It is easy to see that it is at _most_ the minimum of the factors. In 2019 the conjecture was disproved, that the `< Min` case can occur too.
[^joindomination]: The domination number of a graph join is always exactly two (by taking one vertex from each half of the join), _unless_ either factor has a universal vertex (i.e. has a domination number of one), in which case the domination number is one; _unless_ both addends are the empty graph, in which case the domination number is zero.

## Operations and automorphism groups

There's a question of how combining or modifying groups affects their automorphism groups. There is, unfortuntely, often a lot of caveats to these results, because of questions of how components mix or new "unexpected" symmetries can appear.

The only thing I'll say here for now, because it's strange and easily forgotten, is that corona products were [initially defined](https://link.springer.com/article/10.1007/BF01844162) in order to give a graph description of wreath products. As Frucht and Harary prove, the automorphism map `Γ` carries the corona product `G1○G2 `to the group [wreath product](https://en.wikipedia.org/wiki/Wreath_product) -- so, `Γ(G1○G2) = Γ(G1) wr Γ(G2)` -- if and only if: either `G1` has no isolated points or `Comp(G2)` has no isolated points (or both).

Sabidussi [proved](https://projecteuclid.org/journals/duke-mathematical-journal/volume-26/issue-4/The-composition-of-graphs/10.1215/S0012-7094-59-02667-5.short) a similar result that the lexicographic product also "usually" makes a wreath product, under a more complicated condition: if and only if (G1 has no false twins[^deftwin] or G2 is connected) and (G1 has no true twins or `Comp(G2)` is connected).

Disjoint union "usually" becomes a direct product of automorphism groups. There are extra symmetries if there are isomorphic connected components in the original graphs. Graph join also "usually" works, a double graph "usually" gives you `Γ(G) wr Z2`... a bipartite double graph "usually" gives you a semidirect(?) product `Γ(G1) x Z2`, unless G was bipartite to start with, then you get something more like `Γ(G) wr Z2`... and so on.

# TODO

Relationships [here](https://manyu.pro/assets/parameter-hierarchy.pdf)

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
[Fractional chromatic number](https://mathworld.wolfram.com/FractionalChromaticNumber.html) - note that `chi_F(G) * alpha(G) >= V`, which is cool
Various "quantum homomorphism" and "chromatic" numbers
[Linear aboricity](https://en.wikipedia.org/wiki/Linear_arboricity), arboricity, [Acyclic coloring](https://en.wikipedia.org/wiki/Acyclic_coloring), and the [Thue number](https://en.wikipedia.org/wiki/Thue_number) are all mentioned on the "Edge coloring" page with different relationships
"Broadcast coloring" aka "Packing coloring" as mentioned in [this paper](https://www.dmgt.uz.zgora.pl/publish/pdf.php?doi=2337). Also mentions "packing numbers" `η_i`. Here `η_1` is the independence number, and `η_2` is the largest independent set with all vertices more than distance 2, etc. Nice fact: `η_2` is preserved by the Mycielskian if there's no isolated vertices, and `η_3` is preserved if connected.

[^4]: Deciding a fixed parameter (e.g. k=3 -- is the graph 3-colorable?) is already NP-Complete, this gives the parameterized class para-NP-complete, or paraNPC.
[^6]: Proving that `h <= poly(V)` would imply that NP=coNP, see the discussion [here](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number). Little is know about how hard `h` is to compute, except that (trivially) it's in `NEXP` because of the exponential bounds on its size.
[^disjointname]: Also known as graph sum.
[^8]: This is an equivalent way of writing [Turán's theorem](https://en.wikipedia.org/wiki/Tur%C3%A1n%27s_theorem).
[^9]: If I write that something is "NPC" to approximate, this means that I've come across a statement that it's "NP-hard to approximate" and haven't investigated as to _how_ hard to approximate.

[^deftwin]: Vertices are false twins if they have the same open neighborhood (their neighbors, but not including themselves). They are true twins if they have the same closed neighborhod (their neighbors, plus themselves).
[^bipartite_is_tensor]: The bipartite double cover is equivalently a tensor product with K2. 
