// ========================================
// Neural Decrypter - Sudoku Game Engine
// ========================================

class SudokuGame {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.initialGrid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.noteMode = false;
        this.difficulty = 'easy';
        this.timer = 0;
        this.timerInterval = null;
        this.integrity = 100;
        this.notes = Array(9).fill(null).map(() => 
            Array(9).fill(null).map(() => new Set())
        );
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupParticleBackground();
        this.loadGame();
        if (!this.grid.some(row => row.some(cell => cell !== 0))) {
            this.newGame();
        }
    }

    // ========================================
    // Particle Background Effect
    // ========================================
    setupParticleBackground() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 80;
        const connectionDistance = 150;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ========================================
    // Event Listeners
    // ========================================
    setupEventListeners() {
        // Numpad buttons
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const number = parseInt(btn.dataset.number);
                this.inputNumber(number);
            });
        });

        // Action buttons
        document.getElementById('note-btn').addEventListener('click', () => {
            this.toggleNoteMode();
        });

        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });

        document.getElementById('delete-btn').addEventListener('click', () => {
            this.deleteCell();
        });

        // Difficulty selector
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
                document.getElementById('difficulty-display').textContent = this.difficulty.toUpperCase();
            });
        });

        // Game control buttons
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // Modal button
        document.getElementById('modal-new-game').addEventListener('click', () => {
            document.getElementById('completion-modal').classList.remove('active');
            this.newGame();
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.inputNumber(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.deleteCell();
            } else if (e.key === 'n' || e.key === 'N') {
                this.toggleNoteMode();
            }
        });
    }

    // ========================================
    // Sudoku Generation Algorithm
    // ========================================
    generateSudoku() {
        // Clear grids
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));

        // Fill the grid with a valid solution
        this.fillGrid(this.solution);
        
        // Copy solution to grid
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.grid[i][j] = this.solution[i][j];
            }
        }

        // Remove numbers based on difficulty
        const cellsToRemove = {
            easy: 35,
            medium: 45,
            hard: 55
        };

        this.removeNumbers(cellsToRemove[this.difficulty]);
        
        // Store initial grid state
        this.initialGrid = this.grid.map(row => [...row]);
    }

    fillGrid(grid) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    // Fisher-Yates shuffle for proper randomization
                    const shuffled = [...numbers];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    
                    for (let num of shuffled) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            
                            if (this.fillGrid(grid)) {
                                return true;
                            }
                            
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    isValid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }

        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }

        return true;
    }

    removeNumbers(count) {
        let removed = 0;
        while (removed < count) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (this.grid[row][col] !== 0) {
                this.grid[row][col] = 0;
                removed++;
            }
        }
    }

    // ========================================
    // Game Logic
    // ========================================
    newGame() {
        this.stopTimer();
        this.timer = 0;
        this.integrity = 100;
        this.noteMode = false;
        this.selectedCell = null;
        
        this.generateSudoku();
        this.renderGrid();
        this.updateUI();
        this.startTimer();
        this.saveGame();
    }

    resetGame() {
        this.stopTimer();
        this.timer = 0;
        this.integrity = 100;
        this.noteMode = false;
        this.selectedCell = null;
        this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
        
        // Reset to initial grid
        this.grid = this.initialGrid.map(row => [...row]);
        
        this.renderGrid();
        this.updateUI();
        this.startTimer();
        this.saveGame();
    }

    inputNumber(number) {
        if (!this.selectedCell) return;

        const [row, col] = this.selectedCell;
        
        // Don't allow editing fixed cells
        if (this.initialGrid[row][col] !== 0) return;

        if (this.noteMode) {
            // Toggle note
            if (this.notes[row][col].has(number)) {
                this.notes[row][col].delete(number);
            } else {
                this.notes[row][col].add(number);
            }
        } else {
            // Clear notes when entering a number
            this.notes[row][col].clear();
            
            // Check if number is correct
            if (number === this.solution[row][col]) {
                this.grid[row][col] = number;
            } else {
                this.grid[row][col] = number;
                this.decreaseIntegrity();
            }

            // Check if puzzle is completed
            if (this.isPuzzleComplete()) {
                this.onPuzzleComplete();
            }
        }

        this.renderGrid();
        this.saveGame();
    }

    deleteCell() {
        if (!this.selectedCell) return;

        const [row, col] = this.selectedCell;
        
        // Don't allow editing fixed cells
        if (this.initialGrid[row][col] !== 0) return;

        this.grid[row][col] = 0;
        this.notes[row][col].clear();
        
        this.renderGrid();
        this.saveGame();
    }

    toggleNoteMode() {
        this.noteMode = !this.noteMode;
        const noteBtn = document.getElementById('note-btn');
        noteBtn.classList.toggle('active', this.noteMode);
    }

    showHint() {
        if (!this.selectedCell) {
            // Find first empty cell
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (this.grid[i][j] === 0) {
                        this.selectCell(i, j);
                        break;
                    }
                }
                if (this.selectedCell) break;
            }
        }

        if (!this.selectedCell) return;

        const [row, col] = this.selectedCell;
        
        // Don't give hints for fixed or filled cells
        if (this.initialGrid[row][col] !== 0 || this.grid[row][col] !== 0) return;

        // Fill in the correct number
        this.grid[row][col] = this.solution[row][col];
        this.notes[row][col].clear();
        
        this.decreaseIntegrity(5); // Larger penalty for hints
        
        this.renderGrid();
        
        // Check if puzzle is completed
        if (this.isPuzzleComplete()) {
            this.onPuzzleComplete();
        }
        
        this.saveGame();
    }

    // ========================================
    // UI Updates
    // ========================================
    renderGrid() {
        const gridElement = document.getElementById('sudoku-grid');
        gridElement.innerHTML = '';

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                const value = this.grid[row][col];
                const isFixed = this.initialGrid[row][col] !== 0;

                if (isFixed) {
                    cell.classList.add('cell-fixed');
                }

                if (value !== 0) {
                    cell.textContent = value;
                    
                    // Check if correct
                    if (value === this.solution[row][col]) {
                        if (!isFixed) {
                            cell.classList.add('cell-correct');
                        }
                    } else {
                        cell.classList.add('cell-error');
                    }
                } else if (this.notes[row][col].size > 0) {
                    // Display notes
                    const notesContainer = document.createElement('div');
                    notesContainer.className = 'cell-notes';
                    
                    for (let i = 1; i <= 9; i++) {
                        const note = document.createElement('div');
                        note.className = 'note';
                        if (this.notes[row][col].has(i)) {
                            note.textContent = i;
                        }
                        notesContainer.appendChild(note);
                    }
                    
                    cell.appendChild(notesContainer);
                }

                // Add event listener
                cell.addEventListener('click', () => {
                    this.selectCell(row, col);
                });

                gridElement.appendChild(cell);
            }
        }

        this.highlightCells();
    }

    selectCell(row, col) {
        this.selectedCell = [row, col];
        this.highlightCells();
    }

    highlightCells() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('cell-selected', 'cell-highlight', 'cell-same-number');
        });

        if (!this.selectedCell) return;

        const [selectedRow, selectedCol] = this.selectedCell;
        const selectedValue = this.grid[selectedRow][selectedCol];

        document.querySelectorAll('.cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            // Highlight selected cell
            if (row === selectedRow && col === selectedCol) {
                cell.classList.add('cell-selected');
                return;
            }

            // Highlight same row, column, and box
            const sameRow = row === selectedRow;
            const sameCol = col === selectedCol;
            const sameBox = Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
                           Math.floor(col / 3) === Math.floor(selectedCol / 3);

            if (sameRow || sameCol || sameBox) {
                cell.classList.add('cell-highlight');
            }

            // Highlight cells with same number
            if (selectedValue !== 0 && this.grid[row][col] === selectedValue) {
                cell.classList.add('cell-same-number');
            }
        });
    }

    updateUI() {
        // Update timer
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        document.getElementById('timer-display').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Update integrity
        const integrityFill = document.getElementById('integrity-fill');
        const integrityValue = document.getElementById('integrity-value');
        
        integrityFill.style.width = `${this.integrity}%`;
        integrityValue.textContent = `${this.integrity}%`;
        
        if (this.integrity < 50) {
            integrityFill.classList.add('low');
        } else {
            integrityFill.classList.remove('low');
        }

        // Update note mode button
        document.getElementById('note-btn').classList.toggle('active', this.noteMode);
    }

    // ========================================
    // Timer
    // ========================================
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateUI();
            // Save game every 10 seconds to reduce localStorage writes
            if (this.timer % 10 === 0) {
                this.saveGame();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // ========================================
    // System Integrity
    // ========================================
    decreaseIntegrity(amount = 2) {
        this.integrity = Math.max(0, this.integrity - amount);
        this.updateUI();
        
        if (this.integrity === 0) {
            this.onIntegrityDepleted();
        }
    }

    onIntegrityDepleted() {
        this.stopTimer();
        this.showBreachModal();
    }

    showBreachModal() {
        const modal = document.getElementById('completion-modal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalSubtitle = modal.querySelector('.modal-subtitle');
        const modalBody = modal.querySelector('.modal-body');
        const modalBtn = document.getElementById('modal-new-game');
        
        // Update modal content for breach
        modalTitle.textContent = 'SYSTEM BREACH DETECTED';
        modalSubtitle.textContent = '// INTEGRITY COMPROMISED';
        modalBody.innerHTML = '<p style="text-align: center; color: #ef4444; font-size: 1.125rem; line-height: 1.75;">System integrity has reached critical levels. All progress has been lost. Restart decryption protocol.</p>';
        modalBtn.textContent = 'RESTART SYSTEM';
        
        modal.classList.add('active');
        
        // Reset modal for next use
        modalBtn.onclick = () => {
            modal.classList.remove('active');
            modalTitle.textContent = 'DECRYPTION COMPLETE';
            modalSubtitle.textContent = '// SYSTEM UNLOCKED';
            modalBody.innerHTML = `
                <div class="completion-stats">
                    <div class="completion-stat">
                        <span class="completion-label">TIME</span>
                        <span class="completion-value" id="completion-time">00:00</span>
                    </div>
                    <div class="completion-stat">
                        <span class="completion-label">INTEGRITY</span>
                        <span class="completion-value" id="completion-integrity">100%</span>
                    </div>
                </div>
            `;
            modalBtn.textContent = 'START NEW DECRYPTION';
            this.resetGame();
        };
    }

    // ========================================
    // Puzzle Completion
    // ========================================
    isPuzzleComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] !== this.solution[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    onPuzzleComplete() {
        this.stopTimer();
        
        // Update modal with stats
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        document.getElementById('completion-time').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('completion-integrity').textContent = `${this.integrity}%`;
        
        // Show modal
        setTimeout(() => {
            document.getElementById('completion-modal').classList.add('active');
        }, 500);
        
        // Clear saved game
        localStorage.removeItem('sudoku-save');
    }

    // ========================================
    // Save/Load System
    // ========================================
    saveGame() {
        const saveData = {
            grid: this.grid,
            solution: this.solution,
            initialGrid: this.initialGrid,
            notes: this.notes.map(row => row.map(cell => Array.from(cell))),
            timer: this.timer,
            integrity: this.integrity,
            difficulty: this.difficulty,
            noteMode: this.noteMode
        };
        
        localStorage.setItem('sudoku-save', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('sudoku-save');
        
        if (!saveData) return false;
        
        try {
            const data = JSON.parse(saveData);
            
            this.grid = data.grid;
            this.solution = data.solution;
            this.initialGrid = data.initialGrid;
            this.notes = data.notes.map(row => row.map(cell => new Set(cell)));
            this.timer = data.timer || 0;
            this.integrity = data.integrity || 100;
            this.difficulty = data.difficulty || 'easy';
            this.noteMode = data.noteMode || false;
            
            // Update difficulty display
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.difficulty === this.difficulty);
            });
            document.getElementById('difficulty-display').textContent = this.difficulty.toUpperCase();
            
            this.renderGrid();
            this.updateUI();
            this.startTimer();
            
            return true;
        } catch (e) {
            console.error('Failed to load game:', e);
            return false;
        }
    }
}

// ========================================
// Initialize Game
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
