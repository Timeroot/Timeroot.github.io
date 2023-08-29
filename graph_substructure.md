# Graph Operations
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

| Operation       | V | E | Notes |
| --------------- | - | - | ----- |
| Vertex addition | V+1 | E | |
| Universal neighbor addition | V+1 | E+V | Add a vertex neighboring everything else. 
| Complement | V | `V*(V-1)/2 - E` |
| Line graph | E | `((sum of d^2)-V)/2` |
| [Mycielskian](https://en.wikipedia.org/wiki/Mycielskian) | `2V+1` | `3E+V`
| [Double graph](https://mathworld.wolfram.com/DoubleGraph.html) | `2V` | `4E`
| [Bipartite double](https://mathworld.wolfram.com/BipartiteDoubleGraph.html)[^bipartite_is_tensor] | `2V` | `2E`

## Modifications
These are moderately "atomic" actions that act a single location. They are defined here primarily so that we can then discus which other things _respect_ these modifications: for instance, "H is a subgraph of G" respect edge _deletion_ on H, but not edge _contraction_. If you replace "subgraph" with "induced subgraph", then edge deletion is no longer compatible; if you use "minor", then edge contraction is also compatible.

| Operation | Targets a ... | Description | Notes |
| --------- | ------------- | ----------- | ----- |
| Vertex deletion | Vertex | Remove a vertex from the graph, and all edges using that vertex | |
| Edge deletion | Edge | Remove an edge from a graph | |
| Dissolution[^dissolution_name] | Degree-2 vertex | Given a degree-2 vertex u with neighbors v and w, remove u and add an edge (v,w). | If working in a setting where loops are allowed: u cannot have a loop. <br /> In a setting where multiedges are allowed: if v and w are neighbors, then this creates a multiedge. If v=w, then dissolution creates a loop at v. As a consequence, if multiedges _are_ allowed and loops _aren't_ allowed, and v=w, then u cannot be dissolved. |
| Subdivision[^subdivision_name] | Edge | Given an edge (v,w), remove that edge, create a new vertex u, and add edges (v,u) and (u,w). | Dissolution is the inverse operation to subdivision.
| Vertex Identification | Two vertices | Given two distinct vertices u and v, delete v. For each edge (v,w) that was deleted, add a new edge (u,w) | If loops are allowed: this creates a loop if u and v are neighbors. <br /> If multiedges are allowed: this can create multiedges where there previously were none, if u and v had neighbors in common. |
| Contraction | Edge | The same as vertex identification, but restricted to the case where u and v are neighbors. It differs in that, even if loops are allowed, no loop is created.
| Lifting | `P_3`[^lifting_p3]  | If there is an edge (u,v) and another edge (v,w), then remove these two edges from the graph and add an edge (u,w). | Lifting and vertex deletion together can effect dissolution. |
| Multiedge simplification | Multiedge | If there are multiple edges (u,v), then remove one of them. | Special case of edge deletion. Obviously only applies in settings where multiedges are allowed. |
| Loop simplification | Loop | Remove a loop. | Special case of edge deletion. Obviously only applies in settings where loops are allowed. |
| Y-Δ | Degree-3 vertex | Remove u with neighbors v, w, and x. Add edges (v,w), (v,x), and (w,x). | Inverse of Δ-Y |
| Δ-Y | Triangle | Remove the edges (v,w), (v,x) and (w,x), add a new vertex u, and add edges (u,v), (u,w), (u,x). | Inverse of Y-Δ, exept that in settings without multiedges this can lose edges that were "doubled up" during the Y-Δ.
| Detwinning | Twin pair | Given a pair of true twins[^deftwin] u and v, delete v. |

[^dissolution_name]: _Dissolution_ is also called _Smoothing_
[^subdivision_name]: _Subdivision_ is also called _Expansion_
[^lifting_p3]: Lifting targets a `P_3`, or path graph on 3-vertices: two edges (u,v) and (v,w) that share a common endpoint.

# Graph Substructures

There are a lot of different ways to say that a graph G "contains a copy" of H. The strictest notion is that of graph isomorphism: G and H must identical, up to a relabelling of vertices. Other substructure relationships are typically defined in one of two ways.

The first is by modifications. We would say that G contains H if we can follow a list of permitted operations on G to eventually reach a graph isomorphic with H. (Dually, we could give allowed operations to _grow_ H into G.) For example, "induced subgraph" is defined by vertex deletions, while "subgraph" also allows edge deletions.

The second way to define a substructure by a mapping. There we would say that G contains H if there's a map f<sub>V</sub> : V(H) → V(G), and possibly a map for f<sub>E</sub> as well, obeying some kind of morphism-like condition. For example, "subgraph" is defined by injective maps f<sub>V</sub> that preserve adjacency. "Induced subgraph" requires that f<sub>V</sub> also preserves _non_-adjacency. Where possible, this table tries to describe substructure both ways.

For each notion of substructure, one key aspect is its order structure: does it obey the descending chain condition (or the _ascending_ chain condition)? Is it well quasi ordered? Is it, in fact, an equivalence class? These get their own columns, with an ❌ or ✅. For those with an ❌, a comment like `K_n` means that the complete graphs form a counterexample[^wqo_counter].

[^wqo_counter]: When we say that K<sub>n</sub> is a "counterexample" to an ordering property, we mean that the property implies something about a set that fails. For instance, the Well Quasi Ordering condition, WQO, states that there should be no infinite _antichains_, no infinite set of graphs that all fails to be ordered by the relationship. K<sub>n</sub> shows that graph isomorphism is not WQO, because it forms an infinite set of graphs that are all nonisomorphic. The cycle graphs C<sub>n</sub> show that subgraph and induced subgraph are not WQO, because none of the cycle graphs have each other as subgraphs.

The last question is, how computationally difficult is to recognize inclusion? We can allow H to vary with G, in which case aim for a categorization as `P`, `NPC`, or `GIC`[^gic_class]. If we hold H fixed with `k` many vertices, then we aim to categorize as `FPT`, `W[1]C`, `XP`, or `paraNPC`[^paranpc]. I write that a class is "_trivially_ FPT" if it runs in time `f(k)*O(1)`, usually because there are only finitely many graphs that any H can embed in (as is the case with graph isomorphism). Again, we try to give an obvious class exhibiting the difficulty[^difficulty_example] if possible, or if not, a reference.

[^gic_class]: `P` is polynomial time to recognize if G contains H. `NPC` means it is NP-complete. For insta
[^paranpc]: ParaNPC means that deciding a fixed parameter (e.g. k=3 -- is the graph 3-colorable?) is already NP-Complete, this gives the parameterized class para-NP-complete, or paraNPC.
[^difficulty_example]: Cliques are a "classic" example of (induced) subgraph recognition being NP-complete, because MAX-CLIQUE is an NP-complete problem. For another example, cycles are an example of why "spanning subgraph" is hard to check, because a cycle that is a spanning subgraph of G is a Hamiltonian cycle, and Hamiltonian cycle checking is NP-complete.

| Name | Reductions | Map f: H → G | DCC | ACC | WQO | Equiv | Complexity | Parameterized |
| ---- | ---------- | -------------- | --- | --- | --- | ----- | ---------- | ------------- |
| Graph Isomorphism | _None_ | E(u,v) ↔ E(f(u), f(v))<br />f<sub>V</sub> bijective | ✅ | ✅ | ❌<br />K<sub>n</sub> | ✅ | GIC <br /> e<sup>O(log<sup>3</sup> G)</sup> [Ref](https://cstheory.stackexchange.com/a/40373/12211)  | _trivially_ FPT |

<div style="display:none">
|-
|| '''Induced Subgraph'''
| Vertex deletion || '''E'''(u,v) ↔ '''E'''(''f''(u), ''f''(v))<br />''f''<sub>V</sub> injective || Not WQO (e.g. Cn)<br />DCC || NP-Complete (cliques) <br /> G<sup>H+2</sup> <br /> 2<sup>o(G)</sup> || W[1]-Complete (cliques) <br /> G<sup>H+2</sup> <br /> f(H)G<sup>o(H)</sup>
|-
|| '''Subgraph'''
| Vertex deletion, Edge deletion || '''E'''(u,v)  → '''E'''(''f''(u), ''f''(v))<br />''f''<sub>V</sub> injective || Not WQO (e.g. Cn)<br />DCC || NP-Complete (cliques) <br /> G<sup>H+2</sup> <br /> 2<sup>o(G)</sup> || W[1]-Complete (cliques) <br /> G<sup>H+2</sup> <br /> f(H)G<sup>o(H)</sup>
|-
|| '''Spanning Subgraph'''
| Edge deletion || '''E'''(u,v)  → '''E'''(''f''(u), ''f''(v))<br />''f''<sub>V</sub> bijective || Not WQO (e.g. Cn)<br />DCC, ACC || NP-Complete (Hamiltonian cycle) <br /> G<sup>H+2</sup> <br /> 2<sup>o(G)</sup> || ''Trivial'' <br />(Fixed vertex count; ACC)
|-
|| '''Dissolution''' <br />Dual to '''Subdivision'''
| Vertex Dissolution || ''f''<sub>V</sub> injective<br />''f''<sub>E</sub> carries edges to distinct induced paths || Not WQO (e.g. Kn)<br />DCC || NP-Complete ''[2]'' <br /> G<sup>H+2</sup> <br /> 2<sup>o(G)</sup> || FPT<br />H<sup>H</sup>G<br />2<sup>o(H)</sup>G ''[3]''
|-
|| '''Homeomorphism''' 
| Dissolution, Subdivision
|-
|| '''Induced Topological Minor''' 
| Vertex deletion, smoothing<br />(Multiedge simplification?)
|-
|| '''Topological Minor''' 
| Vertex deletion, edge deletion, smoothing
|-
|| '''Induced Minor''' 
| Vertex deletion, contraction<br />(Multiedge simplification?)
|-
|| '''Minor''' 
| Vertex deletion, edge deletion, contraction
|-
|| '''Induced Immersion''' 
| Vertex deletion, lifting<br />(Multiedge simplification?)
|-
|| '''Immersion''' 
| Vertex deletion, edge deletion, lifting
|-
|| '''Weak Immersion''' 
| Vertex deletion, edge deletion, lifting, subdivision<br />(smoothing?)
|-
|| '''Strong Immersion''' 
| ...complicated...
|-
|| '''Homomorphism''' 
| Vertex identification, multiedge simplification<br />vertex addition, edge addition
|-
|| '''Homomorphic Equivalence''' 
| Homo both ways
|-
|| '''Full Homomorphism''' 
| Homo: Edge preserving + non-edge preserving
|-
|| '''Surjective Homomorphism''' <br /> aka '''Epimorphism'''
| no vertex addition
|-
|| '''Faithful Homomorphism''' 
| https://math.stackexchange.com/questions/2704804/what-is-the-difference-between-a-full-and-a-faithful-graph-homomorphism
|-
|| '''Injective Homomorphism'''<br /> aka '''Monomorphism''' 
| Homo: Edge preserving + injective<br />same as subgraph, unless there are multiple edges
|-
|| "'''Embedding'''" 
| Homo: Edge preserving + injective + non-edge preserving<br />same as induced subgraph, unless there are multiple edges
|-
|}
</div>


# Automorphism groups

There's a question of how combining or modifying groups affects their automorphism groups. There is, unfortuntely, often a lot of caveats to these results, because of questions of how components mix or new "unexpected" symmetries can appear.

The only thing I'll say here for now, because it's strange and easily forgotten, is that corona products were [initially defined](https://link.springer.com/article/10.1007/BF01844162) in order to give a graph description of wreath products. As Frucht and Harary prove, the automorphism map `Γ` carries the corona product `G1○G2 `to the group [wreath product](https://en.wikipedia.org/wiki/Wreath_product) -- so, `Γ(G1○G2) = Γ(G1) wr Γ(G2)` -- if and only if: either `G1` has no isolated points or `Comp(G2)` has no isolated points (or both).

Sabidussi [proved](https://projecteuclid.org/journals/duke-mathematical-journal/volume-26/issue-4/The-composition-of-graphs/10.1215/S0012-7094-59-02667-5.short) a similar result that the lexicographic product also "usually" makes a wreath product, under a more complicated condition: if and only if (G1 has no false twins[^deftwin] or G2 is connected) and (G1 has no true twins or `Comp(G2)` is connected).

Disjoint union "usually" becomes a direct product of automorphism groups. There are extra symmetries if there are isomorphic connected components in the original graphs. Graph join also "usually" works, a double graph "usually" gives you `Γ(G) wr Z2`... a bipartite double graph "usually" gives you a semidirect(?) product `Γ(G1) x Z2`, unless G was bipartite to start with, then you get something more like `Γ(G) wr Z2`... and so on.

## Footnotes

I have a [todo list](./graph_todo) for this page.

[^disjointname]: Also known as graph sum.
[^deftwin]: Vertices are false twins if they have the same open neighborhood (their neighbors, but not including themselves). They are true twins if they have the same closed neighborhod (their neighbors, plus themselves).
[^bipartite_is_tensor]: The bipartite double cover is equivalently a tensor product with K2. 
