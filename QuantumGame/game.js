// ============================================
// Quantum Gate Puzzle - Game Logic
// ============================================

// GATE MODEL:
// Single-qubit gates have { type, axis }:
//   type: 'P' (Pauli, 2 quarter-turns), 'S' (sqrt, 1 quarter-turn), 
//         'Sd' (sqrt-dagger, 3 quarter-turns), 'H' (Hadamard)
//   axis: 'X', 'Y', 'Z'
//
// String format in levels.json: 'Px', 'Sy', 'Sdz', 'Hx', etc.
//   - Starts with P, H, Sd, or S
//   - Ends with x, y, or z (case insensitive)
//
// Internal string format: 'P:X', 'S:Z', 'H:Y', etc.
//
// Two-qubit gates:
//   'CG': Controlled-General gate
//   { id: 'CG', qubits: [control, target], gates: [controlGate, targetGate] }
//   controlGate must be a Pauli (type 'P')
//
// Colors: X=Red, Y=Green, Z=Blue

// ============================================
// Gate Type Constants
// ============================================

const GateType = {
    PAULI: 'P',      // Full Pauli, 2 quarter-turns
    SQRT: 'S',       // Square root, 1 quarter-turn
    SQRT_DAG: 'Sd',  // Square root dagger, 3 quarter-turns
    HADAMARD: 'H'    // Hadamard (axis swap)
};

const AXES = ['X', 'Y', 'Z'];

// Quarter-turns for each type
const TYPE_QUARTERS = {
    'P': 2,
    'S': 1,
    'Sd': 3,
    'H': 0  // Hadamards don't use quarter-turn arithmetic
};

// ============================================
// Algebra Rules
// ============================================
// Each rule defines a transformation pattern.
// Patterns use 'a', 'b', 'c' to represent axes where:
//   - 'a' matches any axis
//   - 'b' matches any axis different from 'a'
//   - 'c' is the third axis (different from both 'a' and 'b')
//
// Rule types:
//   - 'merge': Two gates combine into result(s)
//   - 'swap': Two gates can swap positions (commute), possibly transforming
//   - 'split': One gate splits into two

const RULES = {
    // Merge rules (multiplication)
    merge: [
        // Merge two rotations on the same axis
        { name: 'pauli-same-annihilate', left: { type: 'P', axis: 'a' }, right: { type: 'P', axis: 'a' }, result: [], globalPhase: 0 },
        { name: 'sqrt-sqrt-dag-annihilate', left: { type: 'S', axis: 'a' }, right: { type: 'Sd', axis: 'a' }, result: [], globalPhase: 0 },
        { name: 'sqrt-dag-sqrt-annihilate', left: { type: 'Sd', axis: 'a' }, right: { type: 'S', axis: 'a' }, result: [], globalPhase: 0 },
        { name: 'sqrt-same-to-pauli', left: { type: 'S', axis: 'a' }, right: { type: 'S', axis: 'a' }, result: [{ type: 'P', axis: 'a' }], globalPhase: 0 },
        { name: 'sqrt-dag-same-to-pauli', left: { type: 'Sd', axis: 'a' }, right: { type: 'Sd', axis: 'a' }, result: [{ type: 'P', axis: 'a' }], globalPhase: 0 },
        // S + P = Sd (1 + 2 = 3), Sd + P = S (3 + 2 = 5 = 1 mod 4)
        // Needed for CG gate merging (Type 6/7)
        { name: 'sqrt-pauli-to-sqrt-dag', left: { type: 'S', axis: 'a' }, right: { type: 'P', axis: 'a' }, result: [{ type: 'Sd', axis: 'a' }], globalPhase: 0 },
        { name: 'pauli-sqrt-to-sqrt-dag', left: { type: 'P', axis: 'a' }, right: { type: 'S', axis: 'a' }, result: [{ type: 'Sd', axis: 'a' }], globalPhase: 0 },
        { name: 'sqrt-dag-pauli-to-sqrt', left: { type: 'Sd', axis: 'a' }, right: { type: 'P', axis: 'a' }, result: [{ type: 'S', axis: 'a' }], globalPhase: 0 },
        { name: 'pauli-sqrt-dag-to-sqrt', left: { type: 'P', axis: 'a' }, right: { type: 'Sd', axis: 'a' }, result: [{ type: 'S', axis: 'a' }], globalPhase: 0 },
        
        // Merge two different rotations. Will need to introduce a phase depending on the ordering of a->b->c.
        { name: 'pauli-different', left: { type: 'P', axis: 'a' }, right: { type: 'P', axis: 'b' }, result: [{ type: 'P', axis: 'c' }], globalPhase: 0 },

        // Merge two Hadamards on the same axis
        { name: 'hadamard-same-annihilate', left: { type: 'H', axis: 'a' }, right: { type: 'H', axis: 'a' }, result: [], globalPhase: 0 },
    ],
    
    // Swap rules: turn two gates into two gates. Sometimes this is genuinely a commutation, where the two gates swap places and
    // there's no global phase. Others are a "swap", where either the gates change, or there's a global phase term. This can be
    // distinguished based on whether it ends in "-commute" or not.
    swap: [
        // Commuting gates: rotations on the same axis commute.
        // Same-type same-axis gates commute (needed for CG rules even though they would normally merge)
        { name: 'pauli-pauli-same-axis-commute', left: { type: 'P', axis: 'a' }, right: { type: 'P', axis: 'a' }, newLeft: { type: 'P', axis: 'a' }, newRight: { type: 'P', axis: 'a' }, globalPhase: 0 },
        { name: 'sqrt-sqrt-same-axis-commute', left: { type: 'S', axis: 'a' }, right: { type: 'S', axis: 'a' }, newLeft: { type: 'S', axis: 'a' }, newRight: { type: 'S', axis: 'a' }, globalPhase: 0 },
        { name: 'sqrt-dag-sqrt-dag-same-axis-commute', left: { type: 'Sd', axis: 'a' }, right: { type: 'Sd', axis: 'a' }, newLeft: { type: 'Sd', axis: 'a' }, newRight: { type: 'Sd', axis: 'a' }, globalPhase: 0 },
        
        { name: 'sqrt-pauli-same-axis-commute', left: { type: 'S', axis: 'a' }, right: { type: 'P', axis: 'a' }, newLeft: { type: 'P', axis: 'a' }, newRight: { type: 'S', axis: 'a' }, globalPhase: 0 },
        { name: 'pauli-sqrt-same-axis-commute', left: { type: 'P', axis: 'a' }, right: { type: 'S', axis: 'a' }, newLeft: { type: 'S', axis: 'a' }, newRight: { type: 'P', axis: 'a' }, globalPhase: 0 },
        
        { name: 'sqrt-dag-pauli-same-axis-commute', left: { type: 'Sd', axis: 'a' }, right: { type: 'P', axis: 'a' }, newLeft: { type: 'P', axis: 'a' }, newRight: { type: 'Sd', axis: 'a' }, globalPhase: 0 },
        { name: 'pauli-sqrt-dag-same-axis-commute', left: { type: 'P', axis: 'a' }, right: { type: 'Sd', axis: 'a' }, newLeft: { type: 'Sd', axis: 'a' }, newRight: { type: 'P', axis: 'a' }, globalPhase: 0 },
        
        { name: 'sqrt-sqrt-dag-same-axis-commute', left: { type: 'S', axis: 'a' }, right: { type: 'Sd', axis: 'a' }, newLeft: { type: 'Sd', axis: 'a' }, newRight: { type: 'S', axis: 'a' }, globalPhase: 0 },
        { name: 'sqrt-dag-sqrt-same-axis-commute', left: { type: 'Sd', axis: 'a' }, right: { type: 'S', axis: 'a' }, newLeft: { type: 'S', axis: 'a' }, newRight: { type: 'Sd', axis: 'a' }, globalPhase: 0 },
        
        // Different-axis Paulis anti-commute: Px*Py = -Py*Px (swap with phase 2 = -1)
        // Needed for Type 3 CG swaps
        { name: 'pauli-pauli-different-axis-anticommute', left: { type: 'P', axis: 'a' }, right: { type: 'P', axis: 'b' }, newLeft: { type: 'P', axis: 'b' }, newRight: { type: 'P', axis: 'a' }, globalPhase: 2 },
        
        // Swap Hadamard with a rotation on another axis, changing its axis - no phase. Not a commutation, but a swap.
        { name: 'hadamard-pauli-swap-axis', left: { type: 'H', axis: 'a' }, right: { type: 'P', axis: 'b' }, newLeft: { type: 'P', axis: 'c' }, newRight: { type: 'H', axis: 'a' }, globalPhase: 0, condition: 'hadamard-swaps-bc' },
        { name: 'pauli-hadamard-swap-axis', left: { type: 'P', axis: 'b' }, right: { type: 'H', axis: 'a' }, newLeft: { type: 'H', axis: 'a' }, newRight: { type: 'P', axis: 'c' }, globalPhase: 0, condition: 'hadamard-swaps-bc' },
        
        { name: 'hadamard-sqrt-swap-axis', left: { type: 'H', axis: 'a' }, right: { type: 'S', axis: 'b' }, newLeft: { type: 'S', axis: 'c' }, newRight: { type: 'H', axis: 'a' }, globalPhase: 0, condition: 'hadamard-swaps-bc' },
        { name: 'sqrt-hadamard-swap-axis', left: { type: 'S', axis: 'b' }, right: { type: 'H', axis: 'a' }, newLeft: { type: 'H', axis: 'a' }, newRight: { type: 'S', axis: 'c' }, globalPhase: 0, condition: 'hadamard-swaps-bc' },
        
        { name: 'hadamard-sqrt-dag-swap-axis', left: { type: 'H', axis: 'a' }, right: { type: 'Sd', axis: 'b' }, newLeft: { type: 'Sd', axis: 'c' }, newRight: { type: 'H', axis: 'a' }, globalPhase: 0, condition: 'hadamard-swaps-bc' },
        { name: 'sqrt-dag-hadamard-swap-axis', left: { type: 'Sd', axis: 'b' }, right: { type: 'H', axis: 'a' }, newLeft: { type: 'H', axis: 'a' }, newRight: { type: 'Sd', axis: 'c' }, globalPhase: 0, condition: 'hadamard-swaps-bc' },
        
        // Commute Hadamard with Pauli on same axis, adding a -1 global phase. That's 2 quarter-turns, so globalPhase is 2. Not a commutation, because it adds a phase.
        { name: 'hadamard-pauli-same-axis', left: { type: 'H', axis: 'a' }, right: { type: 'P', axis: 'a' }, newLeft: { type: 'P', axis: 'a' }, newRight: { type: 'H', axis: 'a' }, globalPhase: 2 },
        { name: 'pauli-hadamard-same-axis', left: { type: 'P', axis: 'a' }, right: { type: 'H', axis: 'a' }, newLeft: { type: 'H', axis: 'a' }, newRight: { type: 'P', axis: 'a' }, globalPhase: 2 },
        
        // Swap a S or Sd past a Hadamard on the same axis- I'm a bit unsure about this one? Need to check my math for this, what should happen.
        // { name: 'hadamard-sqrt-same-axis', left: { type: 'H', axis: 'a' }, right: { type: 'S', axis: 'a' }, newLeft: { type: 'S', axis: 'a' }, newRight: { type: 'H', axis: 'a' }, globalPhase: 0 },
        // { name: 'sqrt-hadamard-same-axis', left: { type: 'S', axis: 'a' }, right: { type: 'H', axis: 'a' }, newLeft: { type: 'H', axis: 'a' }, newRight: { type: 'S', axis: 'a' }, globalPhase: 0 },
        // { name: 'hadamard-sqrt-dag-same-axis', left: { type: 'H', axis: 'a' }, right: { type: 'Sd', axis: 'a' }, newLeft: { type: 'Sd', axis: 'a' }, newRight: { type: 'H', axis: 'a' }, globalPhase: 0 },
        // { name: 'sqrt-dag-hadamard-same-axis', left: { type: 'Sd', axis: 'a' }, right: { type: 'H', axis: 'a' }, newLeft: { type: 'H', axis: 'a' }, newRight: { type: 'Sd', axis: 'a' }, globalPhase: 0 },
    ],
    
    // Split rules
    split: [
        { name: 'pauli-to-two-paulis', gate: { type: 'P', axis: 'a' }, result: [{ type: 'P', axis: 'b' }, { type: 'P', axis: 'c' }], key: 'default', globalPhase: 0 },
        { name: 'pauli-to-two-paulis-reverse', gate: { type: 'P', axis: 'a' }, result: [{ type: 'P', axis: 'c' }, { type: 'P', axis: 'b' }], key: 'shift', globalPhase: 0 },
        { name: 'pauli-to-two-sqrts', gate: { type: 'P', axis: 'a' }, result: [{ type: 'S', axis: 'a' }, { type: 'S', axis: 'a' }], key: 'ctrl', globalPhase: 0 },
    ]
};

// Helper to get the third axis given two different axes
function getThirdAxis(a, b) {
    return AXES.find(ax => ax !== a && ax !== b);
}

// Check if a Hadamard swaps two specific axes
function hadamardSwaps(hadamardAxis, axis1, axis2) {
    // H:Z swaps X↔Y, H:X swaps Y↔Z, H:Y swaps X↔Z
    const swaps = {
        'Z': ['X', 'Y'],
        'X': ['Y', 'Z'],
        'Y': ['X', 'Z']
    };
    const pair = swaps[hadamardAxis];
    return pair && ((pair[0] === axis1 && pair[1] === axis2) || (pair[0] === axis2 && pair[1] === axis1));
}

// Match a rule pattern against actual gates
// Returns axis bindings { a: 'X', b: 'Y', c: 'Z' } or null if no match
function matchPattern(pattern, gate) {
    const g = parseGate(gate);
    if (!g) return null;
    if (pattern.type !== g.type) return null;
    return { [pattern.axis]: g.axis };
}

// Merge axis bindings, checking for conflicts
function mergeBindings(b1, b2) {
    if (!b1 || !b2) return null;
    const result = { ...b1 };
    for (const [key, val] of Object.entries(b2)) {
        if (result[key] && result[key] !== val) return null; // Conflict
        result[key] = val;
    }
    return result;
}

// Complete bindings by computing 'c' if we have 'a' and 'b'
function completeBindings(bindings) {
    if (!bindings) return null;
    const result = { ...bindings };
    if (result.a && result.b && !result.c) {
        if (result.a !== result.b) {
            result.c = getThirdAxis(result.a, result.b);
        }
    }
    // Also handle case where we need b from a and c
    if (result.a && result.c && !result.b) {
        if (result.a !== result.c) {
            result.b = getThirdAxis(result.a, result.c);
        }
    }
    return result;
}

// Apply bindings to a pattern to get a concrete gate
function applyBindings(pattern, bindings) {
    if (!pattern || !bindings) return null;
    const axis = bindings[pattern.axis];
    if (!axis) return null;
    return { type: pattern.type, axis };
}

// ============================================
// Game State
// ============================================

let circuit = [];
let numQubits = 1;
let levelsData = null;
let currentLevel = null;
let moveCount = 0;
let isSandboxMode = true;
let levelComplete = false;
let levelCompleteMessage = '';
let globalPhase = 0; // Tracked mod 4 (0, 1, 2, 3 represent 1, i, -1, -i)
let isAnimating = false;
const ANIMATION_DURATION = 400; // ms

// ============================================
// Gate Creation and Conversion
// ============================================

// Create a gate object from type and axis
function makeGate(type, axis) {
    return { type, axis };
}

// Convert gate to string format 'P:X', 'S:Z', 'H:Y', etc. (internal format)
function gateToString(gate) {
    if (typeof gate === 'string') return gate; // Already a string
    return `${gate.type}:${gate.axis}`;
}

// Parse string format to gate object
// Accepts:
//   - Internal format: 'P:X', 'S:Z', 'H:Y', etc.
//   - Level format: 'Px', 'Sy', 'Sdz', 'Hx', etc.
function parseGate(str) {
    if (typeof str === 'object' && str.type && str.axis) return str; // Already parsed
    if (!str || typeof str !== 'string') return null;
    
    // Internal format: 'P:X', 'S:Z', etc.
    if (str.includes(':')) {
        const [type, axis] = str.split(':');
        return { type, axis };
    }
    
    // Level format: Px, Sy, Sdz, Hx, etc.
    // Check prefixes in order: Sd first (longest), then P, H, S
    let type, axisChar;
    
    if (str.startsWith('Sd') && str.length === 3) {
        type = 'Sd';
        axisChar = str[2];
    } else if (str.startsWith('P') && str.length === 2) {
        type = 'P';
        axisChar = str[1];
    } else if (str.startsWith('H') && str.length === 2) {
        type = 'H';
        axisChar = str[1];
    } else if (str.startsWith('S') && str.length === 2) {
        type = 'S';
        axisChar = str[1];
    } else {
        return null;
    }
    
    const axis = axisChar.toUpperCase();
    if (!AXES.includes(axis)) return null;
    
    return { type, axis };
}

// Convert gate to display string format for CSS classes (Px, Sy, Sdz, Hx)
function gateToDisplayString(gate) {
    const g = parseGate(gate);
    if (!g) return null;
    return g.type + g.axis.toLowerCase();
}

// Get CSS class key for a gate
function getGateCSSKey(gate) {
    const g = parseGate(gate);
    if (!g) return null;
    // CSS classes use: x, y, z for Pauli; sx, sy, sz for S; sxd, syd, szd for Sd; hx, hy, hz for H
    const axisLower = g.axis.toLowerCase();
    if (g.type === 'P') return axisLower;
    if (g.type === 'S') return 's' + axisLower;
    if (g.type === 'Sd') return 's' + axisLower + 'd';
    if (g.type === 'H') return 'h' + axisLower;
    return null;
}

// ============================================
// Gate Display
// ============================================

const GATE_CLASSES = {
    'x': 'gate-x', 'y': 'gate-y', 'z': 'gate-z',
    'sx': 'gate-sx', 'sy': 'gate-sy', 'sz': 'gate-sz',
    'sxd': 'gate-sxd', 'syd': 'gate-syd', 'szd': 'gate-szd',
    'hx': 'gate-h gate-hx', 'hy': 'gate-h gate-hy', 'hz': 'gate-h gate-hz'
};

const GATE_LABELS = {
    'x': 'X', 'y': 'Y', 'z': 'Z',
    'sx': '√X', 'sy': '√Y', 'sz': 'S',
    'sxd': '√X†', 'syd': '√Y†', 'szd': 'S†',
    'hx': 'Hx', 'hy': 'Hy', 'hz': 'Hz'
};

function getGateClass(gate) {
    const key = getGateCSSKey(gate);
    return GATE_CLASSES[key] || '';
}

function getGateLabel(gate) {
    const key = getGateCSSKey(gate);
    return GATE_LABELS[key] || gateToString(gate);
}

function getGateColor(gate) {
    const g = parseGate(gate);
    if (!g) return 'var(--text-dim)';
    
    if (g.axis === 'X') return 'var(--glow-x)';
    if (g.axis === 'Y') return 'var(--glow-y)';
    if (g.axis === 'Z') return 'var(--glow-z)';
    return 'var(--text-dim)';
}

// ============================================
// Gate Algebra - Core Functions
// ============================================

// Get quarter-turns for a gate (0 for Hadamard)
function getQuarterTurns(gate) {
    const g = parseGate(gate);
    if (!g) return 0;
    return TYPE_QUARTERS[g.type] || 0;
}

// Get the axis of a gate
function getAxis(gate) {
    const g = parseGate(gate);
    return g ? g.axis : null;
}

// Get the type of a gate
function getType(gate) {
    const g = parseGate(gate);
    return g ? g.type : null;
}

// Is this a Pauli-axis gate (P, S, or Sd - not H)?
function isPauliType(gate) {
    const type = getType(gate);
    return type === 'P' || type === 'S' || type === 'Sd';
}

// Is this a Hadamard?
function isHadamard(gate) {
    return getType(gate) === 'H';
}

// Is this a full Pauli (type P)?
function isFullPauli(gate) {
    return getType(gate) === 'P';
}

// Build a gate from type and axis
function gateFromTypeAxis(type, axis) {
    if (!type || !axis) return null;
    return { type, axis };
}

// Build a Pauli-type gate from axis and quarter-turns (mod 4)
function gateFromQuarterTurns(axis, quarters) {
    const q = ((quarters % 4) + 4) % 4;
    if (q === 0) return null; // Identity
    if (q === 1) return { type: 'S', axis };
    if (q === 2) return { type: 'P', axis };
    if (q === 3) return { type: 'Sd', axis };
    return null;
}

// Get which two axes a Hadamard swaps
// H:Z swaps X↔Y, H:X swaps Y↔Z, H:Y swaps X↔Z
function getHadamardSwap(gate) {
    const g = parseGate(gate);
    if (!g || g.type !== 'H') return null;
    
    if (g.axis === 'Z') return ['X', 'Y'];
    if (g.axis === 'X') return ['Y', 'Z'];
    if (g.axis === 'Y') return ['X', 'Z'];
    return null;
}

// Apply Hadamard conjugation: H * P * H = P' (swap the axis if it's one of the two)
function conjugateByHadamard(hadamard, gate) {
    const swap = getHadamardSwap(hadamard);
    if (!swap) return gate;
    
    const g = parseGate(gate);
    if (!g || !isPauliType(g)) return gate;
    
    if (g.axis === swap[0]) {
        return { type: g.type, axis: swap[1] };
    } else if (g.axis === swap[1]) {
        return { type: g.type, axis: swap[0] };
    }
    return gate; // Axis not involved in swap
}

// ============================================
// Gate Comparison
// ============================================

// Check if two gates are equal
function gatesEqual(a, b) {
    const ga = parseGate(a);
    const gb = parseGate(b);
    if (!ga || !gb) return false;
    return ga.type === gb.type && ga.axis === gb.axis;
}

// Check if two gates have the same axis
function sameAxis(a, b) {
    return getAxis(a) === getAxis(b);
}

// ============================================
// Single-Qubit Gate Operations (Rule-Based)
// ============================================

// Try to match a swap rule against two gates
function trySwapRule(rule, leftGate, rightGate) {
    const left = parseGate(leftGate);
    const right = parseGate(rightGate);
    if (!left || !right) return null;
    
    // Match left pattern
    const leftBindings = matchPattern(rule.left, left);
    if (!leftBindings) return null;
    
    // Match right pattern
    const rightBindings = matchPattern(rule.right, right);
    if (!rightBindings) return null;
    
    // Merge bindings
    let bindings = mergeBindings(leftBindings, rightBindings);
    if (!bindings) return null;
    
    // Complete bindings (compute 'c' if needed)
    bindings = completeBindings(bindings);
    if (!bindings) return null;
    
    // Check condition if present
    if (rule.condition === 'hadamard-swaps-bc') {
        // The Hadamard (axis 'a') must swap axes 'b' and 'c'
        if (!bindings.a || !bindings.b || !bindings.c) return null;
        if (!hadamardSwaps(bindings.a, bindings.b, bindings.c)) return null;
    }
    
    // Apply bindings to get result gates
    const newLeft = applyBindings(rule.newLeft, bindings);
    const newRight = applyBindings(rule.newRight, bindings);
    if (!newLeft || !newRight) return null;
    
    return { newLeft, newRight, ruleName: rule.name, globalPhase: rule.globalPhase };
}

// Try to match a merge rule against two gates
function tryMergeRule(rule, leftGate, rightGate) {
    const left = parseGate(leftGate);
    const right = parseGate(rightGate);
    if (!left || !right) return null;
    
    // Match left pattern
    const leftBindings = matchPattern(rule.left, left);
    if (!leftBindings) return null;
    
    // Match right pattern
    const rightBindings = matchPattern(rule.right, right);
    if (!rightBindings) return null;
    
    // Merge bindings
    let bindings = mergeBindings(leftBindings, rightBindings);
    if (!bindings) return null;
    
    // Complete bindings (compute 'c' if needed)
    bindings = completeBindings(bindings);
    
    // Apply bindings to get result gates
    const result = rule.result.map(pattern => applyBindings(pattern, bindings)).filter(g => g !== null);
    
    // Check that we got the expected number of results
    if (result.length !== rule.result.length) return null;
    
    // Calculate global phase, handling special cases
    let phase = rule.globalPhase || 0;
    
    // For pauli-different rule, phase depends on cyclic order
    // X*Y = iZ, Y*X = -iZ, etc. Cyclic (X->Y->Z->X) gives +i (phase 1), anti-cyclic gives -i (phase 3)
    if (rule.name === 'pauli-different') {
        const cyclic = isCyclicOrder(left.axis, right.axis);
        phase = cyclic ? 1 : 3; // +i or -i
    }
    
    return { result, ruleName: rule.name, globalPhase: phase };
}

// Check if two axes are in cyclic order (X->Y->Z->X)
function isCyclicOrder(axis1, axis2) {
    const order = { 'X': 0, 'Y': 1, 'Z': 2 };
    const diff = (order[axis2] - order[axis1] + 3) % 3;
    return diff === 1; // Y follows X, Z follows Y, X follows Z
}

// Try to match a split rule against a gate
function trySplitRule(rule, gate, key) {
    const g = parseGate(gate);
    if (!g) return null;
    
    // Check key matches
    if (rule.key !== key) return null;
    
    // Match gate pattern
    const bindings = matchPattern(rule.gate, g);
    if (!bindings) return null;
    
    // Complete bindings - for split, we need to determine b and c from a
    // b and c are the two axes that aren't a
    const completedBindings = { ...bindings };
    if (completedBindings.a) {
        const others = AXES.filter(ax => ax !== completedBindings.a);
        completedBindings.b = others[0];
        completedBindings.c = others[1];
    }
    
    // Apply bindings to get result gates
    const result = rule.result.map(pattern => applyBindings(pattern, completedBindings)).filter(g => g !== null);
    
    if (result.length !== rule.result.length) return null;
    
    // Calculate global phase for split
    // Splitting is the reverse of merging, so we need the opposite phase
    let phase = rule.globalPhase || 0;
    
    // For pauli-to-two-paulis, phase depends on which way we split
    // If we split Z into X*Y, that's the reverse of X*Y->Z, so we need -i (phase 3)
    // If we split Z into Y*X, that's the reverse of Y*X->Z, so we need +i (phase 1)
    if (rule.name === 'pauli-to-two-paulis' && result.length === 2) {
        const cyclic = isCyclicOrder(result[0].axis, result[1].axis);
        phase = cyclic ? 3 : 1; // Opposite of merge
    } else if (rule.name === 'pauli-to-two-paulis-reverse' && result.length === 2) {
        const cyclic = isCyclicOrder(result[0].axis, result[1].axis);
        phase = cyclic ? 3 : 1;
    }
    
    return { result, ruleName: rule.name, globalPhase: phase };
}

// Check if two single-qubit gates can swap (commute)
// Returns { gates: [newLeft, newRight], globalPhase, ruleName } or null
function canSwapSingleQubit(a, b) {
    for (const rule of RULES.swap) {
        const result = trySwapRule(rule, a, b);
        if (result) {
            return { gates: [result.newLeft, result.newRight], globalPhase: result.globalPhase || 0, ruleName: result.ruleName };
        }
    }
    return null;
}

// Check if two single-qubit gates truly commute (no phase, no gate change)
// "True commute" means rule name ends in "-commute"
function canTrulyCommuteSingleQubit(a, b) {
    const result = canSwapSingleQubit(a, b);
    if (!result) return false;
    if (!result.ruleName.endsWith('-commute')) return false;
    // Double-check no phase and gates unchanged
    const ga = parseGate(a);
    const gb = parseGate(b);
    if (result.globalPhase !== 0) return false;
    if (!gatesEqual(ga, result.gates[1])) return false; // a should end up on right, unchanged
    if (!gatesEqual(gb, result.gates[0])) return false; // b should end up on left, unchanged
    return true;
}

// Check if two single-qubit gates can swap with only a phase change (no gate change)
// Returns { phase } or null
function canSwapWithPhaseOnly(a, b) {
    const result = canSwapSingleQubit(a, b);
    if (!result) return null;
    // Check gates are unchanged
    const ga = parseGate(a);
    const gb = parseGate(b);
    if (!gatesEqual(ga, result.gates[1])) return null; // a should end up on right, unchanged
    if (!gatesEqual(gb, result.gates[0])) return null; // b should end up on left, unchanged
    return { phase: result.globalPhase };
}

// Create a phase gate based on a Pauli axis and a phase value
// phase 0 = identity (null), phase 1 = S, phase 2 = P (full Pauli), phase 3 = Sd
function createPhaseGate(axis, phase, qubit) {
    const normalizedPhase = ((phase % 4) + 4) % 4;
    if (normalizedPhase === 0) return null;
    
    let type;
    if (normalizedPhase === 1) type = 'S';
    else if (normalizedPhase === 2) type = 'P';
    else if (normalizedPhase === 3) type = 'Sd';
    
    return {
        id: gateToString({ type, axis }),
        qubits: [qubit]
    };
}

// Multiply two single-qubit gates
// Returns { gates: [...], globalPhase, ruleName } or null
function multiplySingleQubitGates(a, b) {
    for (const rule of RULES.merge) {
        const result = tryMergeRule(rule, a, b);
        if (result) {
            return { gates: result.result, globalPhase: result.globalPhase || 0, ruleName: result.ruleName };
        }
    }
    return null;
}

// Split a single-qubit gate
function splitSingleQubitGate(gate, shiftKey, ctrlKey) {
    // Determine which key was used
    let key = 'default';
    if (ctrlKey) key = 'ctrl';
    else if (shiftKey) key = 'shift';
    
    for (const rule of RULES.split) {
        const result = trySplitRule(rule, gate, key);
        if (result) {
            return { gates: result.result, globalPhase: result.globalPhase };
        }
    }
    return null;
}

// ============================================
// Circuit Gate Helpers
// ============================================

// A circuit gate is { id: string, qubits: number[], gates?: [...] }
// For single-qubit: id is the gate string, qubits is [qubit]
// For CG: id is 'CG', qubits is [control, target], gates is [controlGate, targetGate]

function isSingleQubitCircuitGate(circuitGate) {
    return circuitGate.id !== 'CG';
}

function getCircuitGateQubits(circuitGate) {
    return circuitGate.qubits || [];
}

function sharesQubit(gateA, gateB) {
    const qA = getCircuitGateQubits(gateA);
    const qB = getCircuitGateQubits(gateB);
    return qA.some(q => qB.includes(q));
}

// Get the single-qubit gate object from a circuit gate
function getSingleQubitGate(circuitGate) {
    if (circuitGate.id === 'CG') return null;
    return parseGate(circuitGate.id);
}

// Create a single-qubit circuit gate
function makeSingleQubitCircuitGate(gate, qubit) {
    const g = parseGate(gate);
    return { id: gateToString(g), qubits: [qubit] };
}

// ============================================
// Multi-Qubit Gate Operations
// ============================================

// Check if two circuit gates can swap
function canSwapCircuitGates(leftGate, rightGate) {
    const leftIsSingle = isSingleQubitCircuitGate(leftGate);
    const rightIsSingle = isSingleQubitCircuitGate(rightGate);
    
    // Both single-qubit on same qubit
    if (leftIsSingle && rightIsSingle) {
        const result = canSwapSingleQubit(leftGate.id, rightGate.id);
        if (result) {
            return {
                canSwap: true,
                newLeft: { id: gateToString(result.gates[0]), qubits: [...leftGate.qubits] },
                newRight: { id: gateToString(result.gates[1]), qubits: [...rightGate.qubits] },
                globalPhase: result.globalPhase
            };
        }
        return null;
    }
    
    // Single with CG
    if (leftIsSingle && rightGate.id === 'CG') {
        return canSwapSingleWithCG(leftGate, rightGate, 'left');
    }
    if (leftGate.id === 'CG' && rightIsSingle) {
        return canSwapSingleWithCG(rightGate, leftGate, 'right');
    }
    
    // Two CG gates
    if (leftGate.id === 'CG' && rightGate.id === 'CG') {
        // First try Types 4, 5 (different/one shared qubit)
        const swapResult = canSwapTwoCGs(leftGate, rightGate);
        if (swapResult) return swapResult;
        
        // Then try Type 8 (same qubits, swap inner gates)
        const swapSameResult = canSwapTwoCGsSameQubits(leftGate, rightGate);
        if (swapSameResult) return swapSameResult;
    }
    
    return null;
}

// Check if a single-qubit gate can swap with a CG gate
// ============================================
// CG Gate Rules (Types 1-8)
// See CG_INFO.md for detailed documentation
// ============================================

// Check if single-qubit gate can swap with CG gate
// Returns { canSwap, newLeft, newRight, extraGates?, globalPhase, cgType } or null
function canSwapSingleWithCG(singleGate, cgGate, position) {
    const single = parseGate(singleGate.id);
    const singleQubit = singleGate.qubits[0];
    const [cgQ1, cgQ2] = cgGate.qubits;
    const [cgGate1Str, cgGate2Str] = cgGate.gates;
    
    const cgGate1 = parseGate(cgGate1Str);
    const cgGate2 = parseGate(cgGate2Str);
    
    const touchesQ1 = singleQubit === cgQ1;
    const touchesQ2 = singleQubit === cgQ2;
    
    // TYPE 1: Single qubit is in span but doesn't touch either CG qubit
    // Free commutation
    if (!touchesQ1 && !touchesQ2) {
        const minQ = Math.min(cgQ1, cgQ2);
        const maxQ = Math.max(cgQ1, cgQ2);
        if (singleQubit > minQ && singleQubit < maxQ) {
            // In span - Type 1
            if (position === 'left') {
                return { canSwap: true, newLeft: { ...cgGate }, newRight: { ...singleGate }, globalPhase: 0, cgType: 1 };
            } else {
                return { canSwap: true, newLeft: { ...singleGate }, newRight: { ...cgGate }, globalPhase: 0, cgType: 1 };
            }
        }
        // Not in span - shouldn't happen if called correctly, but handle it
        return null;
    }
    
    // Single touches one of the CG qubits
    // Determine which CG gate the single interacts with
    const touchedQubit = touchesQ1 ? cgQ1 : cgQ2;
    const otherQubit = touchesQ1 ? cgQ2 : cgQ1;
    const touchedGateStr = touchesQ1 ? cgGate1Str : cgGate2Str;
    const otherGateStr = touchesQ1 ? cgGate2Str : cgGate1Str;
    const touchedGate = touchesQ1 ? cgGate1 : cgGate2;
    const otherGate = touchesQ1 ? cgGate2 : cgGate1;
    
    // TYPE 2: True commutation (no phase, no gate change)
    if (canTrulyCommuteSingleQubit(singleGate.id, touchedGateStr)) {
        if (position === 'left') {
            return { canSwap: true, newLeft: { ...cgGate }, newRight: { ...singleGate }, globalPhase: 0, cgType: 2 };
        } else {
            return { canSwap: true, newLeft: { ...singleGate }, newRight: { ...cgGate }, globalPhase: 0, cgType: 2 };
        }
    }
    
    // TYPE 3: Swap with phase, other gate is Pauli
    // Check if single can swap past touchedGate with only a phase (no gate change)
    const phaseResult = canSwapWithPhaseOnly(singleGate.id, touchedGateStr);
    if (phaseResult && isPauliType(otherGate)) {
        const phase = phaseResult.phase;
        // Create extra gate based on phase and otherGate's axis
        const extraGate = createPhaseGate(otherGate.axis, phase, otherQubit);
        
        if (position === 'left') {
            // Single was on left, moves to right of CG
            // Extra gate goes after the single (between CG and the moved single conceptually, 
            // but since single moves to right, extra goes right after CG, before single)
            return { 
                canSwap: true, 
                newLeft: { ...cgGate }, 
                newRight: { ...singleGate }, 
                extraGates: extraGate ? [extraGate] : [],
                extraGatesPosition: 'afterLeft', // extra gates go after newLeft (the CG)
                globalPhase: 0, // phase is absorbed into extra gate
                cgType: 3 
            };
        } else {
            // Single was on right, moves to left of CG
            return { 
                canSwap: true, 
                newLeft: { ...singleGate }, 
                newRight: { ...cgGate },
                extraGates: extraGate ? [extraGate] : [],
                extraGatesPosition: 'afterLeft', // extra gates go after newLeft (the single)
                globalPhase: 0,
                cgType: 3 
            };
        }
    }
    
    // No rule applies
    return null;
}

// Check if two CG gates can swap (Types 4, 5)
// Returns { canSwap, newLeft, newRight, globalPhase, cgType } or null
function canSwapTwoCGs(leftCG, rightCG) {
    const [leftQ1, leftQ2] = leftCG.qubits;
    const [rightQ1, rightQ2] = rightCG.qubits;
    const [leftGate1Str, leftGate2Str] = leftCG.gates;
    const [rightGate1Str, rightGate2Str] = rightCG.gates;
    
    // Find shared qubits
    const leftQubits = new Set([leftQ1, leftQ2]);
    const rightQubits = new Set([rightQ1, rightQ2]);
    const sharedQubits = [...leftQubits].filter(q => rightQubits.has(q));
    
    // TYPE 4: No shared qubits, but spans might overlap
    // Free commutation
    if (sharedQubits.length === 0) {
        return { canSwap: true, newLeft: { ...rightCG }, newRight: { ...leftCG }, globalPhase: 0, cgType: 4 };
    }
    
    // TYPE 5: One shared qubit
    // CGs can commute if gates on shared qubit truly commute
    if (sharedQubits.length === 1) {
        const sharedQ = sharedQubits[0];
        
        // Get the gates on the shared qubit from each CG
        const leftGateOnShared = (sharedQ === leftQ1) ? leftGate1Str : leftGate2Str;
        const rightGateOnShared = (sharedQ === rightQ1) ? rightGate1Str : rightGate2Str;
        
        // Check if they truly commute (no phase, no change)
        if (canTrulyCommuteSingleQubit(leftGateOnShared, rightGateOnShared)) {
            return { canSwap: true, newLeft: { ...rightCG }, newRight: { ...leftCG }, globalPhase: 0, cgType: 5 };
        }
        
        // No rule if they don't truly commute
        return null;
    }
    
    // Two shared qubits - handled by separate functions (merge/swap same qubits)
    return null;
}

// Check if two circuit gates can merge
function canMergeCircuitGates(leftGate, rightGate, qubit) {
    const leftIsSingle = isSingleQubitCircuitGate(leftGate);
    const rightIsSingle = isSingleQubitCircuitGate(rightGate);
    
    // Both single-qubit
    if (leftIsSingle && rightIsSingle) {
        const result = multiplySingleQubitGates(leftGate.id, rightGate.id);
        if (result !== null) {
            return {
                canMerge: true,
                result: result.gates.map(g => ({ id: gateToString(g), qubits: [qubit] })),
                globalPhase: result.globalPhase
            };
        }
        return null;
    }
    
    // Two CG gates
    if (leftGate.id === 'CG' && rightGate.id === 'CG') {
        return canMergeTwoCGs(leftGate, rightGate);
    }
    
    return null;
}

// Check if two CG gates can merge (Types 6, 7)
// Returns { canMerge, result, extraGates?, globalPhase, cgType } or null
function canMergeTwoCGs(leftCG, rightCG) {
    const [leftQ1, leftQ2] = leftCG.qubits;
    const [rightQ1, rightQ2] = rightCG.qubits;
    const [leftGate1Str, leftGate2Str] = leftCG.gates;
    const [rightGate1Str, rightGate2Str] = rightCG.gates;
    
    // Must share both qubits (in either arrangement)
    const sameArrangement = (leftQ1 === rightQ1 && leftQ2 === rightQ2);
    const swappedArrangement = (leftQ1 === rightQ2 && leftQ2 === rightQ1);
    
    if (!sameArrangement && !swappedArrangement) return null;
    
    // Get gates aligned by qubit (not by position)
    // leftGateOnQ1/Q2 = gate from leftCG on qubit leftQ1/leftQ2
    // rightGateOnQ1/Q2 = gate from rightCG on qubit leftQ1/leftQ2
    const leftGateOnQ1 = leftGate1Str;
    const leftGateOnQ2 = leftGate2Str;
    let rightGateOnQ1, rightGateOnQ2;
    
    if (sameArrangement) {
        rightGateOnQ1 = rightGate1Str;
        rightGateOnQ2 = rightGate2Str;
    } else {
        // Right CG has qubits swapped: rightQ1=leftQ2, rightQ2=leftQ1
        rightGateOnQ1 = rightGate2Str; // right's gate2 is on leftQ1
        rightGateOnQ2 = rightGate1Str; // right's gate1 is on leftQ2
    }
    
    // Try both possible pairings: merge on Q1 or merge on Q2
    // Pairing 1: shared Pauli on Q1, merge on Q2
    const result1 = tryMergeCGsWithSharedQubit(leftQ1, leftQ2, leftGateOnQ1, leftGateOnQ2, rightGateOnQ1, rightGateOnQ2);
    if (result1) return result1;
    
    // Pairing 2: shared Pauli on Q2, merge on Q1
    const result2 = tryMergeCGsWithSharedQubit(leftQ2, leftQ1, leftGateOnQ2, leftGateOnQ1, rightGateOnQ2, rightGateOnQ1);
    if (result2) return result2;
    
    return null;
}

// Helper for canMergeTwoCGs: try merging with sharedQ having matching Paulis and mergeQ having mergeable gates
function tryMergeCGsWithSharedQubit(sharedQ, mergeQ, leftGateOnShared, leftGateOnMerge, rightGateOnShared, rightGateOnMerge) {
    const leftShared = parseGate(leftGateOnShared);
    const rightShared = parseGate(rightGateOnShared);
    
    // Gates on shared qubit must be identical Paulis
    if (!isPauliType(leftShared)) return null;
    if (!gatesEqual(leftGateOnShared, rightGateOnShared)) return null;
    
    // Try to merge gates on merge qubit
    const mergeResult = multiplySingleQubitGates(leftGateOnMerge, rightGateOnMerge);
    if (mergeResult === null) return null;
    
    const mergePhase = mergeResult.globalPhase || 0;
    
    // Create extra gate for phase (if any) on the shared qubit
    const extraGate = createPhaseGate(leftShared.axis, mergePhase, sharedQ);
    
    // TYPE 6: No phase
    // TYPE 7: Has phase (creates extra gate)
    const cgType = (mergePhase === 0) ? 6 : 7;
    
    if (mergeResult.gates.length === 0) {
        // Gates on merge qubit annihilate - CG becomes identity, but may have phase gate
        return { 
            canMerge: true, 
            result: extraGate ? [extraGate] : [], 
            globalPhase: 0,
            cgType 
        };
    }
    
    if (mergeResult.gates.length === 1) {
        const resultGates = [{
            id: 'CG',
            qubits: [sharedQ, mergeQ],
            gates: [leftGateOnShared, gateToString(mergeResult.gates[0])]
        }];
        
        // If there's a phase gate, insert it before the CG
        if (extraGate) {
            resultGates.unshift(extraGate);
        }
        
        return {
            canMerge: true,
            result: resultGates,
            globalPhase: 0,
            cgType
        };
    }
    
    return null;
}

// Check if two CG gates sharing both qubits can swap their inner gates (Type 8)
// Returns { canSwap, newLeft, newRight, extraGates?, globalPhase, cgType } or null
function canSwapTwoCGsSameQubits(leftCG, rightCG) {
    const [leftQ1, leftQ2] = leftCG.qubits;
    const [rightQ1, rightQ2] = rightCG.qubits;
    const [leftGate1Str, leftGate2Str] = leftCG.gates;
    const [rightGate1Str, rightGate2Str] = rightCG.gates;
    
    // Must share both qubits (in either arrangement)
    const sameArrangement = (leftQ1 === rightQ1 && leftQ2 === rightQ2);
    const swappedArrangement = (leftQ1 === rightQ2 && leftQ2 === rightQ1);
    
    if (!sameArrangement && !swappedArrangement) return null;
    
    // Get gates aligned by qubit
    const leftGateOnQ1 = leftGate1Str;
    const leftGateOnQ2 = leftGate2Str;
    let rightGateOnQ1, rightGateOnQ2;
    
    if (sameArrangement) {
        rightGateOnQ1 = rightGate1Str;
        rightGateOnQ2 = rightGate2Str;
    } else {
        rightGateOnQ1 = rightGate2Str;
        rightGateOnQ2 = rightGate1Str;
    }
    
    // Try both possible pairings: shared Pauli on Q1 or Q2
    const result1 = trySwapCGsWithSharedQubit(leftQ1, leftQ2, leftGateOnQ1, leftGateOnQ2, rightGateOnQ1, rightGateOnQ2);
    if (result1) return result1;
    
    const result2 = trySwapCGsWithSharedQubit(leftQ2, leftQ1, leftGateOnQ2, leftGateOnQ1, rightGateOnQ2, rightGateOnQ1);
    if (result2) return result2;
    
    return null;
}

// Helper for canSwapTwoCGsSameQubits: try swapping with sharedQ having matching Paulis
function trySwapCGsWithSharedQubit(sharedQ, swapQ, leftGateOnShared, leftGateOnSwap, rightGateOnShared, rightGateOnSwap) {
    const leftShared = parseGate(leftGateOnShared);
    
    // Gates on shared qubit must be identical Paulis
    if (!isPauliType(leftShared)) return null;
    if (!gatesEqual(leftGateOnShared, rightGateOnShared)) return null;
    
    // Try to swap gates on swap qubit
    const swapResult = canSwapSingleQubit(leftGateOnSwap, rightGateOnSwap);
    if (swapResult === null) return null;
    
    const swapPhase = swapResult.globalPhase || 0;
    
    // Create extra gate for phase (if any) on the shared qubit
    const extraGate = createPhaseGate(leftShared.axis, swapPhase, sharedQ);
    
    // TYPE 8: Swap inner gates
    const newLeftCG = {
        id: 'CG',
        qubits: [sharedQ, swapQ],
        gates: [leftGateOnShared, gateToString(swapResult.gates[0])]
    };
    
    const newRightCG = {
        id: 'CG',
        qubits: [sharedQ, swapQ],
        gates: [leftGateOnShared, gateToString(swapResult.gates[1])]
    };
    
    return {
        canSwap: true,
        newLeft: newLeftCG,
        newRight: newRightCG,
        extraGates: extraGate ? [extraGate] : [],
        extraGatesPosition: 'between',
        globalPhase: 0,
        cgType: 8
    };
}

// Split a CG gate
function splitCGGate(cgGate, shiftKey, ctrlKey) {
    const [ctrlQubit, tgtQubit] = cgGate.qubits;
    const [ctrlGate, tgtGate] = cgGate.gates || ['P:Z', 'P:X'];
    
    const targetSplit = splitSingleQubitGate(tgtGate, shiftKey, ctrlKey);
    if (!targetSplit) return null;
    
    return targetSplit.map(newTgt => ({
        id: 'CG',
        qubits: [ctrlQubit, tgtQubit],
        gates: [ctrlGate, gateToString(newTgt)]
    }));
}

// Validate a CG gate
function validateCGGate(gate) {
    if (gate.id !== 'CG') return true;
    const [ctrl, tgt] = gate.gates || ['P:Z', 'P:X'];
    if (!isFullPauli(ctrl)) {
        console.error(`CG validation failed: control must be full Pauli, got ${ctrl}`);
        return false;
    }
    return true;
}

// ============================================
// Depth Calculation
// ============================================

function calculateDepths() {
    const qubitDepth = new Array(numQubits).fill(0);
    const depths = [];
    
    for (const gate of circuit) {
        const qubits = gate.qubits;
        let gateDepth;
        
        if (qubits.length === 1) {
            gateDepth = qubitDepth[qubits[0]];
            qubitDepth[qubits[0]] = gateDepth + 1;
        } else {
            const minQ = Math.min(...qubits);
            const maxQ = Math.max(...qubits);
            gateDepth = 0;
            for (let q = minQ; q <= maxQ; q++) {
                gateDepth = Math.max(gateDepth, qubitDepth[q]);
            }
            for (let q = minQ; q <= maxQ; q++) {
                qubitDepth[q] = gateDepth + 1;
            }
        }
        
        depths.push({ gate, depth: gateDepth });
    }
    
    return depths;
}

function getMaxDepth() {
    const depths = calculateDepths();
    if (depths.length === 0) return 0;
    return Math.max(...depths.map(d => d.depth)) + 1;
}

// ============================================
// Rendering
// ============================================

function render() {
    const container = document.getElementById('wires-container');
    container.innerHTML = '';
    
    const depths = calculateDepths();
    const maxDepth = getMaxDepth();
    const numGateCols = Math.max(maxDepth, 1);
    
    // Create wire elements
    for (let q = 0; q < numQubits; q++) {
        const wireEl = document.createElement('div');
        wireEl.className = 'wire-container';
        wireEl.dataset.qubit = q;
        
        const wireLine = document.createElement('div');
        wireLine.className = 'wire-line';
        wireEl.appendChild(wireLine);
        
        container.appendChild(wireEl);
    }
    
    // Create grid
    const colTemplate = [];
    for (let i = 0; i < numGateCols; i++) {
        colTemplate.push('60px');
        if (i < numGateCols - 1) colTemplate.push('20px');
    }
    
    const gridEl = document.createElement('div');
    gridEl.className = 'circuit-grid';
    gridEl.style.gridTemplateColumns = colTemplate.join(' ');
    gridEl.style.gridTemplateRows = `repeat(${numQubits}, 80px)`;
    gridEl.style.width = 'fit-content';
    container.appendChild(gridEl);
    
    if (circuit.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'empty-state';
        emptyEl.textContent = 'Identity ✓';
        gridEl.appendChild(emptyEl);
        setStatus('');
        return;
    }
    
    // Place gates
    depths.forEach(({ gate, depth }, circuitIndex) => {
        const gridCol = depth * 2 + 1;
        
        if (isSingleQubitCircuitGate(gate)) {
            const q = gate.qubits[0];
            const gateEl = document.createElement('div');
            gateEl.className = `gate ${getGateClass(gate.id)}`;
            gateEl.style.gridColumn = gridCol;
            gateEl.style.gridRow = q + 1;
            
            const canSplit = isActionAllowed('split', gate.id, null) && isFullPauli(gate.id);
            if (!canSplit && !isSandboxMode && currentLevel) {
                gateEl.classList.add('no-split');
            }
            
            gateEl.innerHTML = `<span class="gate-label">${getGateLabel(gate.id)}</span>`;
            gateEl.dataset.circuitIndex = circuitIndex;
            gateEl.onclick = (e) => {
                e.preventDefault();
                splitAtIndex(circuitIndex, e.shiftKey, e.ctrlKey);
            };
            gateEl.oncontextmenu = (e) => {
                e.preventDefault();
                splitAtIndex(circuitIndex, true, e.ctrlKey);
            };
            gateEl.title = canSplit ? 'Click to split' : '';
            gridEl.appendChild(gateEl);
            
        } else if (gate.id === 'CG') {
            const [ctrlQubit, tgtQubit] = gate.qubits;
            const [ctrlGate, tgtGate] = gate.gates || ['P:Z', 'P:X'];
            const minQ = Math.min(ctrlQubit, tgtQubit);
            const maxQ = Math.max(ctrlQubit, tgtQubit);
            
            const canSplit = isActionAllowed('split', 'CG', null) && isFullPauli(tgtGate);
            
            // Control block
            const ctrlEl = document.createElement('div');
            ctrlEl.className = `gate ${getGateClass(ctrlGate)} gate-cg-part`;
            ctrlEl.style.gridColumn = gridCol;
            ctrlEl.style.gridRow = ctrlQubit + 1;
            ctrlEl.innerHTML = `<span class="gate-label">${getGateLabel(ctrlGate)}</span>`;
            ctrlEl.dataset.circuitIndex = circuitIndex;
            if (canSplit) {
                ctrlEl.onclick = (e) => { e.preventDefault(); splitAtIndex(circuitIndex, e.shiftKey, e.ctrlKey); };
                ctrlEl.oncontextmenu = (e) => { e.preventDefault(); splitAtIndex(circuitIndex, true, e.ctrlKey); };
                ctrlEl.style.cursor = 'pointer';
            }
            gridEl.appendChild(ctrlEl);
            
            // Target block
            const tgtEl = document.createElement('div');
            tgtEl.className = `gate ${getGateClass(tgtGate)} gate-cg-part`;
            tgtEl.style.gridColumn = gridCol;
            tgtEl.style.gridRow = tgtQubit + 1;
            tgtEl.innerHTML = `<span class="gate-label">${getGateLabel(tgtGate)}</span>`;
            tgtEl.dataset.circuitIndex = circuitIndex;
            if (canSplit) {
                tgtEl.onclick = (e) => { e.preventDefault(); splitAtIndex(circuitIndex, e.shiftKey, e.ctrlKey); };
                tgtEl.oncontextmenu = (e) => { e.preventDefault(); splitAtIndex(circuitIndex, true, e.ctrlKey); };
                tgtEl.style.cursor = 'pointer';
            }
            gridEl.appendChild(tgtEl);
            
            // Connecting line
            const numRows = maxQ - minQ + 1;
            const lineHeight = (numRows - 1) * 80;
            const ctrlColor = getGateColor(ctrlGate);
            const tgtColor = getGateColor(tgtGate);
            const topColor = ctrlQubit < tgtQubit ? ctrlColor : tgtColor;
            const bottomColor = ctrlQubit < tgtQubit ? tgtColor : ctrlColor;
            
            const lineEl = document.createElement('div');
            lineEl.className = 'cg-line';
            lineEl.style.gridColumn = gridCol;
            lineEl.style.gridRowStart = minQ + 1;
            lineEl.style.gridRowEnd = maxQ + 2;
            lineEl.style.height = `${lineHeight}px`;
            lineEl.style.background = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;
            lineEl.dataset.circuitIndex = circuitIndex;
            lineEl.dataset.minQubit = minQ;
            lineEl.dataset.maxQubit = maxQ;
            gridEl.appendChild(lineEl);
        }
    });
    
    renderInteractionZones(depths, maxDepth, gridEl);
    setStatus('');
}

// Check if two circuit gates are identical (same id, qubits, and gates for CG)
function gatesIdentical(a, b) {
    if (a.id !== b.id) return false;
    if (a.qubits.length !== b.qubits.length) return false;
    for (let i = 0; i < a.qubits.length; i++) {
        if (a.qubits[i] !== b.qubits[i]) return false;
    }
    if (a.id === 'CG') {
        if (!a.gates || !b.gates) return false;
        if (a.gates[0] !== b.gates[0] || a.gates[1] !== b.gates[1]) return false;
    }
    return true;
}

// ============================================
// Animation System
// ============================================

// Animate gates from old positions to new positions
async function animateTransition(oldCircuit, newCircuit, locationMapping) {
    if (!oldCircuit.length && !newCircuit.length) return;
    
    isAnimating = true;
    
    const container = document.getElementById('wires-container');
    const gridEl = container.querySelector('.circuit-grid');
    if (!gridEl) {
        isAnimating = false;
        return;
    }
    
    // Calculate old and new depths
    const oldDepths = calculateDepthsForCircuit(oldCircuit);
    const newDepths = calculateDepthsForCircuit(newCircuit);
    
    // Calculate old and new max depths for container sizing
    const oldMaxDepth = oldDepths.length > 0 ? Math.max(...oldDepths.map(d => d.depth)) + 1 : 1;
    const newMaxDepth = newDepths.length > 0 ? Math.max(...newDepths.map(d => d.depth)) + 1 : 1;
    
    // Calculate new grid width: 60px per gate column, 20px per gap, plus 40px padding
    const newGridWidth = newMaxDepth * 60 + Math.max(0, newMaxDepth - 1) * 20 + 40;
    
    // Animate the grid width (container will follow)
    const currentGridRect = gridEl.getBoundingClientRect();
    gridEl.style.width = `${currentGridRect.width}px`;
    gridEl.style.transition = 'none';
    void gridEl.offsetHeight; // Force reflow
    gridEl.style.transition = `width ${ANIMATION_DURATION}ms ease-out`;
    
    // Update the grid template columns
    const numGateCols = Math.max(newMaxDepth, 1);
    const colTemplate = [];
    for (let i = 0; i < numGateCols; i++) {
        colTemplate.push('60px');
        if (i < numGateCols - 1) colTemplate.push('20px');
    }
    gridEl.style.gridTemplateColumns = colTemplate.join(' ');
    
    // Set the new width to trigger the animation
    void gridEl.offsetHeight; // Force reflow
    gridEl.style.width = `${newGridWidth}px`;
    
    // Find all gate elements currently rendered
    const gateElements = gridEl.querySelectorAll('.gate');
    
    // Store initial positions for gate elements
    const initialPositions = [];
    gateElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const gridRect = gridEl.getBoundingClientRect();
        // Determine which qubit this element is on from its grid row
        const gridRow = parseInt(el.style.gridRow) || 1;
        const elementQubit = gridRow - 1;
        
        initialPositions.push({
            el,
            x: rect.left - gridRect.left,
            y: rect.top - gridRect.top,
            circuitIndex: parseInt(el.dataset.circuitIndex),
            elementQubit: elementQubit
        });
    });
    
    // Find all CG line elements
    const lineElements = gridEl.querySelectorAll('.cg-line');
    const linePositions = [];
    lineElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const gridRect = gridEl.getBoundingClientRect();
        linePositions.push({
            el,
            x: rect.left - gridRect.left,
            y: rect.top - gridRect.top,
            circuitIndex: parseInt(el.dataset.circuitIndex),
            minQubit: parseInt(el.dataset.minQubit),
            maxQubit: parseInt(el.dataset.maxQubit)
        });
    });
    
    // Calculate target positions based on location mapping
    const animations = [];
    
    for (const pos of initialPositions) {
        const oldIdx = pos.circuitIndex;
        const newIdx = locationMapping[oldIdx];
        
        if (newIdx < 0) {
            // The newIdx is -1 or -2 depending on if it should move slightly to the left or right.
            // We add a manual shift of +1 if the final circuit is length 0, since it actually renders as length 1.
            const manualShift = newCircuit.length === 0 ? 1 : 0;
            const targetDepth = oldDepths[oldIdx].depth + (newIdx - 1 + manualShift)/ 2;
            const targetX = targetDepth * 80 + 40;

            // Gate was annihilated - fade out
            animations.push({
                el: pos.el,
                type: 'fadeOut',
                startX: pos.x,
                startY: pos.y,
                endX: targetX,
                doScale: true
            });
        } else {
            // Gate moved - calculate new position
            const newDepthInfo = newDepths[newIdx];
            if (newDepthInfo) {
                const newGate = newCircuit[newIdx];
                const targetX = newDepthInfo.depth * 80 + 20;
                
                // For CG gates, determine target Y based on which qubit this element represents
                let targetQubit;
                if (newGate.id === 'CG') {
                    // This element could be the control or target block
                    // Match by looking at which qubit this element was on in the old circuit
                    const oldGate = oldCircuit[oldIdx];
                    if (oldGate.id === 'CG') {
                        // Find which qubit in the old CG this element was on
                        const [oldCtrl, oldTgt] = oldGate.qubits;
                        if (pos.elementQubit === oldCtrl) {
                            targetQubit = newGate.qubits[0]; // Control qubit
                        } else {
                            targetQubit = newGate.qubits[1]; // Target qubit
                        }
                    } else {
                        // Single qubit gate becoming part of a CG (shouldn't happen normally)
                        targetQubit = newGate.qubits[0];
                    }
                } else {
                    // Single qubit gate
                    targetQubit = newGate.qubits[0];
                }
                
                const targetY = targetQubit * 80 + 10;
                
                if (Math.abs(targetX - pos.x) > 1 || Math.abs(targetY - pos.y) > 1) {
                    animations.push({
                        el: pos.el,
                        type: 'move',
                        startX: pos.x,
                        startY: pos.y,
                        endX: targetX,
                        endY: targetY
                    });
                }
            }
        }
    }
    
    // Animate CG lines
    for (const pos of linePositions) {
        const oldIdx = pos.circuitIndex;
        const newIdx = locationMapping[oldIdx];
        
        if (newIdx < 0) {
            // The newIdx is -1 or -2 depending on if it should move slightly to the left or right.
            const targetDepth = oldDepths[oldIdx].depth + (newIdx - 1) / 2;
            const targetX = targetDepth * 80 + 70;

            // Line was annihilated - fade out
            animations.push({
                el: pos.el,
                type: 'fadeOut',
                startX: pos.x,
                startY: pos.y,
                endX: targetX,
                doScale: false
            });
        } else {
            const newDepthInfo = newDepths[newIdx];
            const newGate = newCircuit[newIdx];
            if (newDepthInfo && newGate.id === 'CG') {
                const [newCtrl, newTgt] = newGate.qubits;
                const newMinQ = Math.min(newCtrl, newTgt);
                const targetX = newDepthInfo.depth * 80 + 48;
                const targetY = newMinQ * 80 + 40; // Center of top row
                
                if (Math.abs(targetX - pos.x) > 1 || Math.abs(targetY - pos.y) > 1) {
                    animations.push({
                        el: pos.el,
                        type: 'move',
                        startX: pos.x,
                        startY: pos.y,
                        endX: targetX,
                        endY: targetY
                    });
                }
            }
        }
    }
    
    // Perform animations
    if (animations.length > 0) {
        await performAnimations(animations);
    }
    
    // Wait for container resize animation even if no gate animations
    if (oldMaxDepth !== newMaxDepth && animations.length === 0) {
        await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
    }
    
    // Reset grid to auto width after animation (render() will rebuild it anyway)
    if (gridEl) {
        gridEl.style.width = '';
        gridEl.style.transition = '';
    }
    
    isAnimating = false;
}

// Helper to calculate depths for a given circuit (not using global state)
function calculateDepthsForCircuit(circuitToCalc) {
    const qubitDepth = new Array(numQubits).fill(0);
    const depths = [];
    
    for (const gate of circuitToCalc) {
        const qubits = gate.qubits;
        let gateDepth;
        
        if (qubits.length === 1) {
            gateDepth = qubitDepth[qubits[0]];
            qubitDepth[qubits[0]] = gateDepth + 1;
        } else {
            const minQ = Math.min(...qubits);
            const maxQ = Math.max(...qubits);
            gateDepth = 0;
            for (let q = minQ; q <= maxQ; q++) {
                gateDepth = Math.max(gateDepth, qubitDepth[q]);
            }
            for (let q = minQ; q <= maxQ; q++) {
                qubitDepth[q] = gateDepth + 1;
            }
        }
        
        depths.push({ gate, depth: gateDepth });
    }
    
    return depths;
}

async function performAnimations(animations) {
    return new Promise(resolve => {
        // Set up initial positions (absolute positioning)
        animations.forEach(anim => {
            anim.el.style.position = 'absolute';
            anim.el.style.transition = 'none';
            anim.el.style.left = `${anim.startX}px`;
            anim.el.style.top = `${anim.startY}px`;
            anim.el.style.gridColumn = 'auto';
            anim.el.style.gridRow = 'auto';
            // For cg-line elements that use gridRowStart/End
            anim.el.style.gridRowStart = 'auto';
            anim.el.style.gridRowEnd = 'auto';
        });
        
        // Force reflow
        void animations[0]?.el?.offsetHeight;
        
        // Start transitions
        animations.forEach(anim => {
            anim.el.style.transition = `all ${ANIMATION_DURATION}ms ease-out`;
            
            if (anim.type === 'fadeOut') {
                anim.el.style.opacity = '0';
                if (anim.doScale) {
                    anim.el.style.transform = 'scale(0.5)';
                }
                anim.el.style.left = `${anim.endX}px`;
            } else if (anim.type === 'move') {
                anim.el.style.left = `${anim.endX}px`;
                anim.el.style.top = `${anim.endY}px`;
            }
        });
        
        setTimeout(resolve, ANIMATION_DURATION);
    });
}

function renderInteractionZones(depths, maxDepth, gridEl) {
    const zoneKeys = new Set();
    const depthsWithIndex = depths.map((d, idx) => ({ ...d, circuitIndex: idx }));
    
    // Build a map of gates by qubit and depth for quick lookup
    // For each qubit, find visually adjacent gate pairs (consecutive depths on that qubit)
    for (let q = 0; q < numQubits; q++) {
        // Get gates that touch this qubit, sorted by depth
        const gatesOnQubit = depthsWithIndex
            .filter(d => gateTouchesQubit(d.gate, q))
            .sort((a, b) => a.depth - b.depth);
        
        for (let i = 0; i < gatesOnQubit.length - 1; i++) {
            const left = gatesOnQubit[i];
            const right = gatesOnQubit[i + 1];
            
            // These are visually adjacent on this qubit - create interaction zone
            const zoneKey = `${left.depth}-${q}`;
            if (zoneKeys.has(zoneKey)) continue;
            zoneKeys.add(zoneKey);
            
            // Check if they can actually interact (must be circuit-adjacent or commutable)
            const canInteract = areCircuitAdjacent(left.circuitIndex, right.circuitIndex, depthsWithIndex, q);
            if (!canInteract) {
                // They're visually adjacent but not circuit-adjacent
                // This shouldn't normally happen if depth calculation is correct
                continue;
            }
            
            const swapResult = canSwapCircuitGates(left.gate, right.gate);
            const mergeResult = canMergeCircuitGates(left.gate, right.gate, q);
            
            const swapAllowed = isActionAllowed('swap', left.gate.id, right.gate.id) && 
                               (!swapResult?.cgType || isCGTypeAllowed(swapResult.cgType));
            const mergeAllowed = isActionAllowed('merge', left.gate.id, right.gate.id) &&
                                (!mergeResult?.cgType || isCGTypeAllowed(mergeResult.cgType));
            
            const gap = document.createElement('div');
            gap.className = 'gap-overlay';
            gap.style.gridColumn = left.depth * 2 + 2;
            gap.style.gridRow = q + 1;
            
            if (mergeResult?.canMerge && mergeAllowed) {
                gap.className += ' mergeable';
                gap.onclick = () => mergeAtIndices(left.circuitIndex, right.circuitIndex, mergeResult);
                gap.title = 'Merge';
            } else if (swapResult?.canSwap && swapAllowed) {
                gap.className += ' swappable';
                gap.onclick = () => swapAtIndices(left.circuitIndex, right.circuitIndex, swapResult);
                gap.title = 'Swap';
            } else {
                gap.className += ' disabled';
            }
            
            gridEl.appendChild(gap);
        }
    }
    
    // Pass 2: Single-qubit gates in the span of a CG they don't touch
    // These can commute through the CG
    for (const entry of depthsWithIndex) {
        if (entry.gate.id !== 'CG') continue;
        
        const cgGate = entry.gate;
        const cgDepth = entry.depth;
        const cgIdx = entry.circuitIndex;
        const [q1, q2] = cgGate.qubits;
        const minQ = Math.min(q1, q2);
        const maxQ = Math.max(q1, q2);
        
        // Look for single-qubit gates in the span (strictly between minQ and maxQ)
        for (let q = minQ + 1; q < maxQ; q++) {
            // Find gates on this qubit that are visually adjacent to the CG
            const gatesOnSpanQubit = depthsWithIndex
                .filter(d => isSingleQubitCircuitGate(d.gate) && d.gate.qubits[0] === q)
                .sort((a, b) => a.depth - b.depth);
            
            for (const singleEntry of gatesOnSpanQubit) {
                // Check if this single-qubit gate is visually adjacent to the CG
                // Single can be at cgDepth-1 (before), cgDepth (same), or cgDepth (after, since CG advances span qubits)
                const depthDiff = Math.abs(singleEntry.depth - cgDepth);
                if (depthDiff > 1) continue;
                
                const singleIdx = singleEntry.circuitIndex;
                
                // Check if they can interact - no blocking gates in between on this span qubit
                if (!areCircuitAdjacent(singleIdx, cgIdx, depthsWithIndex, q)) continue;
                
                // Determine the actual order for the swap
                const leftIdx = Math.min(singleIdx, cgIdx);
                const rightIdx = Math.max(singleIdx, cgIdx);
                const leftGate = circuit[leftIdx];
                const rightGate = circuit[rightIdx];
                
                const swapResult = canSwapCircuitGates(leftGate, rightGate);
                if (!swapResult?.canSwap) continue;
                
                // Check CG type is allowed
                if (swapResult.cgType && !isCGTypeAllowed(swapResult.cgType)) continue;
                
                const zoneKey = `cg-span-${cgIdx}-${singleIdx}`;
                if (zoneKeys.has(zoneKey)) continue;
                zoneKeys.add(zoneKey);
                
                const gap = document.createElement('div');
                gap.className = 'gap-overlay swappable';
                gap.style.gridColumn = Math.min(singleEntry.depth, cgDepth) * 2 + 2;
                gap.style.gridRow = q + 1;
                gap.onclick = () => swapAtIndices(Math.min(singleIdx, cgIdx), Math.max(singleIdx, cgIdx), swapResult);
                gap.title = 'Swap (commute through)';
                gridEl.appendChild(gap);
            }
        }
    }
}

// Check if a gate touches a specific qubit (including CG span)
function gateTouchesQubit(gate, qubit) {
    if (gate.id === 'CG') {
        const [q1, q2] = gate.qubits;
        const minQ = Math.min(q1, q2);
        const maxQ = Math.max(q1, q2);
        return qubit >= minQ && qubit <= maxQ;
    }
    return gate.qubits.includes(qubit);
}

// Check if two gates are "circuit-adjacent" for interaction purposes
// They must be adjacent in circuit order, OR all gates between them are on different qubits
function areCircuitAdjacent(leftIdx, rightIdx, depthsWithIndex, qubit) {
    if (Math.abs(leftIdx - rightIdx) === 1) return true;
    
    // Check if all gates between them don't touch this qubit
    const minIdx = Math.min(leftIdx, rightIdx);
    const maxIdx = Math.max(leftIdx, rightIdx);
    
    for (let i = minIdx + 1; i < maxIdx; i++) {
        const gate = depthsWithIndex[i].gate;
        if (gateTouchesQubit(gate, qubit)) {
            return false; // There's a gate in between that touches this qubit
        }
    }
    return true;
}

// Check if a qubit is in the span of a CG gate (between min and max qubits, exclusive)
function isQubitInCGSpan(qubit, cgGate) {
    if (cgGate.id !== 'CG') return false;
    const [q1, q2] = cgGate.qubits;
    const minQ = Math.min(q1, q2);
    const maxQ = Math.max(q1, q2);
    return qubit > minQ && qubit < maxQ;
}

// ============================================
// Game Actions
// ============================================

function getGateDisplayName(circuitGate) {
    if (circuitGate.id === 'CG') {
        const [ctrl, tgt] = circuitGate.gates || ['P:Z', 'P:X'];
        return `CG[${getGateLabel(ctrl)},${getGateLabel(tgt)}]`;
    }
    return getGateLabel(circuitGate.id);
}

async function mergeAtIndices(leftIdx, rightIdx, mergeResult) {
    if (isAnimating) return;
    
    const leftGate = circuit[leftIdx];
    const rightGate = circuit[rightIdx];
    if (!leftGate || !rightGate) return;
    
    if (!isActionAllowed('merge', leftGate.id, rightGate.id)) {
        setStatus('Merge not allowed');
        return;
    }
    
    if (!mergeResult?.canMerge) {
        setStatus(`Cannot merge`);
        return;
    }
    
    // Check CG type is allowed
    if (mergeResult.cgType && !isCGTypeAllowed(mergeResult.cgType)) {
        setStatus(`CG rule type ${mergeResult.cgType} not allowed`);
        return;
    }
    
    // Store old circuit for animation
    const oldCircuit = circuit.map(g => ({ ...g, qubits: [...g.qubits], gates: g.gates ? [...g.gates] : undefined }));
    
    const [first, second] = leftIdx < rightIdx ? [leftIdx, rightIdx] : [rightIdx, leftIdx];
    circuit.splice(second, 1);
    circuit.splice(first, 1);
    
    // Result already contains any extra gates (from Types 6, 7) in the proper order
    for (let i = mergeResult.result.length - 1; i >= 0; i--) {
        circuit.splice(first, 0, mergeResult.result[i]);
    }
    
    // Create location mapping
    const mapping = createMergeMapping(oldCircuit, first, second, mergeResult.result.length);
    
    // Apply global phase from the merge
    if (mergeResult.globalPhase) {
        addGlobalPhase(mergeResult.globalPhase);
    }
    
    incrementMoves();
    
    const leftName = getGateDisplayName(leftGate);
    const rightName = getGateDisplayName(rightGate);
    if (mergeResult.result.length === 0) {
        setStatus(`${leftName} × ${rightName} = I`);
    } else {
        const resultStr = mergeResult.result.map(g => getGateDisplayName(g)).join(' × ');
        setStatus(`${leftName} × ${rightName} = ${resultStr}`);
    }
    
    // Animate and render
    await animateTransition(oldCircuit, circuit, mapping);
    render();
    checkWinCondition();
}

// Create a location mapping for merge operations
function createMergeMapping(oldCircuit, firstIdx, secondIdx, resultCount) {
    const mapping = [];
    let newIdx = 0;
    
    for (let oldIdx = 0; oldIdx < oldCircuit.length; oldIdx++) {
        if (oldIdx === firstIdx || oldIdx === secondIdx) {
            if (resultCount == 0) {
                // Annihilated gates (they become the result)
                // We use negative numbers to indicate annihilation, so that the animation can be distinguished from a merge.
                // -1 means the gate is annihilated and should move to the right.
                // -2 means the gate is annihilated and should move to the left.
                if (oldIdx === firstIdx) {
                    mapping.push(-1);
                } else {
                    mapping.push(-2);
                }
            } else {
                // Merged gates - both become the first gate in the result
                mapping.push(firstIdx);
            }
        } else {
            // Shift index based on position relative to merge
            let shift = 0;
            if (oldIdx > firstIdx) {
                shift -= 1;
                shift += resultCount;
            }
            if (oldIdx > secondIdx) shift -= 1;
            mapping.push(oldIdx + shift);
        }
    }
    console.log("mapping", mapping);
    
    return mapping;
}

async function swapAtIndices(leftIdx, rightIdx, swapResult) {
    if (isAnimating) return;
    
    const leftGate = circuit[leftIdx];
    const rightGate = circuit[rightIdx];
    if (!leftGate || !rightGate) return;
    
    if (!isActionAllowed('swap', leftGate.id, rightGate.id)) {
        setStatus('Swap not allowed');
        return;
    }
    
    if (!swapResult?.canSwap) {
        setStatus('Cannot swap');
        return;
    }
    
    // Check CG type is allowed
    if (swapResult.cgType && !isCGTypeAllowed(swapResult.cgType)) {
        setStatus(`CG rule type ${swapResult.cgType} not allowed`);
        return;
    }
    
    // Store old circuit for animation
    const oldCircuit = circuit.map(g => ({ ...g, qubits: [...g.qubits], gates: g.gates ? [...g.gates] : undefined }));
    
    const leftIsSingle = isSingleQubitCircuitGate(leftGate);
    const rightIsSingle = isSingleQubitCircuitGate(rightGate);
    const leftIsCG = leftGate.id === 'CG';
    const rightIsCG = rightGate.id === 'CG';
    
    // For single-qubit + CG swaps, move the single-qubit gate around the CG
    // The CG stays in place to avoid accidental commutations with other gates
    if (leftIsSingle && rightIsCG) {
        // Single is on left, CG on right - move single to after CG
        const transformedSingle = swapResult.newRight;
        circuit.splice(leftIdx, 1); // Remove single from its position
        // After removal, rightIdx shifted down by 1, so CG is now at rightIdx-1
        // Insert after CG
        let insertIdx = rightIdx;
        circuit.splice(insertIdx, 0, transformedSingle);
        
        // Insert extra gates if any (Type 3)
        if (swapResult.extraGates?.length > 0) {
            for (const extraGate of swapResult.extraGates) {
                // Extra gates go after CG, before the moved single
                circuit.splice(insertIdx, 0, extraGate);
                insertIdx++;
            }
        }
    } else if (leftIsCG && rightIsSingle) {
        // CG is on left, single on right - move single to before CG
        const transformedSingle = swapResult.newLeft;
        circuit.splice(rightIdx, 1); // Remove single from its position
        // CG is still at leftIdx, insert before it
        circuit.splice(leftIdx, 0, transformedSingle);
        
        // Insert extra gates if any (Type 3)
        if (swapResult.extraGates?.length > 0) {
            for (let i = 0; i < swapResult.extraGates.length; i++) {
                // Extra gates go after the moved single
                circuit.splice(leftIdx + 1 + i, 0, swapResult.extraGates[i]);
            }
        }
    } else {
        // Both single-qubit or both CG - just swap in place
        circuit[leftIdx] = swapResult.newLeft;
        circuit[rightIdx] = swapResult.newRight;
        
        // Insert extra gates if any (Type 8 - between the two)
        if (swapResult.extraGates?.length > 0 && swapResult.extraGatesPosition === 'between') {
            for (let i = 0; i < swapResult.extraGates.length; i++) {
                circuit.splice(leftIdx + 1 + i, 0, swapResult.extraGates[i]);
            }
        }
    }
    
    // Create swap mapping (simplified - doesn't track extra gates perfectly but animation will be rebuilt)
    const mapping = createSwapMapping(oldCircuit, leftIdx, rightIdx, leftIsSingle, rightIsSingle, leftIsCG, rightIsCG);
    
    // Apply global phase from the swap
    if (swapResult.globalPhase) {
        addGlobalPhase(swapResult.globalPhase);
    }
    
    incrementMoves();
    
    const oldLeft = getGateDisplayName(leftGate);
    const oldRight = getGateDisplayName(rightGate);
    setStatus(`${oldLeft} ↔ ${oldRight}`);
    
    // Animate and render
    await animateTransition(oldCircuit, circuit, mapping);
    render();
    checkWinCondition();
}

// Create a location mapping for swap operations
function createSwapMapping(oldCircuit, leftIdx, rightIdx, leftIsSingle, rightIsSingle, leftIsCG, rightIsCG) {
    const mapping = [];
    
    for (let oldIdx = 0; oldIdx < oldCircuit.length; oldIdx++) {
        if (leftIsSingle && rightIsCG) {
            // Single moved from leftIdx to after CG (which is now at rightIdx-1)
            if (oldIdx === leftIdx) {
                mapping.push(rightIdx); // Single is now at rightIdx (after CG)
            } else if (oldIdx > leftIdx && oldIdx < rightIdx) {
                mapping.push(oldIdx - 1); // Gates between shifted left
            } else if (oldIdx === rightIdx) {
                mapping.push(rightIdx - 1); // CG stays in same effective position
            } else {
                mapping.push(oldIdx);
            }
        } else if (leftIsCG && rightIsSingle) {
            // Single moved from rightIdx to before CG (which is at leftIdx)
            if (oldIdx === rightIdx) {
                mapping.push(leftIdx); // Single is now at leftIdx
            } else if (oldIdx >= leftIdx && oldIdx < rightIdx) {
                mapping.push(oldIdx + 1); // Gates shifted right
            } else {
                mapping.push(oldIdx);
            }
        } else {
            // Simple swap in place
            if (oldIdx === leftIdx) {
                mapping.push(rightIdx); // Left gate went to right position
            } else if (oldIdx === rightIdx) {
                mapping.push(leftIdx); // Right gate went to left position
            } else {
                mapping.push(oldIdx);
            }
        }
    }
    
    return mapping;
}

async function splitAtIndex(circuitIndex, shiftKey, ctrlKey) {
    if (isAnimating) return;
    
    const gate = circuit[circuitIndex];
    if (!gate) return;
    
    if (!isActionAllowed('split', gate.id, null)) {
        setStatus('Split not allowed');
        return;
    }
    
    let resultGates;
    let splitPhase = 0;
    if (gate.id === 'CG') {
        resultGates = splitCGGate(gate, shiftKey, ctrlKey);
    } else {
        const result = splitSingleQubitGate(gate.id, shiftKey, ctrlKey);
        if (result) {
            resultGates = result.gates.map(g => ({ id: gateToString(g), qubits: [...gate.qubits] }));
            splitPhase = result.globalPhase || 0;
        }
    }
    
    if (!resultGates) {
        setStatus(`Cannot split ${getGateDisplayName(gate)}`);
        return;
    }
    
    // Store old circuit for animation
    const oldCircuit = circuit.map(g => ({ ...g, qubits: [...g.qubits], gates: g.gates ? [...g.gates] : undefined }));
    
    circuit.splice(circuitIndex, 1);
    for (let i = resultGates.length - 1; i >= 0; i--) {
        circuit.splice(circuitIndex, 0, resultGates[i]);
    }
    
    // Create split mapping
    const mapping = createSplitMapping(oldCircuit, circuitIndex, resultGates.length);
    
    // Apply global phase from the split
    if (splitPhase) {
        addGlobalPhase(splitPhase);
    }
    
    incrementMoves();
    setStatus(`${getGateDisplayName(gate)} → ${resultGates.map(g => getGateDisplayName(g)).join(' × ')}`);
    
    // Animate and render
    await animateTransition(oldCircuit, circuit, mapping);
    render();
    checkWinCondition();
}

// Create a location mapping for split operations
function createSplitMapping(oldCircuit, splitIdx, resultCount) {
    const mapping = [];
    
    for (let oldIdx = 0; oldIdx < oldCircuit.length; oldIdx++) {
        if (oldIdx === splitIdx) {
            // The split gate becomes the first result gate
            mapping.push(splitIdx);
        } else if (oldIdx > splitIdx) {
            // Gates after the split are shifted by (resultCount - 1)
            mapping.push(oldIdx + resultCount - 1);
        } else {
            mapping.push(oldIdx);
        }
    }
    
    return mapping;
}

function setStatus(msg) {
    if (levelComplete && levelCompleteMessage && msg !== levelCompleteMessage) {
        document.getElementById('status').textContent = levelCompleteMessage;
    } else {
        document.getElementById('status').textContent = msg;
    }
}

// ============================================
// Game Controls
// ============================================

function resetGame() {
    if (currentLevel) {
        loadLevel(currentLevel.id);
    } else {
        numQubits = 1;
        circuit = [
            { id: 'H:Y', qubits: [0] },
            { id: 'P:Z', qubits: [0] },
            { id: 'H:Y', qubits: [0] }
        ];
        moveCount = 0;
        render();
        setStatus('Reset!');
    }
}

function getRandomGate() {
    const roll = Math.random();
    const axis = AXES[Math.floor(Math.random() * 3)];
    
    if (roll < 0.5) {
        return { type: 'P', axis };
    } else if (roll < 0.75) {
        return { type: 'H', axis };
    } else {
        const type = Math.random() < 0.5 ? 'S' : 'Sd';
        return { type, axis };
    }
}

function randomize() {
    isSandboxMode = true;
    currentLevel = null;
    moveCount = 0;
    levelComplete = false;
    levelCompleteMessage = '';
    globalPhase = 0;
    numQubits = 1;
    
    const count = Math.floor(Math.random() * 3) + 5;
    circuit = Array.from({ length: count }, () => ({
        id: gateToString(getRandomGate()),
        qubits: [0]
    }));
    
    render();
    updateLevelDisplay();
    setStatus('Sandbox mode');
}

function randomizeMulti() {
    isSandboxMode = true;
    currentLevel = null;
    moveCount = 0;
    levelComplete = false;
    levelCompleteMessage = '';
    globalPhase = 0;
    
    numQubits = Math.floor(Math.random() * 3) + 2;
    const count = Math.floor(Math.random() * 7) + 8;
    circuit = [];
    
    for (let i = 0; i < count; i++) {
        if (Math.random() < 0.3 && numQubits > 1) {
            // CG gate
            const ctrl = Math.floor(Math.random() * numQubits);
            let tgt = Math.floor(Math.random() * numQubits);
            while (tgt === ctrl) tgt = Math.floor(Math.random() * numQubits);
            
            const ctrlGate = { type: 'P', axis: AXES[Math.floor(Math.random() * 3)] };
            const tgtGate = getRandomGate();
            
            circuit.push({
                id: 'CG',
                qubits: [ctrl, tgt],
                gates: [gateToString(ctrlGate), gateToString(tgtGate)]
            });
        } else {
            const qubit = Math.floor(Math.random() * numQubits);
            circuit.push({ id: gateToString(getRandomGate()), qubits: [qubit] });
        }
    }
    
    render();
    updateLevelDisplay();
    setStatus('Multi-qubit sandbox');
}

// ============================================
// Level System
// ============================================

async function loadLevels() {
    try {
        const response = await fetch('levels.json');
        levelsData = await response.json();
        return levelsData;
    } catch (e) {
        console.error('Failed to load levels:', e);
        return null;
    }
}

// Convert a gate ID from level format to new format
function convertLevelGate(gateId) {
    if (gateId.includes(':')) return gateId; // Already new format
    const g = parseGate(gateId);
    return g ? gateToString(g) : gateId;
}

function loadLevel(levelId) {
    if (!levelsData) return;
    
    const level = levelsData.levels.find(l => l.id === levelId);
    if (!level) return;
    
    currentLevel = level;
    isSandboxMode = false;
    moveCount = 0;
    levelComplete = false;
    levelCompleteMessage = '';
    globalPhase = 0;
    
    numQubits = level.qubits || level.wires || 1;
    
    if (level.circuit) {
        circuit = level.circuit.map(g => {
            if (g.id === 'CG') {
                return {
                    id: 'CG',
                    qubits: [...g.qubits],
                    gates: g.gates.map(convertLevelGate)
                };
            }
            return { id: convertLevelGate(g.id), qubits: [...g.qubits] };
        });
    } else if (level.start && Array.isArray(level.start[0])) {
        circuit = [];
        level.start.forEach((wireGates, qubitIndex) => {
            wireGates.forEach(gateId => {
                circuit.push({ id: convertLevelGate(gateId), qubits: [qubitIndex] });
            });
        });
    } else if (level.start) {
        circuit = level.start.map(gateId => ({ id: convertLevelGate(gateId), qubits: [0] }));
    } else {
        circuit = [];
    }
    
    circuit.forEach((gate, idx) => {
        if (!validateCGGate(gate)) {
            console.error(`Invalid CG at index ${idx}`);
        }
    });
    
    render();
    updateLevelDisplay();
    // setStatus(`Level ${level.id}: ${level.name}`);
}

function isActionAllowed(action, gateA, gateB) {
    if (isSandboxMode || !currentLevel || !currentLevel.allowed) return true;
    
    const allowed = currentLevel.allowed;
    
    if (action === 'merge' && allowed.merge) {
        for (const rule of allowed.merge) {
            if (rule === 'same-pauli') {
                const ga = parseGate(gateA);
                const gb = parseGate(gateB);
                if (ga && gb && ga.type === 'P' && gb.type === 'P' && gatesEqual(ga, gb)) return true;
            } else if (rule === 'pauli') {
                if (isFullPauli(gateA) && isFullPauli(gateB)) return true;
            } else if (rule === 'all') {
                return true;
            }
        }
        return false;
    }
    
    if (action === 'swap' && allowed.swap !== undefined) return allowed.swap;
    if (action === 'split' && allowed.split !== undefined) return allowed.split;
    
    return true;
}

// Check if a specific CG rule type is allowed
function isCGTypeAllowed(cgType) {
    if (isSandboxMode || !currentLevel || !currentLevel.allowed) return true;
    
    const key = `cg-type-${cgType}`;
    const allowed = currentLevel.allowed;
    
    // If the key is explicitly set, use that value
    if (key in allowed) return allowed[key];
    
    // Default: allow all CG types unless explicitly disabled
    return true;
}

function nextLevel() {
    if (!currentLevel || !levelsData) return;
    const idx = levelsData.levels.findIndex(l => l.id === currentLevel.id);
    if (idx < levelsData.levels.length - 1) {
        loadLevel(levelsData.levels[idx + 1].id);
    } else {
        setStatus('All levels complete!');
    }
}

function prevLevel() {
    if (!currentLevel || !levelsData) return;
    const idx = levelsData.levels.findIndex(l => l.id === currentLevel.id);
    if (idx > 0) loadLevel(levelsData.levels[idx - 1].id);
}

function enterSandboxMode() {
    randomize();
}

function updateLevelDisplay() {
    const levelInfo = document.getElementById('level-info');
    if (!levelInfo) return;
    
    if (isSandboxMode) {
        levelInfo.innerHTML = `
            <div class="level-header">Sandbox Mode</div>
            <div class="level-desc">Experiment freely! (${numQubits} qubit${numQubits > 1 ? 's' : ''})</div>
        `;
    } else if (currentLevel) {
        const goalText = getGoalText(currentLevel.goal);
        levelInfo.innerHTML = `
            <div class="level-header">Level ${currentLevel.id}: ${currentLevel.name}</div>
            <div class="level-desc">${currentLevel.description}</div>
            <div class="level-goal">Goal: ${goalText}</div>
            <div class="level-stats">Moves: ${moveCount} ${currentLevel.par ? `(Par: ${currentLevel.par})` : ''}</div>
        `;
    }
    
    // Update global phase display
    updateGlobalPhaseDisplay();
}

function updateGlobalPhaseDisplay() {
    const phaseEl = document.getElementById('global-phase');
    if (!phaseEl) return;
    
    // Phase values: 0=1, 1=i, 2=-1, 3=-i
    // Choose a clock emoji to depict the global phase visually.
    // Unicode clocks: 🕛 (12), 🕒 (3), 🕕 (6), 🕘 (9)
    const phaseSymbols = ['🕛', '🕒', '🕕', '🕘']; // 0=0° (1), 1=90° (i), 2=180° (-1), 3=270° (-i)
    // const phaseSymbols = ['1', 'i', '−1', '−i'];
    const phaseColors = ['#4ade80', '#60a5fa', '#f87171', '#fbbf24']; // green, blue, red, yellow
    
    const normalizedPhase = ((globalPhase % 4) + 4) % 4;
    phaseEl.textContent = phaseSymbols[normalizedPhase];
    phaseEl.style.color = phaseColors[normalizedPhase];
}

function addGlobalPhase(quarters) {
    globalPhase = ((globalPhase + quarters) % 4 + 4) % 4;
    updateGlobalPhaseDisplay();
}

function getGoalText(goal) {
    if (goal.type === 'identity') return 'Clear all gates';
    if (goal.type === 'exact') return goal.gates.map(g => getGateLabel(g)).join(' × ');
    if (goal.type === 'length') return `Reach ${goal.length} gate${goal.length === 1 ? '' : 's'}`;
    return '';
}

function checkWinCondition() {
    if (isSandboxMode || !currentLevel) return;
    
    const goal = currentLevel.goal;
    let won = false;
    
    if (goal.type === 'identity') {
        won = circuit.length === 0;
    } else if (goal.type === 'exact') {
        // Compare gates using internal format
        const circuitGates = circuit.map(g => gateToString(parseGate(g.id)));
        const goalGates = goal.gates.map(g => gateToString(parseGate(g)));
        won = circuitGates.length === goalGates.length && circuitGates.every((g, i) => g === goalGates[i]);
    } else if (goal.type === 'length') {
        won = circuit.length === goal.length;
    }
    
    if (won && !levelComplete) {
        levelComplete = true;
        levelCompleteMessage = moveCount <= currentLevel.par
            ? `🎉 Perfect! (${moveCount}/${currentLevel.par})`
            : `🎉 Solved in ${moveCount} (Par: ${currentLevel.par})`;
        setTimeout(() => {
            setStatus(levelCompleteMessage);
            updateLevelDisplay();
        }, 300);
    }
}

function incrementMoves() {
    moveCount++;
    updateLevelDisplay();
}

// ============================================
// Options
// ============================================

function toggleLabels() {
    const checkbox = document.getElementById('show-labels');
    document.body.classList.toggle('show-labels', checkbox.checked);
}

function togglePhase() {
    const checkbox = document.getElementById('show-phase');
    const phaseContainer = document.getElementById('global-phase-container');
    if (phaseContainer) {
        phaseContainer.classList.toggle('hidden', !checkbox.checked);
    }
}

// ============================================
// Test Suite
// ============================================

async function runTests() {
    try {
        const response = await fetch('tests.json');
        const testsData = await response.json();
        
        console.log('=== Running Interaction Zone Tests ===');
        let passed = 0;
        let failed = 0;
        
        for (const test of testsData.tests) {
            const results = runSingleTest(test);
            if (results.passed) {
                console.log(`✓ ${test.name}`);
                passed++;
            } else {
                console.error(`✗ ${test.name}`);
                for (const error of results.errors) {
                    console.error(`  - ${error}`);
                }
                failed++;
            }
        }
        
        console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
        return { passed, failed };
    } catch (e) {
        console.error('Failed to run tests:', e);
        return { passed: 0, failed: -1, error: e };
    }
}

function runSingleTest(test) {
    const errors = [];
    
    // Set up the circuit
    numQubits = test.qubits;
    circuit = test.circuit.map(g => {
        if (g.id === 'CG') {
            return {
                id: 'CG',
                qubits: [...g.qubits],
                gates: g.gates.map(convertLevelGate)
            };
        }
        return { id: convertLevelGate(g.id), qubits: [...g.qubits] };
    });
    
    // Calculate depths and get interaction zones
    const depths = calculateDepths();
    const zones = getInteractionZones(depths);
    
    // Check expected zones
    if (test.expectedZones) {
        for (const expected of test.expectedZones) {
            const found = zones.find(z => 
                z.qubit === expected.qubit && 
                z.depth === expected.depth && 
                z.type === expected.type
            );
            if (!found) {
                errors.push(`Expected ${expected.type} zone at qubit ${expected.qubit}, depth ${expected.depth}${expected.description ? ` (${expected.description})` : ''}`);
            }
        }
    }
    
    // Check forbidden zones
    if (test.forbiddenZones) {
        for (const forbidden of test.forbiddenZones) {
            const found = zones.find(z => 
                z.qubit === forbidden.qubit && 
                z.depth === forbidden.depth && 
                z.type === forbidden.type
            );
            if (found) {
                errors.push(`Unexpected ${forbidden.type} zone at qubit ${forbidden.qubit}, depth ${forbidden.depth}${forbidden.description ? ` (${forbidden.description})` : ''}`);
            }
        }
    }
    
    return { passed: errors.length === 0, errors };
}

// Get interaction zones without rendering (for testing)
function getInteractionZones(depths) {
    const zones = [];
    const zoneKeys = new Set();
    const depthsWithIndex = depths.map((d, idx) => ({ ...d, circuitIndex: idx }));
    
    // Pass 1: Adjacent gates on same qubit
    for (let q = 0; q < numQubits; q++) {
        const gatesOnQubit = depthsWithIndex
            .filter(d => gateTouchesQubit(d.gate, q))
            .sort((a, b) => a.depth - b.depth);
        
        for (let i = 0; i < gatesOnQubit.length - 1; i++) {
            const left = gatesOnQubit[i];
            const right = gatesOnQubit[i + 1];
            
            const zoneKey = `${left.depth}-${q}`;
            if (zoneKeys.has(zoneKey)) continue;
            zoneKeys.add(zoneKey);
            
            const canInteract = areCircuitAdjacent(left.circuitIndex, right.circuitIndex, depthsWithIndex, q);
            if (!canInteract) continue;
            
            const swapResult = canSwapCircuitGates(left.gate, right.gate);
            const mergeResult = canMergeCircuitGates(left.gate, right.gate, q);
            
            let type = 'disabled';
            if (mergeResult?.canMerge) {
                type = 'mergeable';
            } else if (swapResult?.canSwap) {
                type = 'swappable';
            }
            
            zones.push({
                qubit: q,
                depth: left.depth,
                type,
                leftCircuitIndex: left.circuitIndex,
                rightCircuitIndex: right.circuitIndex
            });
        }
    }
    
    // Pass 2: Single-qubit gates in the span of a CG
    for (const entry of depthsWithIndex) {
        if (entry.gate.id !== 'CG') continue;
        
        const cgGate = entry.gate;
        const cgDepth = entry.depth;
        const cgIdx = entry.circuitIndex;
        const [q1, q2] = cgGate.qubits;
        const minQ = Math.min(q1, q2);
        const maxQ = Math.max(q1, q2);
        
        for (let q = minQ + 1; q < maxQ; q++) {
            const gatesOnSpanQubit = depthsWithIndex
                .filter(d => isSingleQubitCircuitGate(d.gate) && d.gate.qubits[0] === q)
                .sort((a, b) => a.depth - b.depth);
            
            for (const singleEntry of gatesOnSpanQubit) {
                // Check if this single-qubit gate is visually adjacent to the CG
                const depthDiff = Math.abs(singleEntry.depth - cgDepth);
                if (depthDiff > 1) continue;
                
                const singleIdx = singleEntry.circuitIndex;
                
                // Check if they can interact - no blocking gates in between on this span qubit
                if (!areCircuitAdjacent(singleIdx, cgIdx, depthsWithIndex, q)) continue;
                
                const leftIdx = Math.min(singleIdx, cgIdx);
                const rightIdx = Math.max(singleIdx, cgIdx);
                const leftGate = circuit[leftIdx];
                const rightGate = circuit[rightIdx];
                
                const swapResult = canSwapCircuitGates(leftGate, rightGate);
                if (!swapResult?.canSwap) continue;
                
                const zoneKey = `cg-span-${cgIdx}-${singleIdx}`;
                if (zoneKeys.has(zoneKey)) continue;
                zoneKeys.add(zoneKey);
                
                zones.push({
                    qubit: q,
                    depth: Math.min(singleEntry.depth, cgDepth),
                    type: 'swappable',
                    leftCircuitIndex: leftIdx,
                    rightCircuitIndex: rightIdx
                });
            }
        }
    }
    
    return zones;
}

// ============================================
// Initialize
// ============================================

// Expose runTests globally for console access
window.runTests = runTests;

document.addEventListener('DOMContentLoaded', async () => {
    await loadLevels();
    if (levelsData?.levels.length > 0) {
        loadLevel(levelsData.levels[0].id);
    } else {
        enterSandboxMode();
    }
    
    // Run tests if URL has ?test parameter
    if (window.location.search.includes('test')) {
        setTimeout(() => runTests(), 500);
    }

    toggleLabels();
    togglePhase();
});
