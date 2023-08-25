# Graph Substructure

There's a lot of fun things to do with graphs! Ways to combine them, or break them apart, or simplify them or make them more complex. And then there's parameters: numbers that quantify something "easy" or "hard" or "big" about the graph, that may or may not play nicely with these operations. And finally, we can run algorithms on graphs, and the runtimes of these algorithms may or may not play nicely with structural changes. This page is my place to collect facts about relative comes of substructure. It's far too disorganized to put anywhere else, but if you ended up here, I hope you get something useful or at least interesting out of it. 😃

Some useful pages elsewhere: [1](https://en.wikipedia.org/wiki/Graph_operations) [2](https://en.wikipedia.org/wiki/Graph_product) [3](https://en.wikipedia.org/wiki/Graph_property)

This page is focused on statements about **unlabelled, simple graphs**. Self-edges may be allowed, those are discussed in the relevant parts. A lack of labelling means that some operations (e.g. zig-zag products) don't apply.

## Binary graph operations

These are operations that combine two graphs into a larger one. The table also describes how the number of vertices and edges grows; whether the operation is commutative and/or associative; what the identity graph is; and then, later maybe, some information about how it affects graph properties. We call our input graphs `G1` and `G2`, and say they have `V1`/`E1` and `V2`/`E2` vertices and edges, respectively.

| Operation   | Notation, definition | V(f(G,H)) | E(f(G,H)) | Comm? | Assoc? | Id |
| ----------- | ----------- | --------- | --------- | -- | -- | -- |
| **Product-like** |
| Cartesian Product | `G1□G2`. [Defn.](https://en.wikipedia.org/wiki/Cartesian_product_of_graphs) | `V1 * V2` | `V1*E2 + V2*E1` | ✅ | ✅ | `K1`
| Tensor Product[^tensorname]    | `G1⨯G2`. [Defn.](https://en.wikipedia.org/wiki/Tensor_product_of_graphs) | `V1 * V2` | `2*E1*E2` | ✅ | ✅ | ❌[^1]
| Strong Product    | `G1⊠G2`. [Defn.](https://en.wikipedia.org/wiki/Strong_product_of_graphs) - Union of cartesian product with tensor product. | `V1 * V2` | `V1*E2 + V2*E1 + 2*E1*E2` | ✅ | ✅ | `K1`
| Co-normal Product | No standard notation. Union of `G1[G2]` and `G2[G1]` (lexicographical products) | `V1 * V2` | `V1^2 * E2 + V2^2 * E1 - 2*E1*E2` | ✅ | ✅ | `K1`
| Modular Product   | [Defn.](https://en.wikipedia.org/wiki/Modular_product_of_graphs) - Union of tensor product with tensor product of complements. | `V1 * V2` | `E1*E2 + ((V1^2-V1)/2 - E1)*((V2^2-V2)/2 - E2)` | ✅ | ✅ | ❌[^1]
| Lexicographical Product[^lexiconame]   | `G1[G2]`. [Defn.](https://en.wikipedia.org/wiki/Lexicographical_product_of_graphs) | `V1 * V2` | `V1*E2 + E1*V2^2` | ❌ | ✅ | `K1`[^3]
| Homomorphic Product   | `G1⋉G2`. [Defn.](https://en.wikipedia.org/wiki/Graph_product) | `V1 * V2` | `V1 * (V2^2-V2)/2 + E1 * V2^2 - 2*E1*E2` | ❌ | ❌ | `K1`[^2]
| Corona Product   | `G1○G2`. [Defn.](https://link.springer.com/article/10.1007/BF01844162) | `V1 * (1 + V2)` | `E1 + V1*E2 + V1*V2` | ❌ | ❌ | ❌/`K0`[^corona_id]
| ----------- | ----------- | --------- | --------- | -- | -- | -- |
| **Sum-like** |
| Disjoint Union[^disjointname] | `G1+G2` or `G1⊕G2`| `V1+V2` | `E1+E2` | ✅ | ✅ | `K0`
| Graph Join | `Comp(G̅1⊕G̅1)` | `V1+V2` | `E1+E2+V1*V2` | ✅ | ✅ | `K0`


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

The "relationship" column is purely subjective: it's the one relationship (to other parameters) that I view as most important in summarizing their relationship to each other. There's certainly room to build this out.

| Name | Notation | Integer? | Complexity | Parameterized | Approximation | Relationship |
| ---- | -------- | -------- | ---------- | ------------- | ------------- | ------------ |
| **Sizes** |
| Order | V(G) | Y | P | - | - | - |
| Size | E(G) | Y | P | - | - | `E <= V*(V-1)/2` |
| Max Degree | Δ(G)
| Min Degree |  δ(G)
| **Constraint-Based** |
| Clique No. | ω(G) | Y | NPC | W[1]C | ? | `ceil(V^2/(V^2 - 2*E)) <= ω`[^8] |
| Chromatic No. | χ(G) | Y | NPC | paraNPC[^4] | ... | ω <= χ |
| Independence No. | α(G) | Y | NPC | ? | ? | α(G) = ω(G̅) |
| Domination No. | γ(G) | Y | NPC | W[2]C | LogAPXC | γ <= α |
| Independent domination No. | i(G) | Y | ? | ? | ? | γ <= i <= α |
| [Intersection No.](https://en.wikipedia.org/wiki/Intersection_number_(graph_theory)) | ? | Y | NPC | FPT | NPC?[^9] | ... |
| [Minimum Vertex Cover](https://en.wikipedia.org/wiki/Vertex_cover) |  β(G) | ....... |
| **Connectivity** |
| Crossing number | cr(G) |
| [Hadwiger number](https://en.wikipedia.org/wiki/Hadwiger_number) | h(G) |
| [Conductance](https://en.wikipedia.org/wiki/Conductance_(graph))[^conductance_name] | ϕ(G) |
| **Ranks**
| [Verdière's invariant](https://en.wikipedia.org/wiki/Colin_de_Verdi%C3%A8re_graph_invariant) | μ(G)
| [Minimum rank](https://en.wikipedia.org/wiki/Minimum_rank_of_a_graph) | mr(G)
| **Approximations** |
| [Lovasz No.](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϑ(G) | N | P | - | - | ω(G) <= ϑ(G̅) <= χ(G) | 
| [Shannon Capacity](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϴ(G) | N | ?[^5] | - | - | α <= ϴ <= ϑ |
| [Hajós No.](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number) | h(G) | Y | ?[^6] | - | - | `h <= 2^(V^2/3 - E + 1)`[^6] |
| ["Beta Parameter"](https://arxiv.org/pdf/2308.00753.pdf)[^betaname] | β(G) | N | P? | - | - | α <= β <= ϑ

[^betaname]: I'd personally propose naming this the "quantum independence radius". The authors simply call it the "beta parameter".

## Parameters and binary operations

This table describes how parameters change under operations. V and E are omitted, as those are already discussed above.

| ↓ Op \ Parameter → | ω | χ | α | γ | i | ϑ | ϴ | β |
| -------------------| - | - | - | - | - | - | - | - |
| Cartesian Prod     | ? | =Max | [some bounds](https://en.wikipedia.org/wiki/Cartesian_product_of_graphs#Properties) | [Vizing's conjecture](https://en.wikipedia.org/wiki/Vizing%27s_conjecture) | ? | ? | ? | ? |
| Tensor Prod        | ? | [Hedetniemi's_conjecture](https://en.wikipedia.org/wiki/Hedetniemi%27s_conjecture) is false. <= min. | ? | ? | ? | ? | ? | ? |
| Strong Prod        | ? | ? | ? | ? | ? | ? | ? | ? |
| Conormal Prod      | ? | ? | ? | ? | ? | ? | ? | ? |
| Modular Prod       | ? | ? | ? | ? | ? | ? | ? | = Prod |
| Lexico. Prod       | ? | ? | ? | ? | ? | ? | ? | >= Prod |
| Homomorphic Prod   | ? | ? | ? | ? | ? | ? | ? | ? |
| Disjoint Union     | ? | ? | = Sum| ? | ? | ? | ? | ? |
| Graph Join         | ? | ? | = Max| ? | ? | ? | ? | ? |
| Mycielskian        | ? | +1| ? | ? | ? | ? | ? | ? |

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
Graph genus
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

[^1]: Tensor products can be described to have an identity in the form of a single self-loop. This also works for modular products, if the definition is modified appropriately to handle self-loops a particular way.
[^2]: Homomorphic products have the one-vertex zero-edge graph as an identity, but only when on the right side of the operation. On the left side, there again is no identity in the normal sense, but the definition can be extended to graphs with self-loops to allow the single loop to act as an identity.
[^3]: Two-sided inverse for this non-commutative operation.
[^4]: Deciding a fixed parameter (e.g. k=3 -- is the graph 3-colorable?) is already NP-Complete, this gives the parameterized class para-NP-complete, or paraNPC.
[^5]: It is unknown whether the Shannon capacity is even decidable.
[^6]: Proving that `h <= poly(V)` would imply that NP=coNP, see the discussion [here](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number). Little is know about how hard `h` is to compute, except that (trivially) it's in `NEXP` because of the exponential bounds on its size.
[^disjointname]: Also known as graph sum.
[^8]: This is an equivalent way of writing [Turán's theorem](https://en.wikipedia.org/wiki/Tur%C3%A1n%27s_theorem).
[^9]: If I write that something is "NPC" to approximate, this means that I've come across a statement that it's "NP-hard to approximate" and haven't investigated as to _how_ hard to approximate.
[^corona_id]: Corona products have no identity on the left (not even with self-loop tricks), but `K0` is an identity on the right.
[^lexiconame]: Also called the _composition_ of graphs.
[^tensorname]: Also called the _categorical_ product, because it forms the natural product in the category of graphs under graph homomorphisms.
[^deftwin]: Vertices are false twins if they have the same open neighborhood (their neighbors, but not including themselves). They are true twins if they have the same closed neighborhod (their neighbors, plus themselves).
[^conductance_name]: Conductance is also often called the [Cheeger constant](https://en.wikipedia.org/wiki/Cheeger_constant_(graph_theory)), which is more typical for unweighted graphs. In those contexts, it is written h(G). We use the conductance notation of ϕ(G) to minimize collision with the Hadwiger number.
[^bipartite_is_double]: The bipartite double cover is equivalently a tensor product with K2. 
