# Graph Substructure
#### See also the [parameters](./graph_parameters) page

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

## Operations and automorphism groups

There's a question of how combining or modifying groups affects their automorphism groups. There is, unfortuntely, often a lot of caveats to these results, because of questions of how components mix or new "unexpected" symmetries can appear.

The only thing I'll say here for now, because it's strange and easily forgotten, is that corona products were [initially defined](https://link.springer.com/article/10.1007/BF01844162) in order to give a graph description of wreath products. As Frucht and Harary prove, the automorphism map `Γ` carries the corona product `G1○G2 `to the group [wreath product](https://en.wikipedia.org/wiki/Wreath_product) -- so, `Γ(G1○G2) = Γ(G1) wr Γ(G2)` -- if and only if: either `G1` has no isolated points or `Comp(G2)` has no isolated points (or both).

Sabidussi [proved](https://projecteuclid.org/journals/duke-mathematical-journal/volume-26/issue-4/The-composition-of-graphs/10.1215/S0012-7094-59-02667-5.short) a similar result that the lexicographic product also "usually" makes a wreath product, under a more complicated condition: if and only if (G1 has no false twins[^deftwin] or G2 is connected) and (G1 has no true twins or `Comp(G2)` is connected).

Disjoint union "usually" becomes a direct product of automorphism groups. There are extra symmetries if there are isomorphic connected components in the original graphs. Graph join also "usually" works, a double graph "usually" gives you `Γ(G) wr Z2`... a bipartite double graph "usually" gives you a semidirect(?) product `Γ(G1) x Z2`, unless G was bipartite to start with, then you get something more like `Γ(G) wr Z2`... and so on.

## Footnotes

I have a [todo list](./graph_todo) for this page.

[^disjointname]: Also known as graph sum.
[^deftwin]: Vertices are false twins if they have the same open neighborhood (their neighbors, but not including themselves). They are true twins if they have the same closed neighborhod (their neighbors, plus themselves).
[^bipartite_is_tensor]: The bipartite double cover is equivalently a tensor product with K2. 
