const upgradeDefs = [
  {
    key: 'miner',
    name: 'Auto Miner',
    baseCost: 10,
    costMultiplier: 1.15,
    apply: () => {
      state.perSecond += 1;
    }
  },
  {
    key: 'pickaxe',
    name: 'Better Pickaxe (+1 per click)',
    baseCost: 25,
    costMultiplier: 1.15,
    apply: () => {
      state.perClick += 1;
    }
  }
];

const state = {
  gold: 0,
  perClick: 1,
  perSecond: 0,
  upgrades: {}
};

function initState() {
  upgradeDefs.forEach(def => {
    state.upgrades[def.key] = {
      count: 0,
      cost: def.baseCost
    };
  });
}

function saveState() {
  localStorage.setItem('clickerState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('clickerState');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  } else {
    initState();
  }
}

function updateUI() {
  document.getElementById('gold').textContent = state.gold;
  document.getElementById('perClick').textContent = state.perClick;
  document.getElementById('perSecond').textContent = state.perSecond;

  upgradeDefs.forEach(def => {
    const upState = state.upgrades[def.key];
    const btn = document.getElementById(`buy-${def.key}`);
    btn.textContent = `${def.name} (Cost: ${upState.cost}) [${upState.count}]`;
  });
}

function setupUpgrades() {
  const container = document.getElementById('upgrades');
  upgradeDefs.forEach(def => {
    const btn = document.createElement('button');
    btn.id = `buy-${def.key}`;
    btn.className = 'upgrade-btn';
    btn.addEventListener('click', () => buyUpgrade(def));
    container.appendChild(btn);
  });
}

function buyUpgrade(def) {
  const upState = state.upgrades[def.key];
  if (state.gold >= upState.cost) {
    state.gold -= upState.cost;
    upState.count += 1;
    upState.cost = Math.floor(upState.cost * def.costMultiplier);
    def.apply();
    updateUI();
    saveState();
  }
}

document.getElementById('clickBtn').addEventListener('click', () => {
  state.gold += state.perClick;
  updateUI();
  saveState();
});

setInterval(() => {
  if (state.perSecond > 0) {
    state.gold += state.perSecond;
    updateUI();
    saveState();
  }
}, 1000);

// Initialization
loadState();
setupUpgrades();
updateUI();
