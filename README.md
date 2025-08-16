# 🎮 Clicker Game

A modern, offline-capable incremental/clicker game built with vanilla HTML, CSS, and JavaScript. No backend required - runs entirely in the browser with local storage for game persistence.

## ✨ Features

- **🖱️ Core Clicker Mechanics**: Click to earn coins with satisfying animations
- **🔧 Upgrade System**: Improve your clicking power with various upgrades
- **🤖 Auto-Clickers**: Automated bots that click for you
- **🏆 Achievement System**: Unlock achievements for reaching milestones
- **💾 Auto-Save**: Automatic saving every 30 seconds + manual save
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Dark theme with smooth animations and effects
- **⚡ Offline Ready**: No internet connection required after initial load

## 🚀 Quick Start

1. **Download**: Clone or download the repository
2. **Run**: Open `index.html` in any modern web browser
3. **Play**: Start clicking and building your empire!

### File Structure
```
clicker-gra/
├── index.html      # Main HTML structure
├── styles.css      # Modern CSS with animations
├── game.js         # Core game logic
├── README.md       # This file
└── LICENSE         # MIT License
```

## 🎯 Game Mechanics

### Core Gameplay
- **Click** the main button to earn coins
- **Buy upgrades** to increase coins per click
- **Purchase auto-clickers** to generate passive income
- **Unlock achievements** by reaching various milestones
- **Save/Load** your progress automatically

### Upgrades Available
- **💪 Strong Fingers**: Double your clicking power (Max level: 5)
- **🚀 Turbo Click**: +5 coins per click (Max level: 10)
- **⚡ Efficiency**: 10% more coins from all sources (Max level: 20)
- **💎 Gold Rush**: 50% chance for double coins on click (Max level: 1)

### Auto-Clickers
- **🤖 Basic Bot**: 1 click per second
- **⚡ Speed Bot**: 5 clicks per second  
- **💥 Mega Bot**: 20 clicks per second
- **🔥 Ultra Bot**: 100 clicks per second

### Achievements
- **👆 First Click**: Click for the first time
- **💯 100 Clicks**: Click 100 times
- **🏆 1K Clicks**: Click 1000 times
- **💰 Rich**: Earn 1000 coins
- **💎 Very Rich**: Earn 10000 coins
- **🔧 Upgrader**: Buy your first upgrade
- **🤖 Automated**: Buy your first auto-clicker
- **⏰ Dedicated**: Play for 1 hour
- **🏰 Millionaire**: Have 1 million coins

## 🛠️ Development & Modification

The game is designed with a modular architecture for easy modification and extension:

### Game Structure
```javascript
class ClickerGame {
    // Core game state management
    // Upgrade system
    // Auto-clicker system  
    // Achievement system
    // Save/Load functionality
    // UI management
}
```

### Adding New Upgrades
```javascript
// In initializeUpgrades() method
{
    id: 'newUpgrade',
    name: '🎯 Your Upgrade',
    description: 'Your upgrade description',
    baseCost: 100,
    multiplier: 2,
    clickMultiplier: 1.5, // Multiplies click value
    clickBonus: 10,       // Adds flat bonus to clicks
    globalMultiplier: 1.1, // Multiplies all income
    maxLevel: 5
}
```

### Adding New Auto-Clickers
```javascript
// In initializeAutoClickers() method
{
    id: 'newClicker',
    name: '🎯 Your Bot',
    description: 'Your bot description',
    baseCost: 1000,
    multiplier: 2,
    clicksPerSecond: 10,
    icon: '🎯'
}
```

### Adding New Achievements
```javascript
// In initializeAchievements() method
{
    id: 'newAchievement',
    name: 'Achievement Name',
    description: 'Achievement description',
    icon: '🎯',
    requirement: () => /* your condition */
}
```

### Customizing Appearance
- **Colors**: Modify CSS variables in `:root` selector in `styles.css`
- **Animations**: Adjust keyframes and transitions in `styles.css`
- **Layout**: Modify the flexbox layout in the main CSS classes

## 🎨 Customization Ideas

- **Themes**: Create different color schemes
- **New Mechanics**: Add prestige system, different currencies, or mini-games
- **Sound Effects**: Add audio feedback for clicks and purchases
- **Particles**: Enhanced visual effects for clicks and achievements
- **Statistics**: Detailed stats tracking and analysis
- **Import/Export**: Save sharing between devices

## 📱 Browser Support

- **Chrome**: 60+ ✅
- **Firefox**: 60+ ✅  
- **Safari**: 12+ ✅
- **Edge**: 79+ ✅

## 🔧 Technical Details

- **No Dependencies**: Pure vanilla JavaScript
- **Local Storage**: Automatic save/load functionality
- **Responsive**: CSS Flexbox and Grid layouts
- **Performance**: 60 FPS animations with efficient DOM updates
- **Accessibility**: Semantic HTML and keyboard navigation support

## 📄 License

MIT License - feel free to modify and distribute!

## 🤝 Contributing

This game is designed to be easily modifiable. Some ideas for contributions:

1. **New Game Features**: Additional upgrade types, mechanics, or systems
2. **UI Improvements**: Better animations, responsive design enhancements
3. **Performance**: Code optimizations and better state management
4. **Accessibility**: Enhanced keyboard navigation and screen reader support

## 🎮 Play Now!

Simply open `index.html` in your browser and start clicking your way to fortune!

---

*Built with ❤️ for the incremental gaming community*