// Neural Decrypter - Sudoku Game Logic

class SudokuGame {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initialBoard = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.notesMode = false;
        this.notes = Array(9).fill().map(() => Array(9).fill().map(() => new Set()));
        this.difficulty = 'easy';
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.timerInterval = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.hintsUsed = 0;
        
        this.init();
    }

    init() {
        this.renderBoard();
        this.attachEventListeners();
        this.loadGame();
        
        // Start new game if no saved game
        if (!this.startTime) {
            this.newGame();
        }
    }

    // Generate a complete valid Sudoku board using backtracking
    generateSolution() {
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.fillBoard(this.solution);
    }

    fillBoard(board) {
        const empty = this.findEmptyCell(board);
        if (!empty) return true;

        const [row, col] = empty;
        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of numbers) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;

                if (this.fillBoard(board)) {
                    return true;
                }

                board[row][col] = 0;
            }
        }

        return false;
    }

    findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    isValid(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Create puzzle by removing numbers from solution
    createPuzzle(difficulty) {
        this.board = this.solution.map(row => [...row]);
        
        const cellsToRemove = {
            'easy': 40,
            'medium': 50,
            'hard': 60
        };

        const toRemove = cellsToRemove[difficulty] || 40;
        let removed = 0;

        while (removed < toRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                removed++;
            }
        }

        this.initialBoard = this.board.map(row => [...row]);
    }

    // Render the Sudoku board
    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                const value = this.board[row][col];
                if (value !== 0) {
                    cell.textContent = value;
                    if (this.initialBoard[row][col] !== 0) {
                        cell.classList.add('initial');
                    }
                }

                // Render notes if in notes mode and cell is empty
                if (value === 0 && this.notes[row][col].size > 0) {
                    const notesDiv = document.createElement('div');
                    notesDiv.className = 'cell-notes';
                    for (let i = 1; i <= 9; i++) {
                        const noteSpan = document.createElement('span');
                        if (this.notes[row][col].has(i)) {
                            noteSpan.textContent = i;
                        }
                        notesDiv.appendChild(noteSpan);
                    }
                    cell.appendChild(notesDiv);
                }

                cell.addEventListener('click', () => this.selectCell(row, col));
                gameBoard.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        // Don't select initial cells
        if (this.initialBoard[row][col] !== 0) return;

        this.selectedCell = { row, col };
        this.updateHighlights();
    }

    updateHighlights() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('selected', 'highlight-row', 'highlight-col', 'highlight-box', 'highlight-number');
        });

        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        const selectedValue = this.board[row][col];

        cells.forEach(cell => {
            const cellRow = parseInt(cell.dataset.row);
            const cellCol = parseInt(cell.dataset.col);

            // Highlight selected cell
            if (cellRow === row && cellCol === col) {
                cell.classList.add('selected');
            }

            // Highlight row and column
            if (cellRow === row || cellCol === col) {
                cell.classList.add('highlight-row');
            }

            // Highlight 3x3 box
            const boxRow = Math.floor(row / 3);
            const boxCol = Math.floor(col / 3);
            const cellBoxRow = Math.floor(cellRow / 3);
            const cellBoxCol = Math.floor(cellCol / 3);
            if (boxRow === cellBoxRow && boxCol === cellBoxCol) {
                cell.classList.add('highlight-box');
            }

            // Highlight same numbers
            if (selectedValue !== 0 && this.board[cellRow][cellCol] === selectedValue) {
                cell.classList.add('highlight-number');
            }
        });
    }

    placeNumber(num) {
        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        
        // Don't modify initial cells
        if (this.initialBoard[row][col] !== 0) return;

        if (this.notesMode) {
            // Toggle note
            if (this.notes[row][col].has(num)) {
                this.notes[row][col].delete(num);
            } else {
                this.notes[row][col].add(num);
            }
        } else {
            // Clear notes when placing a number
            this.notes[row][col].clear();

            // Place number
            if (this.board[row][col] === num) {
                // Remove number if clicking same number
                this.board[row][col] = 0;
            } else {
                this.board[row][col] = num;

                // Check if correct
                if (this.solution[row][col] !== num) {
                    this.makeMistake(row, col);
                } else {
                    // Check if puzzle is complete
                    if (this.isPuzzleComplete()) {
                        this.winGame();
                    }
                }
            }
        }

        this.renderBoard();
        this.updateHighlights();
        this.saveGame();
    }

    makeMistake(row, col) {
        this.mistakes++;
        this.updateIntegrity();

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('error');
        setTimeout(() => {
            cell.classList.remove('error');
        }, 500);

        if (this.mistakes >= this.maxMistakes) {
            this.gameOver();
        }
    }

    updateIntegrity() {
        const percentage = Math.max(0, ((this.maxMistakes - this.mistakes) / this.maxMistakes * 100));
        const integrityBar = document.getElementById('integrityBar');
        const integrityText = document.getElementById('integrityText');

        integrityBar.style.width = `${percentage}%`;
        integrityText.textContent = `${Math.round(percentage)}%`;

        if (percentage <= 33) {
            integrityBar.classList.add('low');
        } else {
            integrityBar.classList.remove('low');
        }
    }

    eraseCell() {
        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        
        // Don't modify initial cells
        if (this.initialBoard[row][col] !== 0) return;

        this.board[row][col] = 0;
        this.notes[row][col].clear();
        this.renderBoard();
        this.updateHighlights();
        this.saveGame();
    }

    giveHint() {
        if (!this.selectedCell) {
            // Find first empty cell
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (this.board[row][col] === 0 && this.initialBoard[row][col] === 0) {
                        this.selectedCell = { row, col };
                        break;
                    }
                }
                if (this.selectedCell) break;
            }
        }

        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        
        // Don't give hints for initial cells
        if (this.initialBoard[row][col] !== 0) return;

        this.board[row][col] = this.solution[row][col];
        this.notes[row][col].clear();
        this.hintsUsed++;

        this.renderBoard();
        this.updateHighlights();
        this.saveGame();

        if (this.isPuzzleComplete()) {
            this.winGame();
        }
    }

    toggleNotesMode() {
        this.notesMode = !this.notesMode;
        const notesBtn = document.getElementById('notesBtn');
        notesBtn.classList.toggle('active', this.notesMode);
    }

    isPuzzleComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0 || this.board[row][col] !== this.solution[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    newGame() {
        this.stopTimer();
        this.generateSolution();
        this.createPuzzle(this.difficulty);
        this.notes = Array(9).fill().map(() => Array(9).fill().map(() => new Set()));
        this.selectedCell = null;
        this.mistakes = 0;
        this.hintsUsed = 0;
        this.notesMode = false;
        
        document.getElementById('notesBtn').classList.remove('active');
        this.updateIntegrity();
        this.renderBoard();
        this.startTimer();
        this.saveGame();
    }

    winGame() {
        this.stopTimer();
        const modal = document.getElementById('winModal');
        const modalStats = document.getElementById('modalStats');
        
        const timeStr = this.formatTime(this.elapsedTime);
        modalStats.innerHTML = `
            <div>Time: ${timeStr}</div>
            <div>Mistakes: ${this.mistakes}</div>
            <div>Hints Used: ${this.hintsUsed}</div>
            <div>Difficulty: ${this.difficulty.toUpperCase()}</div>
        `;
        
        modal.classList.add('show');
        this.clearSavedGame();
    }

    gameOver() {
        this.stopTimer();
        alert('SYSTEM FAILURE - Integrity compromised!\nInitiating new protocol...');
        this.newGame();
    }

    // Timer functions
    startTimer() {
        this.startTime = Date.now() - (this.elapsedTime || 0);
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = this.formatTime(this.elapsedTime);
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Local storage functions
    saveGame() {
        const gameState = {
            board: this.board,
            solution: this.solution,
            initialBoard: this.initialBoard,
            notes: this.notes.map(row => row.map(cell => Array.from(cell))),
            difficulty: this.difficulty,
            mistakes: this.mistakes,
            elapsedTime: this.elapsedTime,
            hintsUsed: this.hintsUsed,
            startTime: this.startTime
        };
        localStorage.setItem('neuralDecrypterGame', JSON.stringify(gameState));
    }

    loadGame() {
        const saved = localStorage.getItem('neuralDecrypterGame');
        if (!saved) return;

        try {
            const gameState = JSON.parse(saved);
            this.board = gameState.board;
            this.solution = gameState.solution;
            this.initialBoard = gameState.initialBoard;
            this.notes = gameState.notes.map(row => row.map(cell => new Set(cell)));
            this.difficulty = gameState.difficulty;
            this.mistakes = gameState.mistakes;
            this.elapsedTime = gameState.elapsedTime || 0;
            this.hintsUsed = gameState.hintsUsed || 0;
            this.startTime = gameState.startTime;

            // Update UI
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.difficulty === this.difficulty);
            });

            this.updateIntegrity();
            this.renderBoard();
            this.startTimer();
        } catch (e) {
            console.error('Failed to load saved game:', e);
        }
    }

    clearSavedGame() {
        localStorage.removeItem('neuralDecrypterGame');
    }

    // Event listeners
    attachEventListeners() {
        // Number pad
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const num = parseInt(btn.dataset.number);
                this.placeNumber(num);
            });
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.placeNumber(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                this.eraseCell();
            } else if (e.key === 'n' || e.key === 'N') {
                this.toggleNotesMode();
            } else if (e.key === 'h' || e.key === 'H') {
                this.giveHint();
            }
        });

        // Action buttons
        document.getElementById('notesBtn').addEventListener('click', () => {
            this.toggleNotesMode();
        });

        document.getElementById('hintBtn').addEventListener('click', () => {
            this.giveHint();
        });

        document.getElementById('eraseBtn').addEventListener('click', () => {
            this.eraseCell();
        });

        document.getElementById('newGameBtn').addEventListener('click', () => {
            if (confirm('Start a new protocol? Current progress will be lost.')) {
                this.newGame();
            }
        });

        // Difficulty selector
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                if (this.difficulty !== difficulty) {
                    this.difficulty = difficulty;
                    document.querySelectorAll('.difficulty-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    btn.classList.add('active');
                    
                    if (confirm('Change difficulty level? Current progress will be lost.')) {
                        this.newGame();
                    } else {
                        // Revert difficulty change
                        this.difficulty = this.difficulty;
                        document.querySelectorAll('.difficulty-btn').forEach(b => {
                            b.classList.toggle('active', b.dataset.difficulty === this.difficulty);
                        });
                    }
                }
            });
        });

        // Modal
        document.getElementById('modalNewGame').addEventListener('click', () => {
            document.getElementById('winModal').classList.remove('show');
            this.newGame();
        });

        // Close modal on outside click
        document.getElementById('winModal').addEventListener('click', (e) => {
            if (e.target.id === 'winModal') {
                document.getElementById('winModal').classList.remove('show');
            }
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
