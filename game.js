// Clicker Game - Modular Architecture
// Main game class that handles all game logic and state

class ClickerGame {
    constructor() {
        this.gameState = {
            coins: 0,
            coinsPerClick: 1,
            coinsPerSecond: 0,
            totalClicks: 0,
            totalCoinsEarned: 0,
            gameStartTime: Date.now(),
            playTime: 0
        };

        this.upgrades = new Map();
        this.autoClickers = new Map();
        this.achievements = new Map();
        
        this.saveKey = 'clickerGameSave';
        this.autoSaveInterval = null;
        this.gameLoopInterval = null;
        
        this.initializeUpgrades();
        this.initializeAutoClickers();
        this.initializeAchievements();
        this.initializeEventListeners();
        this.loadGame();
        this.startGameLoop();
        this.startAutoSave();
        this.updateUI();
    }

    // Initialize all available upgrades
    initializeUpgrades() {
        const upgradeConfigs = [
            {
                id: 'clickPower1',
                name: '💪 Strong Fingers',
                description: 'Double your clicking power',
                baseCost: 10,
                multiplier: 2,
                clickMultiplier: 2,
                maxLevel: 5
            },
            {
                id: 'clickPower2',
                name: '🚀 Turbo Click',
                description: '+5 coins per click',
                baseCost: 100,
                multiplier: 3,
                clickBonus: 5,
                maxLevel: 10
            },
            {
                id: 'efficiency1',
                name: '⚡ Efficiency',
                description: '10% more coins from all sources',
                baseCost: 500,
                multiplier: 2.5,
                globalMultiplier: 1.1,
                maxLevel: 20
            },
            {
                id: 'goldRush',
                name: '💎 Gold Rush',
                description: '50% chance for double coins on click',
                baseCost: 1000,
                multiplier: 4,
                doubleChance: 0.5,
                maxLevel: 1
            }
        ];

        upgradeConfigs.forEach(config => {
            this.upgrades.set(config.id, {
                ...config,
                level: 0,
                purchased: false
            });
        });
    }

    // Initialize auto-clicker configurations
    initializeAutoClickers() {
        const autoClickerConfigs = [
            {
                id: 'basicClicker',
                name: '🤖 Basic Bot',
                description: 'Clicks 1 time per second',
                baseCost: 50,
                multiplier: 1.5,
                clicksPerSecond: 1,
                icon: '🤖'
            },
            {
                id: 'fastClicker',
                name: '⚡ Speed Bot',
                description: 'Clicks 5 times per second',
                baseCost: 500,
                multiplier: 2,
                clicksPerSecond: 5,
                icon: '⚡'
            },
            {
                id: 'megaClicker',
                name: '💥 Mega Bot',
                description: 'Clicks 20 times per second',
                baseCost: 5000,
                multiplier: 2.5,
                clicksPerSecond: 20,
                icon: '💥'
            },
            {
                id: 'ultraClicker',
                name: '🔥 Ultra Bot',
                description: 'Clicks 100 times per second',
                baseCost: 50000,
                multiplier: 3,
                clicksPerSecond: 100,
                icon: '🔥'
            }
        ];

        autoClickerConfigs.forEach(config => {
            this.autoClickers.set(config.id, {
                ...config,
                count: 0,
                totalPurchased: 0
            });
        });
    }

    // Initialize achievement system
    initializeAchievements() {
        const achievementConfigs = [
            { id: 'firstClick', name: 'First Click', description: 'Click the button for the first time', icon: '👆', requirement: () => this.gameState.totalClicks >= 1 },
            { id: 'clicks100', name: '100 Clicks', description: 'Click 100 times', icon: '💯', requirement: () => this.gameState.totalClicks >= 100 },
            { id: 'clicks1000', name: '1K Clicks', description: 'Click 1000 times', icon: '🏆', requirement: () => this.gameState.totalClicks >= 1000 },
            { id: 'coins1000', name: 'Rich', description: 'Earn 1000 coins', icon: '💰', requirement: () => this.gameState.totalCoinsEarned >= 1000 },
            { id: 'coins10000', name: 'Very Rich', description: 'Earn 10000 coins', icon: '💎', requirement: () => this.gameState.totalCoinsEarned >= 10000 },
            { id: 'firstUpgrade', name: 'Upgrader', description: 'Buy your first upgrade', icon: '🔧', requirement: () => Array.from(this.upgrades.values()).some(u => u.level > 0) },
            { id: 'firstBot', name: 'Automated', description: 'Buy your first auto-clicker', icon: '🤖', requirement: () => Array.from(this.autoClickers.values()).some(a => a.count > 0) },
            { id: 'playTime1h', name: 'Dedicated', description: 'Play for 1 hour', icon: '⏰', requirement: () => this.gameState.playTime >= 3600000 },
            { id: 'millionaire', name: 'Millionaire', description: 'Have 1 million coins', icon: '🏰', requirement: () => this.gameState.coins >= 1000000 }
        ];

        achievementConfigs.forEach(config => {
            this.achievements.set(config.id, {
                ...config,
                unlocked: false,
                unlockedAt: null
            });
        });
    }

    // Set up event listeners
    initializeEventListeners() {
        // Click button
        document.getElementById('clickButton').addEventListener('click', () => this.handleClick());
        
        // Save/Reset buttons
        document.getElementById('saveGame').addEventListener('click', () => this.saveGame());
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());

        // Auto-save on page unload
        window.addEventListener('beforeunload', () => this.saveGame());
    }

    // Handle click button press
    handleClick() {
        let coinsToAdd = this.gameState.coinsPerClick;
        
        // Apply upgrade multipliers
        this.upgrades.forEach(upgrade => {
            if (upgrade.level > 0) {
                if (upgrade.clickMultiplier) {
                    coinsToAdd *= Math.pow(upgrade.clickMultiplier, upgrade.level);
                }
                if (upgrade.clickBonus) {
                    coinsToAdd += upgrade.clickBonus * upgrade.level;
                }
                if (upgrade.globalMultiplier) {
                    coinsToAdd *= Math.pow(upgrade.globalMultiplier, upgrade.level);
                }
            }
        });

        // Check for double chance
        const goldRush = this.upgrades.get('goldRush');
        if (goldRush && goldRush.level > 0 && Math.random() < goldRush.doubleChance) {
            coinsToAdd *= 2;
            this.showFloatingNumber(`+${this.formatNumber(coinsToAdd)} 💎`, 'gold');
        } else {
            this.showFloatingNumber(`+${this.formatNumber(coinsToAdd)}`);
        }

        this.gameState.coins += coinsToAdd;
        this.gameState.totalClicks++;
        this.gameState.totalCoinsEarned += coinsToAdd;

        // Add click animation
        this.animateClick();
        this.updateUI();
        this.checkAchievements();
    }

    // Purchase upgrade
    purchaseUpgrade(upgradeId) {
        const upgrade = this.upgrades.get(upgradeId);
        if (!upgrade) return false;

        const cost = this.calculateUpgradeCost(upgrade);
        
        if (this.gameState.coins >= cost && upgrade.level < upgrade.maxLevel) {
            this.gameState.coins -= cost;
            upgrade.level++;
            
            this.updateUI();
            this.checkAchievements();
            return true;
        }
        return false;
    }

    // Purchase auto-clicker
    purchaseAutoClicker(clickerId) {
        const clicker = this.autoClickers.get(clickerId);
        if (!clicker) return false;

        const cost = this.calculateAutoClickerCost(clicker);
        
        if (this.gameState.coins >= cost) {
            this.gameState.coins -= cost;
            clicker.count++;
            clicker.totalPurchased++;
            
            this.updateCoinsPerSecond();
            this.updateUI();
            this.checkAchievements();
            return true;
        }
        return false;
    }

    // Calculate upgrade cost
    calculateUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.level));
    }

    // Calculate auto-clicker cost
    calculateAutoClickerCost(clicker) {
        return Math.floor(clicker.baseCost * Math.pow(clicker.multiplier, clicker.count));
    }

    // Update coins per second calculation
    updateCoinsPerSecond() {
        let totalCPS = 0;
        let baseClickValue = this.gameState.coinsPerClick;

        // Apply upgrade multipliers to base click value
        this.upgrades.forEach(upgrade => {
            if (upgrade.level > 0) {
                if (upgrade.clickMultiplier) {
                    baseClickValue *= Math.pow(upgrade.clickMultiplier, upgrade.level);
                }
                if (upgrade.clickBonus) {
                    baseClickValue += upgrade.clickBonus * upgrade.level;
                }
                if (upgrade.globalMultiplier) {
                    baseClickValue *= Math.pow(upgrade.globalMultiplier, upgrade.level);
                }
            }
        });

        // Calculate total from auto-clickers
        this.autoClickers.forEach(clicker => {
            if (clicker.count > 0) {
                totalCPS += clicker.clicksPerSecond * clicker.count * baseClickValue;
            }
        });

        this.gameState.coinsPerSecond = totalCPS;
    }

    // Main game loop
    startGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            // Update play time
            this.gameState.playTime = Date.now() - this.gameState.gameStartTime;
            
            // Process auto-clickers
            if (this.gameState.coinsPerSecond > 0) {
                const coinsToAdd = this.gameState.coinsPerSecond / 10; // 10 updates per second
                this.gameState.coins += coinsToAdd;
                this.gameState.totalCoinsEarned += coinsToAdd;
                this.updateUI();
            }
            
            this.checkAchievements();
        }, 100); // 10 FPS for smooth updates
    }

    // Auto-save functionality
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveGame();
        }, 30000); // Save every 30 seconds
    }

    // Check and unlock achievements
    checkAchievements() {
        this.achievements.forEach((achievement, id) => {
            if (!achievement.unlocked && achievement.requirement()) {
                achievement.unlocked = true;
                achievement.unlockedAt = Date.now();
                this.showAchievementNotification(achievement);
            }
        });
    }

    // Show achievement notification
    showAchievementNotification(achievement) {
        // Create achievement popup
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                animation: slideIn 0.5s ease-out, fadeOut 0.5s ease-in 3s forwards;
            }
            .achievement-popup {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 300px;
            }
            .achievement-popup .achievement-icon {
                font-size: 2rem;
            }
            .achievement-title {
                font-weight: bold;
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }
            .achievement-name {
                font-weight: bold;
                margin-bottom: 0.25rem;
            }
            .achievement-desc {
                font-size: 0.875rem;
                opacity: 0.9;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 4000);
    }

    // Show floating numbers on click
    showFloatingNumber(text, type = 'normal') {
        const clickButton = document.getElementById('clickButton');
        const rect = clickButton.getBoundingClientRect();
        
        const floatingNum = document.createElement('div');
        floatingNum.className = `floating-number ${type}`;
        floatingNum.textContent = text;
        
        // Random position around the button
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 50;
        
        floatingNum.style.left = `${rect.left + rect.width/2 + randomX}px`;
        floatingNum.style.top = `${rect.top + rect.height/2 + randomY}px`;
        
        document.body.appendChild(floatingNum);
        
        setTimeout(() => {
            if (document.body.contains(floatingNum)) {
                document.body.removeChild(floatingNum);
            }
        }, 1500);
    }

    // Animate click button
    animateClick() {
        const button = document.getElementById('clickButton');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    // Update all UI elements
    updateUI() {
        // Update stats
        document.getElementById('coins').textContent = this.formatNumber(this.gameState.coins);
        document.getElementById('coinsPerSecond').textContent = this.formatNumber(this.gameState.coinsPerSecond);
        document.getElementById('coinsPerClick').textContent = this.formatNumber(this.calculateEffectiveClickValue());
        
        // Update upgrades
        this.updateUpgradesUI();
        
        // Update auto-clickers
        this.updateAutoClickersUI();
        
        // Update achievements
        this.updateAchievementsUI();
    }

    // Calculate effective click value with all bonuses
    calculateEffectiveClickValue() {
        let clickValue = this.gameState.coinsPerClick;
        
        this.upgrades.forEach(upgrade => {
            if (upgrade.level > 0) {
                if (upgrade.clickMultiplier) {
                    clickValue *= Math.pow(upgrade.clickMultiplier, upgrade.level);
                }
                if (upgrade.clickBonus) {
                    clickValue += upgrade.clickBonus * upgrade.level;
                }
                if (upgrade.globalMultiplier) {
                    clickValue *= Math.pow(upgrade.globalMultiplier, upgrade.level);
                }
            }
        });
        
        return clickValue;
    }

    // Update upgrades UI
    updateUpgradesUI() {
        const upgradesContainer = document.getElementById('upgrades');
        upgradesContainer.innerHTML = '';
        
        this.upgrades.forEach((upgrade, id) => {
            const cost = this.calculateUpgradeCost(upgrade);
            const canAfford = this.gameState.coins >= cost;
            const maxedOut = upgrade.level >= upgrade.maxLevel;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-item ${!canAfford || maxedOut ? 'disabled' : ''}`;
            upgradeElement.innerHTML = `
                <div class="upgrade-info">
                    <div class="upgrade-name">${upgrade.name} ${upgrade.level > 0 ? `(${upgrade.level}/${upgrade.maxLevel})` : ''}</div>
                    <div class="upgrade-description">${upgrade.description}</div>
                </div>
                <div class="upgrade-cost">${maxedOut ? 'MAX' : this.formatNumber(cost)}</div>
            `;
            
            if (canAfford && !maxedOut) {
                upgradeElement.addEventListener('click', () => this.purchaseUpgrade(id));
            }
            
            upgradesContainer.appendChild(upgradeElement);
        });
    }

    // Update auto-clickers UI
    updateAutoClickersUI() {
        const autoClickersContainer = document.getElementById('autoClickers');
        autoClickersContainer.innerHTML = '';
        
        this.autoClickers.forEach((clicker, id) => {
            const cost = this.calculateAutoClickerCost(clicker);
            const canAfford = this.gameState.coins >= cost;
            
            const clickerElement = document.createElement('div');
            clickerElement.className = `auto-clicker-item ${!canAfford ? 'disabled' : ''}`;
            clickerElement.innerHTML = `
                <div class="auto-clicker-info">
                    <div class="auto-clicker-name">${clicker.icon} ${clicker.name}</div>
                    <div class="auto-clicker-description">${clicker.description}</div>
                </div>
                <div>
                    ${clicker.count > 0 ? `<span class="auto-clicker-count">${clicker.count}</span>` : ''}
                    <div class="auto-clicker-cost">${this.formatNumber(cost)}</div>
                </div>
            `;
            
            if (canAfford) {
                clickerElement.addEventListener('click', () => this.purchaseAutoClicker(id));
            }
            
            autoClickersContainer.appendChild(clickerElement);
        });
    }

    // Update achievements UI
    updateAchievementsUI() {
        const achievementsContainer = document.getElementById('achievements');
        achievementsContainer.innerHTML = '';
        
        this.achievements.forEach((achievement, id) => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementElement.title = achievement.description;
            achievementElement.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-name">${achievement.name}</div>
            `;
            
            achievementsContainer.appendChild(achievementElement);
        });
    }

    // Format numbers for display
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    }

    // Save game to localStorage
    saveGame() {
        const saveData = {
            gameState: this.gameState,
            upgrades: Array.from(this.upgrades.entries()),
            autoClickers: Array.from(this.autoClickers.entries()),
            achievements: Array.from(this.achievements.entries()),
            savedAt: Date.now()
        };
        
        localStorage.setItem(this.saveKey, JSON.stringify(saveData));
        console.log('Game saved successfully');
    }

    // Load game from localStorage
    loadGame() {
        const saveData = localStorage.getItem(this.saveKey);
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                
                // Load game state
                this.gameState = { ...this.gameState, ...data.gameState };
                
                // Load upgrades
                if (data.upgrades) {
                    data.upgrades.forEach(([id, upgrade]) => {
                        if (this.upgrades.has(id)) {
                            this.upgrades.set(id, { ...this.upgrades.get(id), ...upgrade });
                        }
                    });
                }
                
                // Load auto-clickers
                if (data.autoClickers) {
                    data.autoClickers.forEach(([id, clicker]) => {
                        if (this.autoClickers.has(id)) {
                            this.autoClickers.set(id, { ...this.autoClickers.get(id), ...clicker });
                        }
                    });
                }
                
                // Load achievements
                if (data.achievements) {
                    data.achievements.forEach(([id, achievement]) => {
                        if (this.achievements.has(id)) {
                            this.achievements.set(id, { ...this.achievements.get(id), ...achievement });
                        }
                    });
                }
                
                // Adjust game start time to account for offline time
                const timePlayed = data.gameState.playTime || 0;
                this.gameState.gameStartTime = Date.now() - timePlayed;
                
                this.updateCoinsPerSecond();
                console.log('Game loaded successfully');
            } catch (error) {
                console.error('Failed to load game:', error);
            }
        }
    }

    // Reset game
    resetGame() {
        if (confirm('Are you sure you want to reset your game? This action cannot be undone.')) {
            localStorage.removeItem(this.saveKey);
            location.reload();
        }
    }

    // Clean up intervals
    destroy() {
        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.clickerGame = new ClickerGame();
    console.log('Clicker Game initialized successfully!');
});