# Graph Substructure

There's a lot of fun things to do with graphs! Ways to combine them, or break them apart, or simplify them or make them more complex. And then there's parameters: numbers that quantify something "easy" or "hard" or "big" about the graph, that may or may not play nicely with these operations. And finally, we can run algorithms on graphs, and the runtimes of these algorithms may or may not play nicely with structural changes. This page is my place to collect facts about relative comes of substructure. It's far too disorganized to put anywhere else, but if you ended up here, I hope you get something useful or at least interesting out of it. 😃

Some useful pages elsewhere: [1](https://en.wikipedia.org/wiki/Graph_operations) [2](https://en.wikipedia.org/wiki/Graph_product) [3](https://en.wikipedia.org/wiki/Graph_property)

This page is focused on statements about **unlabelled, simple graphs**. Self-edges may be allowed, those are discussed in the relevant parts. A lack of labelling means that some operations (e.g. zig-zag products) don't apply.

## Binary graph operations

These are operations that combine two graphs into a larger one. The table also describes how the number of vertices and edges grows; whether the operation is commutative and/or associative; what the identity graph is; and then, later maybe, some information about how it affects graph properties. For convention, our "basic" graphs" are: `B0` is the zero-vertex graph, `B1` is the one-vertex graph, `B20` is the two-vertex graph with no edges, and `B21` is the two-vertex graph with one edge. I would like to call these `G1` and so on, but that would leave confusion about what the graphs in the operation are, which are `G1` and `G2` here. We say they have `V1`/`E1` and `V2`/`E2` vertices and edges, respectively.

| Operation   | Notation | V(f(G,H)) | E(f(G,H)) | Comm? | Assoc? | Id |
| ----------- | ----------- | --------- | --------- | -- | -- | -- |
| **Products** |
| Cartesian Product | `G1□G2`. [Defn.](https://en.wikipedia.org/wiki/Cartesian_product_of_graphs) | `V1 * V2` | `V1*E2 + V2*E1` | ✅ | ✅ | `B1`
| Tensor Product    | `G1⨯G2`. [Defn.](https://en.wikipedia.org/wiki/Tensor_product_of_graphs) | `V1 * V2` | `2*E1*E2` | ✅ | ✅ | ❌[^1]
| Strong Product    | `G1⊠G2`. [Defn.](https://en.wikipedia.org/wiki/Strong_product_of_graphs) - Union of cartesian product with tensor product. | `V1 * V2` | `V1*E2 + V2*E1 + 2*E1*E2` | ✅ | ✅ | `B1`
| Co-normal Product | No standard notation. Union of `G1[G2]` and `G2[G1]` (lexicographical products) | `V1 * V2` | `V1^2 * E2 + V2^2 * E1 - 2*E1*E2` | ✅ | ✅ | `B1`
| Modular Product   | [Defn.](https://en.wikipedia.org/wiki/Modular_product_of_graphs) - Union of tensor product with tensor product of complements. | `V1 * V2` | `E1*E2 + ((V1^2-V1)/2 - E1)*((V2^2-V2)/2 - E2)` | ✅ | ✅ | ❌[^1]
| Lexicographical Product   | `G1[G2]`. [Defn.](https://en.wikipedia.org/wiki/Lexicographical_product_of_graphs) | `V1 * V2` | `V1*E2 + E2*V1^2` | ❌ | ✅ | `B1`[^3]
| Homomorphic Product   | `G1⋉G2`. [Defn.](https://en.wikipedia.org/wiki/Graph_product) | `V1 * V2` | `V1 * (V2^2-V2)/2 + E1 * V2^2 - 2*E1*E2` | ❌ | ❌ | `B1`[^2]
| ----------- | ----------- | --------- | --------- | -- | -- | -- |
| **Sums** |
| Disjoint Union[^7] | `G1⊕G2` | `V1+V2` | `E1+E2` | ✅ | ✅ | `B0`


Somewhat notable operations absent from this list include the [rooted product](https://en.wikipedia.org/wiki/Rooted_product_of_graphs), [zigzag product](https://en.wikipedia.org/wiki/Zig-zag_product), [replacement product](https://en.wikipedia.org/wiki/Replacement_product), the [Hajós construction](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction) which require other "information" about the graphs, or only apply to certain graphs.

## Unary Graph Operations

TODO

## Graph Parameters

The "relationship" column is purely subjective: it's the one relationship (to other parameters) that I view as most important in summarizing their relationship to each other. There's certainly room to build this out.

| Name | Notation | Integer? | Complexity | Parameterized | Approximation | Relationship |
| ---- | -------- | -------- | ---------- | ------------- | ------------- | ------------ |
| **Sizes** |
| Order | V(G) | Y | P | - | - | - |
| Size | E(G) | Y | P | - | - | `E <= V*(V-1)/2` | 
| **Structures** |
| Clique No. | ω(G) | Y | NPC | W[1]C | ? | `ceil(V^2/(V^2 - 2*E)) <= ω`[^8] |
| Chromatic No. | χ(G) | Y | NPC | paraNPC[^4] | ... | ω <= χ |
| Independence No. | α(G) | Y | NPC | ? | ? | α(G) = ω(G̅) |
| Domination No. | γ(G) | Y | NPC | W[2]C | LogAPXC | γ <= α |
| Independent domination No. | i(G) | Y | ? | ? | ? | γ <= i <= α |
| [Intersection No.](https://en.wikipedia.org/wiki/Intersection_number_(graph_theory)) | ? | Y | NPC | FPT | NPC?[^9] | ... |
| [Minimum Vertex Cover](https://en.wikipedia.org/wiki/Vertex_cover) |  β(G) | ....... |
| **Approximations** |
| [Lovasz No.](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϑ(G) | N | P | - | - | ω(G) <= ϑ(G̅) <= χ(G) | 
| [Shannon Capacity](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϴ(G) | N | ?[^5] | - | - | α <= ϴ <= ϑ |
| [Hajós No.](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number) | h(G) | Y | ?[^6] | - | - | `h <= 2^(V^2/3 - E + 1)`[^6] |

## Parameters and binary operations

This table is to document how parameters change under operations. V and E are omitted, as those are already discussed above.

| v Op \ Param > | ω | χ | α | γ | i | ϑ | ϴ | 
| ---------------| - | - | - | - | - | - | - |
| Cartesian Prod | ? | ? | ? | [Vizing's conjecture](https://en.wikipedia.org/wiki/Vizing%27s_conjecture) | ? | ? | ? |
| Tensor Prod    | ? | ? | ? | ? | ? | ? | ? |
| Strong Prod    | ? | ? | ? | ? | ? | ? | ? |
| Conormal Prod  | ? | ? | ? | ? | ? | ? | ? |
| Modular Prod   | ? | ? | ? | ? | ? | ? | ? |
| Lexico. Prod   | ? | ? | ? | ? | ? | ? | ? |
|Homomorphic Prod| ? | ? | ? | ? | ? | ? | ? |



[^1]: Tensor products can be described to have an identity in the form of a single self-loop. This also works for modular products, if the definition is modified appropriately to handle self-loops a particular way.
[^2]: Homomorphic products have the one-vertex zero-edge graph as an identity, but only when on the right side of the operation. On the left side, there again is no identity in the normal sense, but the definition can be extended to graphs with self-loops to allow the single loop to act as an identity.
[^3]: Two-sided inverse for this non-commutative operation.
[^4]: Deciding a fixed parameter (e.g. k=3 -- is the graph 3-colorable?) is already NP-Complete, this gives the parameterized class para-NP-complete, or paraNPC.
[^5]: It is unknown whether the Shannon capacity is even decidable.
[^6]: Proving that `h <= poly(V)` would imply that NP=coNP, see the discussion [here](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number). Little is know about how hard `h` is to compute, except that (trivially) it's in `NEXP` because of the exponential bounds on its size.
[^7]: Also known as graph sum.
[^8]: This is an equivalent way of writing [Turán's theorem](https://en.wikipedia.org/wiki/Tur%C3%A1n%27s_theorem).
[^9]: If I write that something is "NPC" to approximate, this means that I've come across a statement that it's "NP-hard to approximate" and haven't investigated as to _how_ hard to approximate.
