// ============================================
// Quantum Gate Puzzle - Game Logic
// ============================================

// Gate types:
// Full Paulis: 'X', 'Y', 'Z' (value = 2 in quarter-turns)
// Half gates (S): 'Sx', 'Sy', 'Sz' (value = 1 quarter-turn)
// S-dagger gates: 'Sxd', 'Syd', 'Szd' (value = 3 quarter-turns, i.e., -1 or "almost identity")
// Hadamard-type (axis swaps): 'Hx', 'Hy', 'Hz'
//   - Hz swaps X↔Y (rotation around Z axis in Bloch sphere sense)
//   - Hx swaps Y↔Z
//   - Hy swaps X↔Z (this is the traditional Hadamard!)
// Colors: X=Red, Y=Green, Z=Blue

let gates = [];
let levelsData = null;
let currentLevel = null;
let moveCount = 0;
let isSandboxMode = true;

const GATE_CLASSES = {
    'X': 'gate-x',
    'Y': 'gate-y', 
    'Z': 'gate-z',
    'Sx': 'gate-sx',
    'Sy': 'gate-sy',
    'Sz': 'gate-sz',
    'Sxd': 'gate-sxd',
    'Syd': 'gate-syd',
    'Szd': 'gate-szd',
    'Hx': 'gate-h gate-hx',
    'Hy': 'gate-h gate-hy',
    'Hz': 'gate-h gate-hz'
};

const GATE_LABELS = {
    'X': 'X',
    'Y': 'Y',
    'Z': 'Z',
    'Sx': '√X',
    'Sy': '√Y',
    'Sz': 'S',    // Traditional name for √Z
    'Sxd': '√X†',
    'Syd': '√Y†',
    'Szd': 'S†',  // Traditional name for √Z†
    'Hx': 'Hx',
    'Hy': 'Hy',   // Traditional Hadamard (X↔Z swap)
    'Hz': 'Hz'
};

// ============================================
// Gate Algebra Helpers
// ============================================

// Get the "color" (axis) of a gate (for Paulis, S, and S† gates)
function getAxis(gate) {
    if (gate === 'X' || gate === 'Sx' || gate === 'Sxd') return 'X';
    if (gate === 'Y' || gate === 'Sy' || gate === 'Syd') return 'Y';
    if (gate === 'Z' || gate === 'Sz' || gate === 'Szd') return 'Z';
    return null;
}

// Get the "quarter-turn value" of a same-axis gate
// Full Pauli = 2, S = 1, S† = 3 (which is -1 mod 4)
function getQuarterTurns(gate) {
    if (gate === 'X' || gate === 'Y' || gate === 'Z') return 2;
    if (gate === 'Sx' || gate === 'Sy' || gate === 'Sz') return 1;
    if (gate === 'Sxd' || gate === 'Syd' || gate === 'Szd') return 3;
    return 0;
}

// Build a gate from axis and quarter-turns (mod 4)
function gateFromQuarterTurns(axis, quarters) {
    const q = ((quarters % 4) + 4) % 4; // Normalize to 0-3
    if (q === 0) return null; // Identity
    if (q === 1) return 'S' + axis.toLowerCase();        // S
    if (q === 2) return axis;                             // Full Pauli
    if (q === 3) return 'S' + axis.toLowerCase() + 'd';   // S†
    return null;
}

// Is this a Pauli-axis gate (not Hadamard)?
function isPauliAxis(gate) {
    return getAxis(gate) !== null;
}

// Is this a Hadamard-type gate?
function isHadamard(gate) {
    return gate.startsWith('H');
}

// Get which two axes a Hadamard swaps
// Hz swaps X↔Y, Hx swaps Y↔Z, Hy swaps X↔Z
function getHadamardSwap(gate) {
    if (gate === 'Hz') return ['X', 'Y'];
    if (gate === 'Hx') return ['Y', 'Z'];
    if (gate === 'Hy') return ['X', 'Z'];
    return null;
}

// Apply Hadamard conjugation: H * P * H = P' (swap the axis if it's one of the two)
// Works for S and S† gates too
function conjugateByHadamard(hadamard, gate) {
    const swap = getHadamardSwap(hadamard);
    if (!swap) return gate;
    
    const axis = getAxis(gate);
    const quarters = getQuarterTurns(gate);
    
    if (axis === swap[0]) {
        // Swap to the other axis
        return gateFromQuarterTurns(swap[1], quarters);
    } else if (axis === swap[1]) {
        return gateFromQuarterTurns(swap[0], quarters);
    }
    // Axis not involved in swap - unchanged
    return gate;
}

// ============================================
// Gate Multiplication (Merge)
// ============================================

// Check if two adjacent gates should swap instead of merge
// Returns the swapped pair [newLeft, newRight] or null if not swappable
function canSwap(a, b) {
    const hadamardA = isHadamard(a);
    const hadamardB = isHadamard(b);
    const pauliA = isPauliAxis(a);
    const pauliB = isPauliAxis(b);

    // H * P = P' * H (Hadamard commutes through Pauli/S/S†, changing its color)
    if (hadamardA && pauliB) {
        const newGate = conjugateByHadamard(a, b);
        return [newGate, a]; // P' * H
    }

    // P * H = H * P' (Pauli/S/S† commutes through Hadamard, changing its color)
    if (pauliA && hadamardB) {
        const newGate = conjugateByHadamard(b, a);
        return [b, newGate]; // H * P'
    }

    // Same-axis gates commute (just swap positions, no change)
    // e.g., X * √X = √X * X, S * Z = Z * S, S * S† = S† * S
    if (pauliA && pauliB) {
        const axisA = getAxis(a);
        const axisB = getAxis(b);
        if (axisA === axisB && a !== b) {
            // Same axis but different gates - they commute
            // Check if they would merge (sum to 0 or 4 mod 4) - if so, don't swap
            const sum = getQuarterTurns(a) + getQuarterTurns(b);
            if (sum % 4 !== 0) {
                return [b, a];
            }
        }
    }

    return null;
}

// Multiplication rules for the extended gate set
// Returns: [result_gates...] (array, possibly empty for identity)
// Returns null if gates cannot be merged
function multiplyGates(a, b) {
    const hadamardA = isHadamard(a);
    const hadamardB = isHadamard(b);

    // Two identical Hadamards annihilate: H * H = I
    if (hadamardA && hadamardB && a === b) {
        return [];
    }

    // Two different Hadamards - don't simplify for now
    if (hadamardA && hadamardB) {
        return null;
    }

    // Hadamard with Pauli/S/S†: handled by swap, not merge
    if (hadamardA || hadamardB) {
        return null;
    }

    // From here: both are Pauli-axis gates (X/Y/Z, S, or S†)
    const axisA = getAxis(a);
    const axisB = getAxis(b);

    // Same axis - use quarter-turn arithmetic
    if (axisA === axisB) {
        const sum = getQuarterTurns(a) + getQuarterTurns(b);
        const result = gateFromQuarterTurns(axisA, sum);
        if (result === null) {
            return []; // Identity (sum = 0 mod 4)
        }
        return [result];
    }

    // Different axes - only handle full Paulis multiplying
    const quartersA = getQuarterTurns(a);
    const quartersB = getQuarterTurns(b);
    if (quartersA === 2 && quartersB === 2) {
        // Different full Paulis produce the third
        const axes = ['X', 'Y', 'Z'];
        const third = axes.find(g => g !== axisA && g !== axisB);
        return [third];
    }

    // Mixed axes with S/S† gates: don't simplify for now
    return null;
}

// ============================================
// Gate Splitting
// ============================================

// Split rules
// Click: split into two different Paulis (for full Paulis)
// Shift+Click: split reversed
// Ctrl+Click: split into S*S (half gates)
function splitGate(gate, shiftKey, ctrlKey) {
    // Hadamards can't be split
    if (isHadamard(gate)) {
        return null;
    }

    const axis = getAxis(gate);
    const quarters = getQuarterTurns(gate);

    // Only full Paulis (quarters = 2) can be split
    if (quarters !== 2) {
        return null; // S and S† gates can't be split
    }

    // Ctrl+Click: split into S*S (two half gates)
    if (ctrlKey) {
        const halfGate = gateFromQuarterTurns(axis, 1); // S gate
        return [halfGate, halfGate];
    }

    // Default: split into two different Paulis
    const splits = {
        'X': shiftKey ? ['Z', 'Y'] : ['Y', 'Z'],
        'Y': shiftKey ? ['X', 'Z'] : ['Z', 'X'],
        'Z': shiftKey ? ['Y', 'X'] : ['X', 'Y']
    };
    return splits[axis];
}

// ============================================
// Rendering
// ============================================

function render() {
    const row = document.getElementById('gates-row');
    row.innerHTML = '';

    if (gates.length === 0) {
        row.innerHTML = '<div class="empty-state">Identity ✓</div>';
        setStatus('Wire simplified to identity!');
        return;
    }

    gates.forEach((gate, index) => {
        // Add gap before each gate (for merging/swapping with previous)
        if (index > 0) {
            const gap = document.createElement('div');
            const left = gates[index - 1];
            const right = gate;
            const swapResult = canSwap(left, right);
            const mergeResult = multiplyGates(left, right);
            
            if (swapResult && isActionAllowed('swap', left, right)) {
                // This pair can swap (Hadamard + Pauli)
                gap.className = 'gap swappable';
                gap.onclick = () => swapAt(index);
                gap.title = 'Click to swap (commute) gates';
            } else if (mergeResult !== null && isActionAllowed('merge', left, right)) {
                // Normal merge
                gap.className = 'gap mergeable';
                gap.onclick = () => mergeAt(index);
                gap.title = 'Click to merge adjacent gates';
            } else {
                // No action available
                gap.className = 'gap disabled';
                gap.title = 'No action available';
            }
            gap.dataset.index = index;
            row.appendChild(gap);
        }

        // Add gate
        const gateEl = document.createElement('div');
        gateEl.className = `gate ${GATE_CLASSES[gate]}`;
        
        // Check if splitting is allowed
        const canSplit = isActionAllowed('split', gate, null) && getQuarterTurns(gate) === 2;
        if (!canSplit && !isSandboxMode && currentLevel) {
            gateEl.classList.add('no-split');
        }
        
        gateEl.innerHTML = `<span class="gate-label">${GATE_LABELS[gate]}</span>`;
        gateEl.dataset.index = index;
        gateEl.onclick = (e) => {
            e.preventDefault();
            splitAt(index, e.shiftKey, e.ctrlKey);
        };
        gateEl.oncontextmenu = (e) => {
            e.preventDefault();
            // Right-click = shift behavior
            splitAt(index, true, e.ctrlKey);
        };
        gateEl.title = canSplit ? 'Click to split (Shift: reverse, Ctrl: half-gates)' : '';
        row.appendChild(gateEl);
    });

    setStatus('');
}

// ============================================
// Game Actions
// ============================================

let isAnimating = false;

function mergeAt(index) {
    if (isAnimating) return;
    if (index < 1 || index >= gates.length) return;
    
    const left = gates[index - 1];
    const right = gates[index];
    
    // Check level restrictions
    if (!isActionAllowed('merge', left, right)) {
        setStatus(`This merge is not allowed in this level`);
        return;
    }
    
    const result = multiplyGates(left, right);

    if (result === null) {
        // Cannot merge these gates
        setStatus(`Cannot merge ${GATE_LABELS[left]} × ${GATE_LABELS[right]}`);
        return;
    }

    const isAnnihilation = result.length === 0;

    // Animate the merge
    isAnimating = true;
    const row = document.getElementById('gates-row');
    const children = Array.from(row.children);
    
    // Find the gap and adjacent gates
    // Structure: [gate0, gap1, gate1, gap2, gate2, ...]
    // Gap at index N is between gate N-1 and gate N
    // So gap element index = (index - 1) * 2 + 1 = index * 2 - 1
    const gapElIndex = index * 2 - 1;
    const leftGateEl = children[gapElIndex - 1];
    const gapEl = children[gapElIndex];
    const rightGateEl = children[gapElIndex + 1];
    
    // Add merging classes to slide together
    // For annihilation, use the extended animation
    if (isAnnihilation) {
        leftGateEl.classList.add('annihilating-left');
        rightGateEl.classList.add('annihilating-right');
        gapEl.classList.add('annihilating-gap');
    } else {
        leftGateEl.classList.add('merging-left');
        rightGateEl.classList.add('merging-right');
        gapEl.classList.add('merging-gap');
    }
    
    incrementMoves();
    
    // After first slide animation, show the result or white flash
    setTimeout(() => {
        if (isAnnihilation) {
            // Create a white "identity" block that pops and fades
            const identityEl = document.createElement('div');
            identityEl.className = 'gate gate-identity annihilate-pop';
            identityEl.innerHTML = '<span class="gate-label">I</span>';
            
            // Insert it where the gap was
            gapEl.style.display = 'none';
            leftGateEl.style.display = 'none';
            rightGateEl.style.display = 'none';
            row.insertBefore(identityEl, gapEl);
            
            // After the pop-and-fade, re-render
            setTimeout(() => {
                gates.splice(index - 1, 2, ...result);
                setStatus(`${GATE_LABELS[left]} × ${GATE_LABELS[right]} = I (annihilated)`);
                render();
                isAnimating = false;
                checkWinCondition();
            }, 250);
        } else {
            // Normal merge - update and show new gate
            gates.splice(index - 1, 2, ...result);
            const resultStr = result.map(g => GATE_LABELS[g]).join(' × ');
            setStatus(`${GATE_LABELS[left]} × ${GATE_LABELS[right]} = ${resultStr}`);
            renderWithNewGate(index - 1, true);
            isAnimating = false;
            checkWinCondition();
        }
    }, 100);
}

function renderWithNewGate(newIndex, hasNewGate) {
    const row = document.getElementById('gates-row');
    row.innerHTML = '';

    if (gates.length === 0) {
        row.innerHTML = '<div class="empty-state">Identity ✓</div>';
        return;
    }

    gates.forEach((gate, index) => {
        // Add gap before each gate (for merging/swapping with previous)
        if (index > 0) {
            const gap = document.createElement('div');
            const left = gates[index - 1];
            const right = gate;
            const swapResult = canSwap(left, right);
            
            if (swapResult) {
                gap.className = 'gap swappable';
                gap.onclick = () => swapAt(index);
                gap.title = 'Click to swap (commute) gates';
            } else {
                gap.className = 'gap mergeable';
                gap.onclick = () => mergeAt(index);
                gap.title = 'Click to merge adjacent gates';
            }
            gap.dataset.index = index;
            row.appendChild(gap);
        }

        // Add gate
        const gateEl = document.createElement('div');
        gateEl.className = `gate ${GATE_CLASSES[gate]}`;
        
        // Add pop-in animation for the newly created gate
        if (hasNewGate && index === newIndex) {
            gateEl.classList.add('merge-pop');
        }
        
        gateEl.innerHTML = `<span class="gate-label">${GATE_LABELS[gate]}</span>`;
        gateEl.dataset.index = index;
        gateEl.onclick = (e) => {
            e.preventDefault();
            splitAt(index, e.shiftKey, e.ctrlKey);
        };
        gateEl.oncontextmenu = (e) => {
            e.preventDefault();
            splitAt(index, true, e.ctrlKey);
        };
        gateEl.title = 'Click to split (Shift: reverse, Ctrl: half-gates)';
        row.appendChild(gateEl);
    });
}

function swapAt(index) {
    if (isAnimating) return;
    if (index < 1 || index >= gates.length) return;
    
    const left = gates[index - 1];
    const right = gates[index];
    
    // Check level restrictions
    if (!isActionAllowed('swap', left, right)) {
        setStatus(`Swapping is not allowed in this level`);
        return;
    }
    
    const swapResult = canSwap(left, right);

    if (swapResult === null) {
        setStatus(`Cannot swap ${GATE_LABELS[left]} ↔ ${GATE_LABELS[right]}`);
        return;
    }

    const [newLeft, newRight] = swapResult;
    gates[index - 1] = newLeft;
    gates[index] = newRight;
    
    incrementMoves();
    setStatus(`${GATE_LABELS[left]} ${GATE_LABELS[right]} ↔ ${GATE_LABELS[newLeft]} ${GATE_LABELS[newRight]}`);
    render();
    checkWinCondition();
}

function splitAt(index, shiftKey, ctrlKey) {
    if (isAnimating) return;
    if (index < 0 || index >= gates.length) return;
    
    const gate = gates[index];
    
    // Check level restrictions
    if (!isActionAllowed('split', gate, null)) {
        setStatus(`Splitting is not allowed in this level`);
        return;
    }
    
    const result = splitGate(gate, shiftKey, ctrlKey);
    
    if (result === null) {
        setStatus(`Cannot split ${GATE_LABELS[gate]} this way`);
        return;
    }

    gates.splice(index, 1, ...result);
    incrementMoves();
    const resultStr = result.map(g => GATE_LABELS[g]).join(' × ');
    setStatus(`${GATE_LABELS[gate]} → ${resultStr}`);
    
    render();
    checkWinCondition();
}

function setStatus(msg) {
    document.getElementById('status').textContent = msg;
}

// ============================================
// Game Controls
// ============================================

function resetGame() {
    if (currentLevel) {
        loadLevel(currentLevel.id);
    } else {
        gates = ['Hy', 'Z', 'Hy'];
        moveCount = 0;
        render();
        setStatus('Reset!');
    }
}

function randomize() {
    isSandboxMode = true;
    currentLevel = null;
    moveCount = 0;
    const count = Math.floor(Math.random() * 5) + 2; // 2-6 gates
    const types = ['X', 'Y', 'Z', 'Sx', 'Sy', 'Sz', 'Sxd', 'Syd', 'Szd', 'Hx', 'Hy', 'Hz'];
    gates = Array.from({ length: count }, () => types[Math.floor(Math.random() * types.length)]);
    render();
    updateLevelDisplay();
    setStatus('Sandbox mode - Randomized!');
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

function loadLevel(levelId) {
    if (!levelsData) return;
    
    const level = levelsData.levels.find(l => l.id === levelId);
    if (!level) return;
    
    currentLevel = level;
    isSandboxMode = false;
    moveCount = 0;
    gates = [...level.start]; // Clone the array
    
    render();
    updateLevelDisplay();
    setStatus(`Level ${level.id}: ${level.name}`);
}

// Check if an action is allowed in the current level
function isActionAllowed(action, gateA, gateB) {
    // Sandbox mode allows everything
    if (isSandboxMode || !currentLevel || !currentLevel.allowed) {
        return true;
    }
    
    const allowed = currentLevel.allowed;
    
    if (action === 'merge' && allowed.merge) {
        // Check merge restrictions
        for (const rule of allowed.merge) {
            if (rule === 'same-pauli') {
                // Only allow merging identical full Paulis
                if (gateA === gateB && ['X', 'Y', 'Z'].includes(gateA)) {
                    return true;
                }
            } else if (rule === 'pauli') {
                // Allow any Pauli merges
                if (['X', 'Y', 'Z'].includes(gateA) && ['X', 'Y', 'Z'].includes(gateB)) {
                    return true;
                }
            } else if (rule === 'all') {
                return true;
            }
        }
        return false;
    }
    
    if (action === 'swap' && allowed.swap !== undefined) {
        return allowed.swap;
    }
    
    if (action === 'split' && allowed.split !== undefined) {
        return allowed.split;
    }
    
    // Default: allow if not restricted
    return true;
}

function nextLevel() {
    if (!currentLevel || !levelsData) return;
    
    const currentIndex = levelsData.levels.findIndex(l => l.id === currentLevel.id);
    if (currentIndex < levelsData.levels.length - 1) {
        loadLevel(levelsData.levels[currentIndex + 1].id);
    } else {
        setStatus('Congratulations! You completed all levels!');
    }
}

function prevLevel() {
    if (!currentLevel || !levelsData) return;
    
    const currentIndex = levelsData.levels.findIndex(l => l.id === currentLevel.id);
    if (currentIndex > 0) {
        loadLevel(levelsData.levels[currentIndex - 1].id);
    }
}

function enterSandboxMode() {
    isSandboxMode = true;
    currentLevel = null;
    moveCount = 0;
    gates = ['Hy', 'Z', 'Hy'];
    render();
    updateLevelDisplay();
    setStatus('Sandbox mode');
}

function updateLevelDisplay() {
    const levelInfo = document.getElementById('level-info');
    if (!levelInfo) return;
    
    if (isSandboxMode) {
        levelInfo.innerHTML = `
            <div class="level-header">Sandbox Mode</div>
            <div class="level-desc">Experiment freely!</div>
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
}

function getGoalText(goal) {
    if (goal.type === 'identity') {
        return 'Clear all gates (reach Identity)';
    } else if (goal.type === 'exact') {
        return goal.gates.map(g => GATE_LABELS[g]).join(' × ');
    } else if (goal.type === 'length') {
        return `Reach ${goal.length} gates`;
    }
    return '';
}

function checkWinCondition() {
    if (isSandboxMode || !currentLevel) return;
    
    const goal = currentLevel.goal;
    let won = false;
    
    if (goal.type === 'identity') {
        won = gates.length === 0;
    } else if (goal.type === 'exact') {
        won = gates.length === goal.gates.length && 
              gates.every((g, i) => g === goal.gates[i]);
    } else if (goal.type === 'length') {
        won = gates.length === goal.length;
    }
    
    if (won) {
        const parMessage = moveCount <= currentLevel.par 
            ? `Perfect! (${moveCount}/${currentLevel.par} moves)` 
            : `Solved in ${moveCount} moves (Par: ${currentLevel.par})`;
        
        setTimeout(() => {
            setStatus(`🎉 ${parMessage}`);
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
    if (checkbox.checked) {
        document.body.classList.add('show-labels');
    } else {
        document.body.classList.remove('show-labels');
    }
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadLevels();
    
    // Start with level 1 if levels loaded, otherwise sandbox
    if (levelsData && levelsData.levels.length > 0) {
        loadLevel("1");
    } else {
        enterSandboxMode();
    }
});

