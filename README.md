# Tic Tac Tricked Out - A Retro React 3D Tic Tac Toe

A retro Tic Tac Toe game built with **React** and enhanced with a fully interactive **3D board** using Three.js. Switch between 2D and 3D experiences with smooth transitions, glass-morphism UI, and animated score tracking.

## ✨ Features

- Classic Tic Tac Toe gameplay with (somewhat) polished visuals
- AI opponent with three difficulty levels (Easy, Medium, Hard)
- Toggle between 2D and 3D game modes
- Interactive 3D view with full rotation controls
- Animated effects and transitions
- Responsive design for all devices
- Score tracking with local storage
- Toggle between dark and light modes

## Live Link
[Tic Tac Tricked Retro Out](https://ornate-praline-606cfd.netlify.app/)

## Tech Stack

- React for the UI components
- Three.js via @react-three/fiber for 3D rendering
- Framer Motion for animations
- CSS with glass-morphism effects
- Vite as the build tool

## Getting Started

### Prerequisites

- Node.js ≥ 14
- npm ≥ 6

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/leverh/tic-tac-toe-react
   cd react-3d-tic-tac-toe
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open in browser
   ```
   http://localhost:5173
   ```

## AI Opponent

The game features an intelligent AI opponent with three difficulty settings:

- **Easy**: Makes random moves for casual play
- **Medium**: Balances between random and strategic moves
- **Hard**: Uses strategic logic to find winning moves or block player wins

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Create production build
- `npm run preview` – Preview production build locally

## Project Structure

```
src/
├── components/
│   ├── Board.jsx          # 2D game board
│   ├── ThreeDScene.jsx    # 3D game visualization
│   ├── GameInfo.jsx       # Status and controls
│   └── ...
├── styles/
│   └── index.css          # Styling
├── App.jsx                # Main application
└── main.jsx               # Entry point
```

## Credits

- 3D rendering powered by @react-three/fiber & drei
- Fonts: Montserrat & Inter from Google Fonts

## License

MIT — Free to use, modify, and share - I don't care!

---

Made by [PixelSummit](https://pixelsummit.dev/)