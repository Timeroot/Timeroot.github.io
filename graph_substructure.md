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
| Graph square | V | - | |

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

[^dissolution_name]: _Dissolution_ is also called _Smoothing_. "Dissolution" is unfortunately both the name of the operation (on one vertex) and a relationship between graphs G and H, if H is formed from G by repeated dissolution.
[^subdivision_name]: _Subdivision_ is also called _Expansion_
[^lifting_p3]: Lifting targets a `P_3`, or path graph on 3-vertices: two edges (u,v) and (v,w) that share a common endpoint.

# Graph Substructures

There are a lot of different ways to say that a graph G "contains a copy" of H. The strictest notion is that of graph isomorphism: G and H must identical, up to a relabelling of vertices. Other substructure relationships are typically defined in one of two ways.

The first is by modifications. We would say that G contains H if we can follow a list of permitted operations on G to eventually reach a graph isomorphic with H. (Dually, we could give allowed operations to _grow_ H into G.) For example, "induced subgraph" is defined by vertex deletions, while "subgraph" also allows edge deletions.

The second way to define a substructure by a mapping. There we would say that G contains H if there's a map $f_V : V(H) \to V(G)$, and possibly a map for $f_E$ as well, obeying some kind of morphism-like condition. For example, "subgraph" is defined by injective maps f<sub>V</sub> that preserve adjacency. "Induced subgraph" requires that f<sub>V</sub> also preserves _non_-adjacency. Where possible, this table tries to describe substructure both ways. It may be necessary that f<sub>V</sub> maps a vertex in H to a whole _set_ of vertices in G, or vice versa, or likewise for f<sub>E</sub>.

For each notion of substructure, one key aspect is its order structure: does it obey the descending chain condition (or the _ascending_ chain condition)? Is it well quasi ordered? Is it, in fact, an equivalence class? These get their own columns, with an ❌ or ✅. For those with an ❌, a comment like `K_n` means that the complete graphs form a counterexample[^wqo_counter].

[^wqo_counter]: When we say that K<sub>n</sub> is a "counterexample" to an ordering property, we mean that the property implies something about a set that fails. For instance, the Well Quasi Ordering condition, WQO, states that there should be no infinite _antichains_, no infinite set of graphs that all fails to be ordered by the relationship. K<sub>n</sub> shows that graph isomorphism is not WQO, because it forms an infinite set of graphs that are all nonisomorphic. The cycle graphs C<sub>n</sub> show that subgraph and induced subgraph are not WQO, because none of the cycle graphs have each other as subgraphs.

The last question is, how computationally difficult is to recognize inclusion? We can allow H to vary with G, in which case aim for a categorization as `P`, `NPC`, or `GIC`[^gic_class]. If we hold H fixed with `k` many vertices, then we aim to categorize as `FPT`, `W[1]C`, `XP`, or `paraNPC`[^paranpc]. I write that a class is "_trivially_ FPT" if it runs in time `f(k)*O(1)`, usually because there are only finitely many graphs that any H can embed in (as is the case with graph isomorphism). Again, we try to give an obvious class exhibiting the difficulty[^difficulty_example] if possible, or if not, a reference.

[^gic_class]: `P` is polynomial time to recognize if G contains H. `NPC` means it is NP-complete. For insta
[^paranpc]: ParaNPC means that deciding a fixed parameter (e.g. k=3 -- is the graph 3-colorable?) is already NP-Complete, this gives the parameterized class para-NP-complete, or paraNPC.
[^difficulty_example]: Cliques are a "classic" example of (induced) subgraph recognition being NP-complete, because MAX-CLIQUE is an NP-complete problem. For another example, cycles are an example of why "spanning subgraph" is hard to check, because a cycle that is a spanning subgraph of G is a Hamiltonian cycle, and Hamiltonian cycle checking is NP-complete.

| Name | Operations | Map $f_V : H \to G$ | DCC | ACC | WQO | Equiv | Complexity | Parameterized |
| ---- | ---------- | -------------- | --- | --- | --- | ----- | ---------- | ------------- |
| Graph Isomorphism | _None_ | $u\sim v \iff f(u) \sim f(v)$<br />f<sub>V</sub> bijective | ✅ | ✅ | ❌<br />$K_n$ | ✅ | GIC | _trivially_ FPT<br />Fixed vertex count |
| Induced Subgraph[^induced_name] | Vertex deletion | $u\sim v \iff f(u) \sim f(v)$<br />f<sub>V</sub> injective | ✅ | ❌<br />$K_n$ | [❌](https://onlinelibrary.wiley.com/doi/10.1002/jgt.3190140406)<br />$C_n$ | ❌ | NPC <br /> $K_n$, Max-clique | W\[1\]C <br /> $K_n$ |
| Subgraph | Vertex deletion <br /> Edge deletion | $u\sim v \implies f(u) \sim f(v)$<br />f<sub>V</sub> injective | ✅ | ❌<br />$K_n$ | [❌](https://onlinelibrary.wiley.com/doi/epdf/10.1002/jgt.3190160509)<br />$C_n$ | ❌ | NPC <br /> $K_n$, Max-clique | W\[1\]C <br /> $K_n$ |
| Spanning Subgraph | Edge deletion | $u\sim v \implies f(u) \sim f(v)$<br />f<sub>V</sub> bijective | ✅ | ✅ | ❌<br />$C_n$ | ❌ | NPC <br /> $C_n$, Hamiltonian cycle | _trivially_ FPT<br />Fixed vertex count |
| Dissolution[^dissol_dual] | Dissolution | $f_V$ injective <br /> $f_E$ takes edges in H to degree-2 _paths_ in G<br />$f_E$ bijective | ✅ | ❌<br />$K_n$ | ❌<br />$K_n$ | ❌ | NPC <br /> [^dissol_npc_ref] | FPT[^dissol_fpt_explanation]
| Homeomorphism | Dissolution <br /> Subdivision | $f_V$ bijects vertices of degree not 2 <br /> $f_E$ takes degree-2 paths in H to degree-2 paths in G<br />$f_E$ bijective  | ✅ | ✅ | ❌<br />$K_n$ | ✅ | GIC[^homeo_gic] | FPT[^dissol_fpt_explanation] |
| [Minor](https://en.wikipedia.org/wiki/Graph_minor) | Vertex deletion<br />Edge deleition<br />Contraction | f | ✅ | ❌<br />$K_n$ | ✅ | ❌ | [NPC](https://en.wikipedia.org/wiki/Graph_minor#Algorithms)<br />$C_n$, Hamiltonian cycle | [FPT](https://en.wikipedia.org/wiki/Robertson%E2%80%93Seymour_theorem#Fixed-parameter_tractability) |
| [Topological Minor](https://en.wikipedia.org/wiki/Graph_minor#Topological_minors)[^topminor_name] | Vertex deletion<br />Edge deletion<br />Dissolution | f | ✅ | ❌<br />$K_n$ | [❌](https://www.lirmm.fr/~sau/talks/JCALM-2013-Bidimensionality-Ignasi.pdf) | ❌ | NPC<br />$C_n$, Hamiltonian cycle | [FPT](https://dl.acm.org/doi/10.1145/1993636.1993700) |
| [Induced Minor](https://en.wikipedia.org/wiki/Graph_minor#Induced_minors) | Vertex deletion<br />Contraction | f | ✅ | ❌<br />$K_n$ | [❌](https://www.sciencedirect.com/science/article/pii/S0095895618300443) | ❌ | NPC<br />$C_n$, Hamiltonian cycle | [Open? (2012)](https://www.sciencedirect.com/science/article/pii/S0166218X10001642) |
| [Induced Topological Minor](https://mathoverflow.net/q/380218/97603) | Vertex deletion <br />Dissolution | f | ✅ | ❌<br />$K_n$ | ❌[^itm_not_wqo] | ❌ | NPC<br />$C_n$, Hamiltonian cycle | p |
| [Contraction Minor](https://arxiv.org/abs/0812.1064) | Contraction | f | ✅ | ❌ | [❌](https://www.lirmm.fr/~sau/talks/JCALM-2013-Bidimensionality-Ignasi.pdf) | ❌ | [NPC](https://www.sciencedirect.com/science/article/pii/S0166218X10001642) | [This](https://www.sciencedirect.com/science/article/pii/S0166218X10001642) claims it's open as of 2012. [This](https://www.lirmm.fr/~sau/talks/JCALM-2013-Bidimensionality-Ignasi.pdf) claims it's NP hard even when $V(H)=4$. |
| Induced Immersion | Vertex deletion<br />Lifting<br />_(Multiedges?)_ | f | d | a | w | ❌ | c | p |
| [Immersion Minor](https://www.sciencedirect.com/science/article/pii/S0095895622000752)[^immersion_name] | Vertex deletion<br />Edge deletion<br />Lifting<br /> | $f_V$ injective<br />$f_E$ takes edges in H to _edge-disjoint paths_ in G | d | a | w | ❌ | c | [FPT](https://dl.acm.org/doi/10.1145/1993636.1993700) |
| Weak Immersion | Vertex deletion<br />Edge deletion<br />Lifting<br />Subdivision<br />_(Multiedges? Dissolution?)_ | f | d | a | w | ❌ | c | p |
| Strong Immersion | o | f | d | a | w | ❌ | c | p |
| Homomorphism | Vertex identification<br />vertex addition<br />Edge addition<br />_Multiedge simplification_ | $u\sim v \implies f(u) \sim f(v)$<br />f<sub>V</sub> may be many-to-one | d | a | w | ❌ | c | p |
| Homomorphic Equivalence | o | Homomorphism from G to H<br />Homomorphism from H to G | d | a | w | ✅ | c | p |
| Faithful Homomorphism | o | $u\sim v \implies f(u) \sim f(v)$<br />$f(u) \sim f(v) \implies \exists x,y: x\sim y \wedge f(x)=f(u) \wedge f(y)=f(v)$[^faithful_explanation]<br />f<sub>V</sub> may be many-to-one | d | a | w | ❌ | c | p |
| Full Homomorphism[^full_homo_name] | o | $u\sim v \implies f(u) \sim f(v)$<br />$u \not\sim y \implies f(u) \not\sim f(v)$<br />f<sub>V</sub> may be many-to-one | d | a | w | ❌ | c | p |
| Epimorphism[^epimorphism_name] | o | f | d | a | w | ❌ | c | p |
| Monomorphism[^monomorphism_name] | o | f | d | a | w | ❌ | c | p |

TODO: There's [_restricted immersion minors_](https://www.sciencedirect.com/science/article/pii/S0012365X1830058X) which are like immersion minors but preserve planarity in interesting ways, by restricting which contractions are "admissible". They also define _co-immersion minors_ based on a new operation called _constriction_; and accordingly, _restricted co-immersion minors_. They were all inspired by the [bipartite minors](https://www.sciencedirect.com/science/article/pii/S0095895615001057), which involve peripheral cycles as an alternate form admissibility.

[^induced_name]: We could say, H is an induced subgraph of G iff there is an injective homomorphism that preserves adjacency and non-adjacency. From the perspective of a graph as a relational structure (with the only relation between adjacency), "induced subgraph" is then the same as the notion of [embedding](https://en.wikipedia.org/wiki/Embedding#Universal_algebra_and_model_theory) used in universal algebra and logic. So, occasionally the relationship of graphs is referred to as "embedding", or the mapping as "the embedding". But this should not be confused with the notion of [Graph embedding](https://en.wikipedia.org/wiki/Graph_embedding), which studies ways to put graphs on surfaces of different genera, or crossing numbers and the like.
[^dissol_dual]: While H is a _dissolution_ of G if G can be reduced to H by repeatedly dissolving degree-2 vertices, the dual relationship is that G is a _subdivision_ of H, by repeatedly subdividing the edges of H.
[^dissol_npc_ref]: NP-Hardness was originally "observed" in [On the complexity of finding iso-and other morphisms for partial k-trees](https://www.sciencedirect.com/science/article/pii/0012365X9290687B) by J. Matoušek, R. Thomas, although the reduction is somewhat nontrivial and doesn't seem to be written down anywhere.
[^dissol_fpt_explanation]: There is a simple FPT algorithm for dissolution checking. We'll say that a vertex is a _branchpoint_ if it has degree 3 or more. Dissolution preserves the number of branchpoints in a graph, so first check that G and H have the same number of branchpoints. There are at most $k=V(H)$ many branchpoints in H, and so at most $k$ many branchpoints in G as well. Then just check each of the $k!$ different ways to map the branchpoints of H to those of G. A map is a valid solution if the paths a given pair of branchpoints in G are longer than the paths between the corresponding branchpoints in H. So each map can be checked in $O(n)$ time, and the dissolution can be checked in $O(k^k n)$ time. For homeomorphism checking, the same algorithm can be used, where all applicable dissolutions are first applied.
[^homeo_gic]: To test the homeomorphism of two graphs, first apply all possible dissolutions, so that there are no degree-2 vertices. What is left is a graph isomorphism problem, so this is in the complexity class GI. On the other hand, any GI problem can be turned into a homeomorphism problem by appropriately "decorating" all the degree-2 vertices so that they are no longer degree-2, with a unqiue decoration so that they cannot be confused for anything other than what was once a degree-2 vertex. For instance, decorating each vertex with $|V(G)|+1$ many degree-1 neighbors is enough.
[^itm_not_wqo]: Graphs that are induced topological minors _must_ also be topological minors, and induced minors. Since neither of those are well-quasi-ordered (see the table for references), induced topological minors can't be WQO either.
[^topminor_name]: _Topological minor_ is also known as _Topological subgraph_ or _Homeomorphic subgraph_. For instance, see the Wiki article on (Kuratowski's theorem)[https://en.wikipedia.org/wiki/Kuratowski%27s_theorem].
[^immersion_name]: _Immersion minor_ is also known as just _Immersion_. Some authors, e.g. [this](https://www.sciencedirect.com/science/article/pii/S0012365X1830058X) distinguish that H is the _immersion minor_ of G, and the mapping $f$ is the _immersion_ itself.
[^faithful_explanation]: The difference between an ordinary homomorphism, _faithful_ homomorphism, and _full_ homomorphism is as follows. All of them agree that edges must map to edges. A full homomorphism requires that non-edges map to non-edges, or we could equivalently say that only "necessary" edges appear in the image. A faithful homomorphism says for each edge in the image, _at least one_ edge in the preimage must map there, so it's a weaker notion of what a "necessary" edge is. There's more discussion [here](https://math.stackexchange.com/a/2705649/127777).
[^full_homo_name]: _Full homomorphism_ is also known as _Strong homomorphism_, especially from the perspective of universal algebra and mathematical logic.
[^epimorphism_name]: _Epimorphism_ is also known as _Surjective homomorphism_.
[^monomorphism_name]: _Monomorphism_ is also known as _Injective homomorphism_.

<div style="display:none">
|| '''Homomorphism''' 
| 
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
