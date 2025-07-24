# 🎮 Maze Game AI Agents

> **A cutting-edge 3D maze football game powered by AI-driven mechanics and immersive gameplay**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.158.0-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

![Maze Game Banner](https://via.placeholder.com/1200x400/1a1a2e/ffffff?text=🎮+Maze+Game+AI+Agents+🚀)

## 🌟 Overview

**Maze Game AI Agents** is a revolutionary 3D maze navigation game that combines football mechanics with advanced AI-driven gameplay. Navigate through complex procedurally generated mazes, control a physics-based football, and experience next-generation gaming with cutting-edge web technologies.

### ✨ Key Highlights

- 🧠 **AI-Powered Pathfinding**: Advanced algorithms for intelligent navigation
- ⚽ **Realistic Physics**: Rapier physics engine for authentic ball mechanics  
- 🎨 **Stunning 3D Graphics**: React Three Fiber with dynamic lighting and shadows
- 🎵 **Immersive Audio**: Web Audio API with spatial sound effects
- 📱 **Cross-Platform**: Responsive design for desktop and mobile
- 🚀 **Performance Optimized**: GPU acceleration and efficient rendering

## 🎯 Features

### 🎮 Core Gameplay
- **3D Maze Navigation**: Explore complex multi-level mazes with realistic physics
- **Football Mechanics**: Advanced ball control with momentum and collision detection
- **Goal Scoring System**: Multiple scoring zones with progressive difficulty
- **AI Pathfinding**: Smart navigation assistance and obstacle avoidance
- **Multiple Levels**: 10+ handcrafted levels with increasing complexity

### ⚡ Advanced Systems
- **Power-up Collection**: 5+ unique power-ups with special abilities
- **Particle Effects**: Dynamic visual effects for interactions and scoring
- **Stamina System**: Realistic player fatigue mechanics
- **Mini-map**: Real-time navigation aid with objective markers
- **Sound Engine**: 3D positional audio with ambient soundscapes
- **State Persistence**: Save progress and player statistics

### 🎨 Visual Excellence
- **Dynamic Lighting**: Real-time shadows and environmental lighting
- **Particle Systems**: Explosions, sparks, and collection effects
- **Smooth Animations**: Framer Motion for fluid UI transitions
- **Responsive UI**: Adaptive interface for all screen sizes
- **Loading Screens**: Engaging loading experiences with progress indicators

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (or **yarn** 1.22.0+)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rakesh-ai-ds/Maze_Game_AI_Agents.git
   cd Maze_Game_AI_Agents
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   > 💡 **VS Code Users**: Open the project in VS Code, then run `npm run dev` in the integrated terminal (Ctrl + ` or Terminal → New Terminal)

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Development Workflow (VS Code)

1. **Open project in VS Code**
   ```bash
   code .
   # or open VS Code and File → Open Folder
   ```

2. **Open integrated terminal**
   - Press `Ctrl + ` (backtick)
   - Or go to Terminal → New Terminal

3. **Run development server**
   ```bash
   npm run dev
   ```
   
4. **Start coding!**
   - The server will auto-reload when you save files
   - View your changes instantly at `http://localhost:3000`
   - Use VS Code extensions for better development experience

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **TypeScript Hero** - TypeScript support
- **Tailwind CSS IntelliSense** - CSS class autocomplete
- **Auto Rename Tag** - HTML/JSX tag synchronization
- **Prettier** - Code formatting
- **ESLint** - Code linting

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Controls
| Key | Action |
|-----|--------|
| `W A S D` | Move player |
| `Mouse` | Look around (click to lock cursor) |
| `Space` | Jump over obstacles |
| `Shift` | Sprint (consumes stamina) |
| `E` | Interact with objects |
| `Esc` | Pause menu |

### Gameplay Mechanics
1. **Navigate** through the 3D maze using WASD controls
2. **Push the football** toward goal areas to score points
3. **Collect power-ups** for temporary special abilities
4. **Manage stamina** while sprinting and jumping
5. **Use the mini-map** to track your position and objectives
6. **Progress through levels** by achieving score thresholds

### Power-ups
- 🟡 **Speed Boost** - Increases movement speed by 50%
- 🔵 **Super Jump** - Enhanced jumping ability for 30 seconds
- 🟣 **Ball Magnet** - Attracts the football within 10m radius
- 🟠 **Extra Time** - Adds 60 seconds to the level timer
- 🟢 **Shield** - Temporary invincibility from obstacles

## 🏗️ Project Structure

```
maze-game-ai-agents/
├── 📁 app/                          # Next.js App Router
│   ├── layout.tsx                  # Root layout with metadata
│   ├── page.tsx                    # Main game page
│   ├── globals.css                 # Global styles and animations
│   └── api/                        # API routes
│       └── pathfinding/            # Pathfinding algorithms
├── 📁 components/                   # React components
│   ├── GameScene.tsx               # 3D scene setup and lighting
│   ├── Player.tsx                  # Player controller with physics
│   ├── Football.tsx                # Ball physics and rendering
│   ├── MazeEnvironment.tsx         # Maze generation and walls
│   ├── Goals.tsx                   # Scoring areas and goals
│   ├── PowerUps.tsx                # Power-up system
│   ├── ParticleSystem.tsx          # Visual effects engine
│   ├── GameUI.tsx                  # User interface components
│   ├── SoundManager.tsx            # Audio system management
│   ├── LevelManager.tsx            # Level progression logic
│   ├── MiniMap.tsx                 # Navigation mini-map
│   ├── PathVisualization.tsx       # AI pathfinding visualization
│   └── LoadingScreen.tsx           # Loading screens
├── 📁 hooks/                        # Custom React hooks
│   └── usePathfinding.ts           # Pathfinding hook
├── 📁 store/                        # State management
│   └── gameStore.ts                # Zustand store
├── 📁 utils/                        # Utility functions
│   └── MazeGenerator.ts            # Maze generation algorithms
├── 📁 scripts/                      # Python scripts
│   └── pathfinding.py              # Advanced pathfinding algorithms
├── 📁 public/                       # Static assets
│   └── [images, sounds, models]    # Game assets
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── next.config.mjs                 # Next.js configuration
└── README.md                       # Project documentation
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### 3D Graphics & Physics
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **React Three Drei** - Useful helpers for R3F
- **Rapier** - Physics engine for realistic simulations

### State Management & Utils
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons
- **clsx** - Conditional class names utility

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🎨 Customization

### Adding New Levels

Edit `components/LevelManager.tsx` and add new level configurations:

```typescript
const LEVELS = {
  4: {
    maze: {
      width: 20,
      height: 20,
      complexity: 0.8
    },
    goals: [
      { position: [8, 0, 8], points: 100 },
      { position: [-8, 0, -8], points: 150 }
    ],
    powerUps: [
      { type: 'speed', position: [0, 0, 5] },
      { type: 'jump', position: [5, 0, 0] }
    ],
    timeLimit: 300,
    targetScore: 500
  }
}
```

### Creating Custom Power-ups

Extend `components/PowerUps.tsx`:

```typescript
const POWER_UPS = [
  {
    id: 'teleport',
    name: 'Teleport',
    color: '#9d4edd',
    duration: 10000,
    effect: (player) => {
      // Custom teleportation logic
      player.position.set(0, 2, 0);
    }
  }
];
```

### Modifying Physics

Adjust physics parameters in respective components:

```typescript
// Player movement (components/Player.tsx)
const MOVEMENT_CONFIG = {
  speed: 5,
  jumpForce: 10,
  friction: 0.1
};

// Ball physics (components/Football.tsx)
const BALL_CONFIG = {
  mass: 1,
  restitution: 0.7,
  friction: 0.3
};
```

## 🎯 AI & Pathfinding

The game features advanced AI systems for intelligent navigation:

### Pathfinding Algorithms
- **A* Algorithm** - Optimal path finding
- **Dijkstra's Algorithm** - Shortest path calculation
- **Dynamic Obstacle Avoidance** - Real-time navigation adjustments

### AI Features
- **Smart Navigation Hints** - Subtle guidance for players
- **Adaptive Difficulty** - AI adjusts based on player performance
- **Predictive Ball Physics** - AI-assisted ball trajectory calculation

### Usage Example

```typescript
import { usePathfinding } from '@/hooks/usePathfinding';

const { findPath, visualizePath } = usePathfinding();

// Find optimal path from start to goal
const path = findPath(startPosition, goalPosition, obstacles);

// Visualize the path in 3D space
visualizePath(path);
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically with every push

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Other Platforms

The game works on any Node.js hosting platform:

- **Netlify** - Static site deployment
- **Railway** - Full-stack hosting
- **DigitalOcean App Platform** - Managed hosting
- **AWS Amplify** - Serverless deployment

## 🔧 Performance Optimization

### GPU Acceleration
- Utilizes WebGL for hardware-accelerated rendering
- Efficient shader usage for materials and lighting
- Optimized geometry for better frame rates

### Memory Management
- Automatic disposal of 3D objects
- Efficient texture loading and caching
- Optimized particle system with object pooling

### Network Optimization
- Code splitting with Next.js
- Lazy loading of 3D models and textures
- Progressive enhancement for mobile devices

## 🐛 Troubleshooting

### Common Issues

**🔇 Audio not working**
- Ensure user interaction before audio starts
- Check browser audio permissions
- Try different browser or incognito mode

**🐌 Performance issues**
```typescript
// Reduce particle count in ParticleSystem.tsx
const MAX_PARTICLES = 50; // Reduce from default 200

// Lower shadow quality in GameScene.tsx
<directionalLight castShadow shadow-mapSize={[512, 512]} />
```

**⚡ Physics glitches**
- Verify Rapier physics version compatibility
- Check collision shapes match visual geometry
- Ensure proper cleanup of physics bodies

**📱 Mobile compatibility**
- Enable touch controls in mobile browsers
- Adjust UI scaling for smaller screens
- Test performance on target devices

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Ensure code passes ESLint checks
- Test on multiple browsers and devices

### Areas for Contribution
- 🎨 New level designs and maze layouts
- 🎵 Additional sound effects and music
- ⚡ New power-ups and game mechanics
- 🤖 Enhanced AI pathfinding algorithms
- 📱 Mobile controls and optimization
- 🌐 Multiplayer functionality
- 🎯 Achievement system

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Rakesh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **Three.js Community** - Amazing 3D graphics library
- **React Three Fiber** - Seamless React integration
- **Rapier Physics** - Realistic physics simulation
- **Next.js Team** - Excellent React framework
- **Open Source Community** - Inspiration and resources

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/Rakesh-ai-ds/Maze_Game_AI_Agents/issues)
- **Discussions**: [Community discussions and Q&A](https://github.com/Rakesh-ai-ds/Maze_Game_AI_Agents/discussions)
- **Email**: [Contact the developer](mailto:rakeshrevathi2006@gmail.com)

---

<div align="center">

### 🎮 Ready to Play?

**[🚀 Try the Live Demo](https://maze-game-ai-agents.vercel.app)** | **[📖 Documentation](https://github.com/Rakesh-ai-ds/Maze_Game_AI_Agents/wiki)** | **[🐛 Report Issues](https://github.com/Rakesh-ai-ds/Maze_Game_AI_Agents/issues)**

Made with ❤️ by [Rakesh](https://github.com/Rakesh-ai-ds)

⭐ **Star this repository if you found it helpful!** ⭐

</div>
