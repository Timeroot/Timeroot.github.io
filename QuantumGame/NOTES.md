# Quantum Gate Puzzle Game - Development Notes

## Project Goal

Build an in-browser educational puzzle game about **quantum circuit rewriting**. The core mechanic is manipulating sequences of quantum gates through simple click interactions, teaching players the algebraic rules of quantum gates through play.

## Current Implementation: Pauli Gates on One Wire

### The Three Gates (Colors)
- **X Gate** = Red (`#ff3366`)
- **Y Gate** = Green (`#33ff88`)  
- **Z Gate** = Blue (`#3388ff`)

### Game Mechanics

#### 1. Merge (Click Gap Between Gates)
Click the space between two adjacent gates to combine them:
- **Same color**: Gates annihilate → disappear (X×X = Y×Y = Z×Z = I)
- **Different colors**: Produce the third color
  - X × Y = Z
  - Y × Z = X
  - Z × X = Y
  - (Order doesn't matter for the result, just the phase which we ignore)

#### 2. Split (Click on a Gate)
Click a gate to split it into two other gates:
- **Left-click**: Split one way (e.g., Z → X × Y)
- **Right-click**: Split the other way (e.g., Z → Y × X)

The split rules:
- X → Y × Z (left) or Z × Y (right)
- Y → Z × X (left) or X × Z (right)
- Z → X × Y (left) or Y × X (right)

### Quantum Math Background

The Pauli matrices satisfy:
- σ² = I (each gate squared is identity)
- σᵢσⱼ = iεᵢⱼₖσₖ (different gates multiply to give the third, up to phase)

We ignore global phase in this game, so:
- XX = YY = ZZ = I (identity, gates disappear)
- XY = Z, YZ = X, ZX = Y (and reverse orders too)

### Win Condition
Simplify the wire to **identity** (no gates remaining).

---

## Future Expansion Ideas

### Phase 2: Multi-Wire Circuits
- Add CNOT gates (two-qubit entangling gate)
- Visual representation of control/target wires
- CNOT + Hadamard interactions

### Phase 3: Hadamard Gate
- H gate (maybe purple or white?)
- H×H = I
- HXH = Z, HZH = X, HYH = -Y
- The classic H-CNOT-H pattern mentioned in original spec

### Phase 4: Puzzle Levels
- Pre-defined starting configurations
- Target configurations to reach
- Move counters / par scores
- Progressive difficulty

### Phase 5: Educational Content
- Optional explanations of the quantum mechanics
- Bloch sphere visualization
- Connection to actual quantum computing

---

## Technical Notes

### File Structure
- `index.html` - Single-page game (HTML + CSS + JS all inline)
- `NOTES.md` - This file

### Design Choices
- **Color-first**: Gates identified primarily by color, letter is secondary
- **Glow effects**: Each gate has a matching glow/shadow for visual pop
- **Dark theme**: Space/quantum aesthetic with subtle colored gradients
- **Fonts**: Orbitron (headers) + Rajdhani (body) for techy feel
- **No dependencies**: Pure vanilla HTML/CSS/JS, works offline

### Browser Compatibility
- Uses CSS custom properties (variables)
- Uses modern flexbox
- Right-click handled via `oncontextmenu`
- Should work in all modern browsers

---

## Quick Reference: Pauli Algebra

```
X² = Y² = Z² = I

XY = iZ    YX = -iZ
YZ = iX    ZY = -iX  
ZX = iY    XZ = -iY

(ignoring phase: XY = YX = Z, etc.)
```

The game uses the phase-ignoring version for simplicity.

---

## Current Gate Set (1-Qubit Clifford)

### Full Paulis: X, Y, Z
- Colors: Red, Green, Blue
- X×X = Y×Y = Z×Z = I (self-annihilate)
- Different Paulis multiply to give the third

### Half Gates (S gates): √X, √Y, S (√Z)
- Visually "half-filled" versions of their color
- √X × √X = X, etc.
- Same-axis gates commute: X and √X just swap positions

### Hadamard-type Gates: Hx, Hy, Hz
- Swirling two-color design showing which axes they swap
- Hy swaps X↔Z (traditional Hadamard)
- Hx swaps Y↔Z
- Hz swaps X↔Y
- H×H = I (self-annihilate)
- Commuting through Paulis changes the Pauli's color

---

## Future: Merging Different Hadamards (Hx × Hy)

### Interpretation in Clifford Terminology

In Clifford group terminology, the product of two distinct Hadamard-like gates is a **120° Rotation (C₃)**.

While reflections (like H) have order 2 (applying them twice gives Identity), the product of two non-commuting reflections creates a rotation.

- **Geometric Value**: This is a 120° rotation (or 2π/3 rotation) around the axis defined by the vector (1,1,−1).

- **Group Property**: It is an element of order 3 (meaning if you apply it three times, you get the Identity operation).

- **Function**: It serves as a cyclic permutation of the Pauli axes (mapping X→Y→Z with sign changes).

In terms of the standard Clifford generators (H and S), this specific operator is often equivalent to the sequence:

```
Hx × Hy = H × S†
```

(Assuming standard phase conventions.)

### Possible Visual Representation
- A three-color swirling gate?
- Or decompose into H × S† automatically?
- Could be a "C₃" gate with all three colors cycling

