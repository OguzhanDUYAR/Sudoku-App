# Neural Decrypter | Sudoku

A modern, cyberpunk-themed web-based Sudoku game with a "SysAdmin / Hacker" aesthetic. Test your decryption skills while maintaining system integrity!

![Neural Decrypter](https://img.shields.io/badge/Status-Online-00ff00?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0-38bdf8?style=for-the-badge)

## 🎮 Features

### Core Gameplay
- **Intelligent Puzzle Generation**: Uses backtracking algorithm to generate valid Sudoku puzzles with unique solutions
- **Three Difficulty Levels**: 
  - Easy (35 removed cells)
  - Medium (45 removed cells)
  - Hard (55 removed cells)
- **System Integrity Mechanic**: Progress bar starting at 100% that decreases with wrong inputs instead of traditional lives
- **Timer**: Digital clock counting up to track your solving speed
- **Auto-Save**: LocalStorage integration automatically saves your progress

### Controls
- **On-Screen Numpad**: Click numbers 1-9 to input values
- **Note Mode**: Toggle pencil marks for candidate tracking
- **Hint System**: Get help when stuck (with integrity penalty)
- **Delete**: Remove numbers from cells
- **Keyboard Support**: 
  - Numbers 1-9 for input
  - Backspace/Delete to clear cells
  - 'N' key to toggle note mode

### User Experience
- **Smart Highlighting**: 
  - Selected cell with distinct color
  - Highlights entire row, column, and 3x3 box
  - Highlights all instances of the selected number
- **Visual Feedback**: 
  - Green color for correct numbers
  - Red color for incorrect numbers
  - Gray for initial puzzle numbers
- **Particle Network Background**: Animated cyberpunk-style network effect
- **Completion Modal**: Displays stats when puzzle is solved

## 🎨 Design

### Theme
- **Aesthetic**: SysAdmin / Hacker / Cyberpunk
- **Color Palette**:
  - Background: Dark Navy (#020617)
  - Accent: Neon Cyan (#38bdf8)
  - Text: White with gray variants
- **Typography**: JetBrains Mono (monospaced font for terminal feel)
- **Layout**: Fully responsive design optimized for desktop, tablet, and mobile

### Visual Effects
- Particle network animation background
- Glowing neon accents
- Smooth transitions and hover effects
- Modal animations

## 🛠️ Tech Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS variables, Grid, and Flexbox
- **Vanilla JavaScript (ES6+)**: 
  - Object-oriented programming
  - ES6 classes
  - LocalStorage API
  - Canvas API for particles

## 📁 File Structure

```
Sudoku-App/
├── index.html              # Main HTML structure
├── assets/
│   ├── css/
│   │   └── style.css      # Cyberpunk styling with CSS variables
│   └── js/
│       └── sudoku.js      # Game engine and logic
├── README.md              # Project documentation
└── LICENSE                # MIT License
```

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OguzhanDUYAR/Sudoku-App.git
cd Sudoku-App
```

2. Open `index.html` in your web browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Or simply open the file
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

3. Navigate to `http://localhost:8000` if using a server

### No Build Process Required
This is a pure frontend application with no dependencies or build steps. Simply open the HTML file in any modern browser!

## 🎯 How to Play

1. **Start a New Game**: Click "NEW GAME" and select your difficulty level
2. **Select a Cell**: Click on any empty cell in the grid
3. **Input Numbers**: 
   - Use the on-screen numpad or keyboard (1-9)
   - Numbers appear in white if they're correct
   - Wrong numbers appear in red and decrease system integrity
4. **Use Notes**: 
   - Click "NOTE" or press 'N' to toggle note mode
   - Add multiple candidate numbers to cells
5. **Get Hints**: 
   - Click "HINT" to reveal the correct number for the selected cell
   - Note: Using hints decreases integrity by 5%
6. **Delete**: Remove numbers from cells using the "DELETE" button or Backspace key
7. **Reset**: Restore the puzzle to its initial state
8. **Complete**: Fill all cells correctly to decrypt the system!

## 🧩 Game Mechanics

### System Integrity
- Starts at 100%
- Decreases by 2% for each wrong number
- Decreases by 5% when using hints
- Game resets if integrity reaches 0%
- Visual feedback through color-coded progress bar

### Highlighting System
- **Selected Cell**: Blue highlight
- **Related Cells**: Light cyan background (same row, column, 3x3 box)
- **Same Numbers**: Slightly brighter cyan for all cells with matching numbers

### Validation
- Real-time validation checks each input
- Follows standard Sudoku rules:
  - No duplicates in rows
  - No duplicates in columns
  - No duplicates in 3x3 boxes

## 💾 Save System

The game automatically saves your progress to LocalStorage including:
- Current grid state
- Solution
- Notes
- Timer
- System integrity
- Selected difficulty

Your game will automatically resume when you reload the page!

## 🌐 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

Requires a modern browser with ES6+ support.

## 📱 Responsive Design

The game adapts seamlessly to different screen sizes:
- **Desktop**: Side-by-side layout with control panel
- **Tablet**: Optimized grid and control sizes
- **Mobile**: Stacked layout with touch-friendly controls

## 🎨 Customization

The application uses CSS variables for easy theming. Edit the `:root` section in `style.css`:

```css
:root {
    --bg-dark: #020617;
    --neon-cyan: #38bdf8;
    --text-white: #ffffff;
    /* ... more variables */
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Oguzhan DUYAR**

## 🙏 Acknowledgments

- Font: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) by JetBrains
- Inspired by cyberpunk aesthetics and hacker culture
- Built with modern web technologies

---

**// SYSTEM STATUS: ONLINE**
**// NEURAL NETWORK v1.0**
**// ACCESS GRANTED**
