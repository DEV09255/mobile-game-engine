const unitTiers = [
  { id: 1, name: 'Scout', icon: 'S', power: 12 },
  { id: 2, name: 'Ranger', icon: 'R', power: 18 },
  { id: 3, name: 'Guardian', icon: 'G', power: 28 },
  { id: 4, name: 'Sentinel', icon: 'V', power: 42 },
  { id: 5, name: 'Warden', icon: 'W', power: 64 },
  { id: 6, name: 'Titan', icon: 'T', power: 96 }
];

const gemOffers = [
  { id: 'starter', name: 'Starter Bundle', price: 299, gems: 500, bonus: '50k Coins', tag: 'new-player' },
  { id: 'hero', name: 'Hero Pack', price: 639, gems: 1200, bonus: 'Rare skin', tag: 'featured' },
  { id: 'founder', name: 'Founder Pack', price: 1499, gems: 3000, bonus: 'Legendary title', tag: 'elite' },
  { id: 'casual', name: 'Casual Path', price: 399, gems: 800, bonus: 'Cosmetic bundle', tag: 'bundle' },
  { id: 'engaged', name: 'Engaged Path', price: 2499, gems: 5000, bonus: 'Arena theme', tag: 'bundle' },
  { id: 'whale', name: 'Whale Path', price: 5999, gems: 12000, bonus: 'Legendary badge', tag: 'vip' }
];

const premiumOffers = [
  { id: 'pass', name: 'Premium Pass', price: 599, perks: '200 Gems + cosmetics', tag: 'battle-pass' },
  { id: 'daily', name: 'Daily Deal', price: 499, perks: 'Bonus 20% + coins', tag: 'deal' }
];

const state = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  coins: 2500,
  gems: 25,
  dailyStreak: 1,
  inventory: {
    1: 2,
    2: 1,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  },
  enemyIndex: 0,
  enemyPower: 12,
  enemyHP: 80,
  battleLog: [],
  passOwned: false,
  freeGemRewards: {
    10: 10,
    25: 15,
    50: 100,
    100: 300,
    1000: 2000,
    paidLevels: [200, 300, 400, 500, 600, 700, 800, 900]
  }
};

const inventoryList = document.getElementById('inventoryList');
const coinsValue = document.getElementById('coinsValue');
const gemsValue = document.getElementById('gemsValue');
const xpValue = document.getElementById('xpValue');
const levelValue = document.getElementById('levelValue');
const logList = document.getElementById('logList');
const enemyName = document.getElementById('enemyName');
const enemyStats = document.getElementById('enemyStats');
const enemyHpBar = document.getElementById('enemyHpBar');
const streakPill = document.getElementById('streakPill');

function addLog(msg) {
  state.battleLog.unshift(msg);
  state.battleLog = state.battleLog.slice(0, 7);
  renderLog();
}

function renderLog() {
  logList.innerHTML = '';
  state.battleLog.forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry;
    logList.appendChild(item);
  });
}

function getEnemy() {
  const enemies = [
    { name: 'Drone Scout', hp: 80, power: 12 },
    { name: 'Shadow Runner', hp: 120, power: 18 },
    { name: 'Fortress Tank', hp: 180, power: 24 },
    { name: 'Sky Warden', hp: 260, power: 34 },
    { name: 'Void Titan', hp: 340, power: 46 },
    { name: 'Apex Commander', hp: 420, power: 62 }
  ];

  const data = enemies[state.enemyIndex % enemies.length];
  state.enemyIndex += 1;
  state.enemyHP = data.hp;
  state.enemyPower = data.power;
  enemyName.textContent = data.name;
  enemyStats.textContent = `HP: ${data.hp} | Power: ${data.power}`;
  enemyHpBar.style.width = '100%';
}

function renderInventory() {
  inventoryList.innerHTML = '';

  unitTiers.forEach((tier) => {
    const count = state.inventory[tier.id] || 0;
    const entry = document.createElement('div');
    entry.className = 'unit-entry';
    entry.innerHTML = `
      <div class="unit-left">
        <span class="unit-name">${tier.name}</span>
        <span class="unit-tier">Tier ${tier.id}</span>
      </div>
      <span class="unit-count">${count}</span>
    `;
    inventoryList.appendChild(entry);
  });
}

function renderStats() {
  coinsValue.textContent = state.coins.toLocaleString('en-IN');
  gemsValue.textContent = state.gems;
  xpValue.textContent = `${state.xp} / ${state.xpToNext}`;
  levelValue.textContent = state.level;
  streakPill.textContent = `Streak x${state.dailyStreak}`;
}

function addXp(amount) {
  state.xp += amount;

  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = Math.round(state.xpToNext * 1.2);

    if (state.level === 50) {
      state.gems += 100;
      addLog('Level 50 reward: +100 Gems');
    }

    if (state.level === 100) {
      state.gems += 300;
      addLog('Level 100 reward: +300 Gems');
    }

    if (state.level === 1000) {
      state.gems += 2000;
      addLog('Level 1000 reward: +2000 Gems');
    }

    if (state.level > 200 && state.level % 100 === 0) {
      state.gems += 1000;
      addLog(`Level ${state.level} paid milestone: +1000 Gems`);
    }
  }

  renderStats();
}

function collectUnit() {
  const tierRoll = Math.random();
  let tier = 1;

  if (tierRoll > 0.82) tier = 2;
  if (tierRoll > 0.92) tier = 3;
  if (tierRoll > 0.97) tier = 4;
  if (tierRoll > 0.995) tier = 5;

  state.inventory[tier] = (state.inventory[tier] || 0) + 1;
  state.coins += 75;
  addLog(`Collected ${unitTiers[tier - 1].name}!`);
  renderInventory();
  renderStats();
  attemptMerge();
}

function attemptMerge() {
  let merged = false;

  for (let tier = 1; tier <= 5; tier += 1) {
    if ((state.inventory[tier] || 0) >= 3) {
      state.inventory[tier] -= 3;
      state.inventory[tier + 1] = (state.inventory[tier + 1] || 0) + 1;
      state.coins += 250 * tier;
      addLog(`Merged 3x ${unitTiers[tier - 1].name} into ${unitTiers[tier].name}!`);
      merged = true;
      break;
    }
  }

  if (merged) {
    renderInventory();
    renderStats();
  }
}

function meleeBattle() {
  const totalPower = Object.entries(state.inventory).reduce((sum, [tier, count]) => {
    return sum + (Number(tier) * count * unitTiers[Number(tier) - 1].power);
  }, 0);

  const battlePower = Math.max(10, totalPower * 0.6);
  const enemyPower = state.enemyPower;
  const winChance = Math.min(0.92, Math.max(0.3, battlePower / (battlePower + enemyPower * 1.2)));

  const win = Math.random() < winChance;
  if (win) {
    const rewardCoins = 300 + state.level * 15;
    const rewardXp = 25 + state.level * 2;
    const rewardGems = Math.random() < 0.25 ? 3 : 0;

    state.coins += rewardCoins;
    state.gems += rewardGems;
    addXp(rewardXp);
    addLog(`Victory! +${rewardCoins} Coins, +${rewardXp} XP${rewardGems ? `, +${rewardGems} Gems` : ''}`);
  } else {
    const losePenalty = 150 + state.level * 8;
    state.coins = Math.max(0, state.coins - losePenalty);
    addLog(`Defeat! -${losePenalty} Coins`);
  }

  getEnemy();
  renderStats();
}

function claimDailyReward() {
  const rewardCoins = 750 + state.dailyStreak * 120;
  const rewardGems = Math.min(10, 2 + state.dailyStreak);
  state.coins += rewardCoins;
  state.gems += rewardGems;
  state.dailyStreak += 1;
  addLog(`Daily reward claimed: +${rewardCoins} Coins, +${rewardGems} Gems`);
  renderStats();
}

function buyPremiumPass() {
  if (state.passOwned) {
    addLog('Premium pass already active.');
    return;
  }

  if (state.gems < 200) {
    addLog('Need 200 Gems to activate the Premium Pass.');
    return;
  }

  state.gems -= 200;
  state.passOwned = true;
  state.coins += 2000;
  addLog('Premium Pass activated: +2000 Coins and 200 Gems bonus available.');
  renderStats();
}

function buyGemPackage(item) {
  const newPlayerBonus = 1.2;
  const bonusRate = state.level < 5 ? newPlayerBonus : 1;
  const gemsWon = Math.round(item.gems * bonusRate);

  state.gems += gemsWon;
  state.coins += item.price * 0.2;
  addLog(`Purchased ${item.name}: +${gemsWon} Gems`);
  renderStats();
}

function renderShop() {
  const gemShop = document.getElementById('gemShop');
  const premiumShop = document.getElementById('premiumShop');

  gemShop.innerHTML = '';
  gemOffers.forEach((offer) => {
    const row = document.createElement('div');
    row.className = 'store-item';
    row.innerHTML = `
      <div class="store-info">
        <span class="store-name">${offer.name}</span>
        <span class="store-meta">₹${offer.price} • ${offer.gems} Gems + ${offer.bonus}</span>
      </div>
      <button class="buy-btn" data-type="gem" data-offer="${offer.id}">Buy</button>
    `;
    gemShop.appendChild(row);
  });

  premiumShop.innerHTML = '';
  premiumOffers.forEach((offer) => {
    const row = document.createElement('div');
    row.className = 'store-item';
    row.innerHTML = `
      <div class="store-info">
        <span class="store-name">${offer.name}</span>
        <span class="store-meta">₹${offer.price} • ${offer.perks}</span>
      </div>
      <button class="buy-btn" data-type="premium" data-offer="${offer.id}">Buy</button>
    `;
    premiumShop.appendChild(row);
  });

  document.querySelectorAll('.buy-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.type;
      const offerId = button.dataset.offer;

      if (type === 'gem') {
        const offer = gemOffers.find((item) => item.id === offerId);
        if (offer) buyGemPackage(offer);
      }

      if (type === 'premium') {
        if (offerId === 'pass') buyPremiumPass();
        else {
          state.coins += 1000;
          state.gems += 75;
          addLog('Daily Deal activated: +1000 Coins and +75 Gems');
          renderStats();
        }
      }
    });
  });
}

function init() {
  getEnemy();
  renderInventory();
  renderStats();
  renderLog();
  renderShop();

  document.getElementById('collectBtn').addEventListener('click', collectUnit);
  document.getElementById('mergeBtn').addEventListener('click', () => {
    attemptMerge();
  });
  document.getElementById('battleBtn').addEventListener('click', meleeBattle);
  document.getElementById('dailyRewardBtn').addEventListener('click', claimDailyReward);
  document.getElementById('premiumPassBtn').addEventListener('click', buyPremiumPass);

  addLog('Welcome to Skyline Merge Arena! Collect units, merge, and battle.');
  addLog('Your first daily reward is ready.');
}

init();
