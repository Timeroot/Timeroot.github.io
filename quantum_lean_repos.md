# Lean Repositories for Quantum Mechanics, Quantum Information, and Quantum Computing

This list is _very loosely_ sorted by some combination of scale, age, ongoign community activity, and specificity to quantum.

1. [Physlib](https://github.com/leanprover-community/physlib) ([Website](https://physlib.io/)). Broad collection of physics. Includes quantum mechanics (Schrödinger equation, Harmonic oscillator) and some quantum field theory. Absorbed the Lean-QuantumInfo repository (and so has quantum entropy, capacity, and so on). Previously known as _Physlean_ and before that _HEPLean_.
4. [OSforGFF](https://github.com/mrdouglasny/OSforGFF). Lean formalization of the Osterwalder-Schrader axioms for Quantum Field Theory, and a particular model (four-dimensional Gaussian Free Field) that satisfies these.
2. [Lean-QuantumInfo](https://github.com/Timeroot/Lean-QuantumInfo). _Archived for the time being._ Focused on finite-dimensional quantum information: channels, entropy, capacities, and a lot of mathematical machinery for more efficiently manipulating Hermitian matrices. Culminated in quantum generalized Stein's Lemma. Now merged into Physlib.
3. [LeanQuantum](https://github.com/inQWIRE/LeanQuantum). Focused on qubits and qubit-gates. From the same group (Xiaodi Wu) as the [SQIR / VOQC](https://github.com/inQWIRE/SQIR) verified quantum compiler in Roqc, although the Lean repo is much smaller.
5. [Lean-QEC](https://github.com/VerifiedQC/Lean-QEC). Companion to [https://arxiv.org/abs/2605.16523](End-to-End Formalization of Quantum Error Correction), also from Xiaodi Wu's group.
6. [Algolean](https://github.com/Shreyas4991/Algolean) ([Website](https://shreyas4991.github.io/Algolean/)). Repository of various algorithms and their complexity; includes some quantum algorithms and circuits. Largely organized by Shreyas Srinivas.
7. [lean-quantum](https://github.com/Hayata-Yamasaki-Group/lean-quantum). Hayata Yamasaki's group work on a (very mathematical) treatment of quantum mechanics, mostly in the context of operator inequalities.
8. [QuantumOptimization](https://github.com/urikol/QuantumOptimization). Dirk Englund's group work on QAOA. Companion repository to [A Machine-Verified Proof of a Quantum-Optimization Conjecture](https://arxiv.org/abs/2606.29687).
9. [Spectra](https://github.com/adambornemann-glitch/Spectra). Highly mathematical treatment of quantum mechanics, including infinite-dimensional systems. By Adam Bornemann.
10. [MerLean: Examples](https://github.com/doxtor6/MerLean-examples) ([Website](https://arthurmerlean.com/)). Companion repository to [MerLean: An Agentic Framework for Autoformalization in Quantum Computation](https://arxiv.org/abs/2602.16554).
11. [QLean](https://github.com/Paul-Lez/QLean/tree/main). More quantum algorithms focused, downstream of CSLib. By Paul Lezau.
12. [lean-qec-sslp](https://github.com/LionSR/lean-qec-sslp). Companion repository to [Co-Designing Quantum Codes with Transversal Diagonal Gates via Multi-Agent Systems](https://arxiv.org/abs/2510.20728).
13. [lean4-quantum](https://github.com/guest2180/lean4-quantum). Port from Lean 3 of no-cloning and the uncertainty principle.
10. [Lean-QuantumAlg](https://github.com/QudeLeap/Lean-QuantumAlg). Quantum algorithms.
11. [QECLean](https://github.com/Stavan-Jain/QECLean). Quantum error correction.

# Relevant Papers in Lean
Chronological order.

1. [Formalization of physics index notation in Lean 4](https://arxiv.org/abs/2411.07667). Joseph Tooby-Smith.
2. [Digitalizing Wick's theorem](https://arxiv.org/abs/2505.07939). Joseph Tooby-Smith.
3. [A Formalization of the Generalized Quantum Stein's Lemma in Lean](https://arxiv.org/abs/2510.08672). Alex Meiburg, Leonardo A. Lessa, Rodolfo R. Soldati.
4. [Co-Designing Quantum Codes with Transversal Diagonal Gates via Multi-Agent Systems](https://arxiv.org/abs/2510.20728). Xi He, Sirui Lu, Bei Zeng.
5. [MerLean: An Agentic Framework for Autoformalization in Quantum Computation](https://arxiv.org/abs/2602.16554). Yuanjie Ren, Jinzheng Li, Yidi Qi.
6. [Formalization of QFT](https://arxiv.org/abs/2603.15770). Michael R. Douglas, Sarah Hoback, Anna Mei, Ron Nissim.
7. [End-to-End Formalization of Quantum Error Correction](https://arxiv.org/abs/2605.16523). Mattias Ehatamm, Yi Lee, Xiaodi Wu, Runzhou Tao.
8. [A Machine-Verified Proof of a Quantum-Optimization Conjecture](https://arxiv.org/abs/2606.29687). Uri Kol, Maor Ben-Shahar, Kfir Sulimany, Dirk Englund.

# Relevant Papers not in Lean (Roqc, Isabelle)
Chronological order.

1. [A Verified Optimizer for Quantum Circuits](https://arxiv.org/abs/1912.02250). Kesha Hietala, Robert Rand, Shih-Han Hung, Xiaodi Wu, Michael Hicks.
2. [Certified Quantum Computation in Isabelle/HOL](https://arxiv.org/abs/2012.13925). Anthony Bordg, Hanna Lachnitt, Yijun He.
3. [A Formally Certified End-to-End Implementation of Shor's Factorization Algorithm](https://arxiv.org/abs/2204.07112). Yuxiang Peng, Kesha Hietala, Runzhou Tao, Liyi Li, Robert Rand, Michael Hicks, Xiaodi Wu.
4. [CoqQ: Foundational Verification of Quantum Programs](https://arxiv.org/abs/2207.11350). Li Zhou, Gilles Barthe, Pierre-Yves Strub, Junyi Liu, Mingsheng Ying.

# AI or Benchmark-related papers related to Lean + Physics
1. [Ax-Prover: A Deep Reasoning Agentic Framework for Theorem Proving in Mathematics and Quantum Physics](https://arxiv.org/abs/2510.12787). Benjamin Breen, Marco Del Tredici, Jacob McCarran, Javier Aspuru Mijares, Weichen Winston Yin, Kfir Sulimany, Jacob M. Taylor, Frank H. L. Koppens, Dirk Englund.
2. [Lean4Physics: Comprehensive Reasoning Framework for College-level Physics in Lean4](https://arxiv.org/abs/2510.26094). Yuxin Li, Minghao Liu, Ruida Wang, Wenzhao Ji, Zhitao He, Rui Pan, Junming Huang, Tong Zhang, Yi R. Fung. _Note:_ this benchmark referred to their library as PhysLib as well; no relationship to the [leanprover-community](https://github.com/leanprover-community/physlib) repo.
3. [PhysProver: Advancing Automatic Theorem Proving for Physics](https://arxiv.org/abs/2601.15737). Hanning Zhang, Ruida Wang, Rui Pan, Wenyuan Wang, Bingxu Meng, Tong Zhang
