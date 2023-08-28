# Graph Parameters
#### See also the [substructure](./graph_substructure) page

These are different numerical graph parameters that can be computed. They range from very simple (vertex count) to difficult (Shannon capacity). Some are integer, some are real valued.

I try to give the complexity of computing them: P or [NPC](## "NP-Complete"), mostly. I also try to give their parameterized complexity and their complexity of approximation. When the complexity is already P, I mark the other two complexity columns with `-` to show that it's pretty irrelevant[^approxing_p].

"Monotonic" means "how does this change when you add edges?". ⬆️ means it's weakly increasing with edge additions, ⬇️ means it weakly decreasing with edges, and ❌ means that it isn't monotonic.

The "relationship" column is purely subjective: it's the one relationship (to other parameters) that I view as most important in summarizing their relationship to each other. There's certainly room to build this out. If the row says something like `i | c | p | a | m | r`, that's just placeholder for me to fill in later.

| Name | Notation | Integer? | Complexity | Parameterized | Approximation | Monotonic | Relationship |
| ---- | -------- | -------- | ---------- | ------------- | ------------- | ----------| ------------ |
| **Sizes** |
| Order | V(G) | Y | P | - | - | = | |
| Size | E(G) | Y | P | - | - | ⬆️ | `E ≤ V*(V-1)/2` |
| Max Degree | Δ(G) | Y | P | - | - | ⬆️ | |
| Min Degree |  δ(G) | Y | P | - | - | ⬆️ | |
| Radius | r(G) | Y | P | - | - | ⬆️ | |
| Diameter | d(G) | Y | P | - | - | ⬆️ | |
| [Girth](https://en.wikipedia.org/wiki/Girth_(graph_theory)) | g(G) | Y | P | - | - | ⬇️ | |
| **Constraint-Based** |
| Clique No. | ω(G) | Y | NPC | W[1]C | a | ⬆️ | `ceil(V^2/(V^2 - 2*E)) ≤ ω`[^cliquebound] |
| Chromatic No. | χ(G) | Y | NPC | paraNPC[^paranpc] | ... | ⬆️ | ω ≤ χ |
| [Chromatic Index](https://en.wikipedia.org/wiki/Edge_coloring#Definitions) | χ'(G)  | Y | NPC | | | ⬆️ | [Δ ≤ χ' ≤ Δ+1](https://en.wikipedia.org/wiki/Vizing%27s_theorem) |
| Independence No. | α(G) | Y | NPC | p | a | ⬇️ | α(G) = ω(G̅) |
| Domination No. | γ(G) | Y | NPC | W[2]C | LogAPXC | ⬆️ | γ ≤ α |
| Independent domination No. | i(G) | Y | c | p | a | r | γ ≤ i ≤ α |
| [Intersection No.](https://en.wikipedia.org/wiki/Intersection_number_(graph_theory)) | ? | Y | NPC | FPT | NPC?[^npcapprox] | ? | ... |
| [Minimum Vertex Cover](https://en.wikipedia.org/wiki/Vertex_cover) |  VC(G) | Y | c | p | a | m | r
| **Connectivity** |
| [Crossing No.](https://en.wikipedia.org/wiki/Crossing_number_(graph_theory)) | cr(G) | Y | c | p | a | m | r
| [Hadwiger No.](https://en.wikipedia.org/wiki/Hadwiger_number) | h(G) | Y | NPC | FPT | | ⬆️ | [Does `χ(G) ≤ h(G)`?](https://en.wikipedia.org/wiki/Hadwiger_conjecture_(graph_theory))
| [Conductance](https://en.wikipedia.org/wiki/Conductance_(graph))[^conductance_name] | ϕ(G)[^conductance_name] | N | P | - | - | ⬆️ | r
| [Genus](https://mathworld.wolfram.com/GraphGenus.html) | gn(G)[^genusnotation] | Y | [NPC](https://www.sciencedirect.com/science/article/pii/0196677489900060?via%3Dihub) | [FPT](https://epubs.siam.org/doi/10.1137/S089548019529248X) | | ⬆️ 
| [Edge-connectivity](https://en.wikipedia.org/wiki/K-edge-connected_graph) | ec(G)[^nonstandard_notation] | Y | P | - | - | ⬆️ | r
| [Vertex-connectivity](https://en.wikipedia.org/wiki/K-vertex-connected_graph) | vcn(G)[^nonstandard_notation] | Y | P | - | - | ⬆️ | r
| [Circumference](https://mathworld.wolfram.com/GraphCircumference.html) | cfr(G)[^nonstandard_notation] | Y | [NPC](https://en.wikipedia.org/wiki/Hamiltonian_path_problem#Complexity) | p | a | ⬆️ | r
| **Matrix Ranks**
| [Verdière's invariant](https://en.wikipedia.org/wiki/Colin_de_Verdi%C3%A8re_graph_invariant) | μ(G) | i | c | p | a | m | r
| [Minimum rank](https://en.wikipedia.org/wiki/Minimum_rank_of_a_graph) | mr(G) | i | c | p | a | m | r
| **Independence-like**
| [Lovasz No.](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϑ(G) | N | P | - | - | ? | ω(G) <= ϑ(G̅) <= χ(G) | 
| [Shannon Capacity](https://en.wikipedia.org/wiki/Lov%C3%A1sz_number) | ϴ(G) | N | ?[^shannonhard] | - | - | ⬇️ | α <= ϴ <= ϑ |
| [Entanglement-assisted Shannon capacity](https://arxiv.org/pdf/1212.1724.pdf) | ϴ<sup>*</sup>(G) | i | c | p | a | m | r
| [Entanglement-assisted One-Shot Zero-Error capacity](https://arxiv.org/pdf/1212.1724.pdf) | c<sub>0</sub><sup>*</sup>(G) | i | c | p | a | m | r
| ["Beta Parameter"](https://arxiv.org/pdf/2308.00753.pdf)[^betaname] | β(G) | N | P? | - | - | ⬇️ | α <= β <= ϑ
| **Chromatic-like**
| [Orthogonal rank](https://arxiv.org/pdf/1806.02734.pdf) | ξ(G) | i | c | p | a | m | r
| [Normalized orthogonal rank](https://arxiv.org/pdf/1806.02734.pdf) | ξ'(G) | i | c | p | a | m | r
| [Projective rank](https://arxiv.org/pdf/1212.1724.pdf) | ξ<sub>f</sub>(G) | i | c | p | a | m | r
| [Circular Chromatic No.](https://en.wikipedia.org/wiki/Circular_coloring) | χ<sub>c</sub>(G) | i | c | p | a | m | r
| [Fractional Chromatic No.](https://mathworld.wolfram.com/FractionalChromaticNumber.html) | χ<sub>f</sub>(G) | i | c | p | a | m | r
| [Vector Chromatic No.](https://arxiv.org/abs/cs/9812008) | χ<sub>v</sub>(G) | i | c | p | a | m | r
| [Vectorial Chromatic No.](https://arxiv.org/abs/quant-ph/0608016) | χ<sub>vect</sub>(G) | i | c | p | a | m | r
| [Quantum Chromatic No.](https://arxiv.org/abs/quant-ph/0608016) | χ<sub>q</sub>(G) | i | c | p | a | m | r
| [Rank-1 Quantum Chromatic No.](https://arxiv.org/abs/quant-ph/0608016) | χ<sup>(1)</sup><sub>q</sub>(G) | i | c | p | a | m | r
| **Other?** |
| [Hajós No.](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number) | h(G) | Y | ?[^hajos] | - | - | ? | `h <= 2^(V^2/3 - E + 1)`[^hajos] |

[^approxing_p]: It would be an interesting question to see if there are parameters in P that can be efficiently approximated much faster. Spectral radius is an obvious candidate, as current SOTA algorithms compute it in O(n^2.38), which might be slow for some people's tastes. Something like "average pairwise distance" can be computed in O(n^3) time but maybe approximated better. The Lovasz number can be efficiently computed with an SDP but that's moderately slow. Have at it, ye lovers of the [fine-grained](http://people.csail.mit.edu/virgi/6.s078/)!
[^betaname]: I'd personally propose naming this the "quantum independence radius". The authors simply call it the "beta parameter".
[^genusnotation]: Graph genus is often notated as `γ(G)`. We write `gn(G)` to avoid conflict with the domination number `γ(G)` and girth `g(G)`.
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

## Footnotes

I have a [todo list](./graph_todo) for this page.

[^cliquebound]: This is an equivalent way of writing [Turán's theorem](https://en.wikipedia.org/wiki/Tur%C3%A1n%27s_theorem).
[^npcapprox]: If I write that something is "NPC" to approximate, this means that I've come across a statement that it's "NP-hard to approximate" and haven't investigated as to _how_ hard to approximate.
[^paranpc]: Deciding a fixed parameter (e.g. k=3 -- is the graph 3-colorable?) is already NP-Complete, this gives the parameterized class para-NP-complete, or paraNPC.
[^hajos]: Proving that `h <= poly(V)` would imply that NP=coNP, see the discussion [here](https://en.wikipedia.org/wiki/Haj%C3%B3s_construction#The_Haj%C3%B3s_number). Little is know about how hard `h` is to compute, except that (trivially) it's in `NEXP` because of the exponential bounds on its size.
[^hedet]: It was believed that the chromatic number of tensor product was _exatly_ the minimum of the chromatic number of the factors, known as [Hedetniemi's_conjecture](https://en.wikipedia.org/wiki/Hedetniemi%27s_conjecture). It is easy to see that it is at _most_ the minimum of the factors. In 2019 the conjecture was disproved, that the `< Min` case can occur too.
[^joindomination]: The domination number of a graph join is always exactly two (by taking one vertex from each half of the join), _unless_ either factor has a universal vertex (i.e. has a domination number of one), in which case the domination number is one; _unless_ both addends are the empty graph, in which case the domination number is zero.
[^nonstandard_notation]: This is nonstandard notation that I've invented here, because it doesn't seem to have a standard number in the literature (except perhaps a generic _k_).