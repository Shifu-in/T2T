document.addEventListener("DOMContentLoaded", function() {
    const balanceValueElement = document.querySelector('#balance-value');
    const tapButton = document.querySelector('#tap-button');
    const clickEffectsContainer = document.querySelector('#click-effects');
    const profileBalanceElement = document.querySelector('#profile-balance');
    const userIdElement = document.querySelector('#user-id');
    const usernameElement = document.querySelector('#username');
    const autoRateElement = document.querySelector('#auto-rate');
    const upgradeListElement = document.querySelector('#upgrade-list');

    const gamingNicknames = [
        'ShadowHunter', 'MysticWarrior', 'StarKnight', 'PixelMaster', 'DragonSlayer',
        'CosmicRider', 'CyberNinja', 'PhantomAssassin', 'QuantumWizard', 'StarGazer',
        'NightStalker', 'MoonWalker', 'SpaceVoyager', 'GalacticHero', 'ThunderFist',
        'IronBlade', 'StormBringer', 'FireMage', 'IceSorcerer', 'WindRanger',
        'DarkAvenger', 'LightGuardian', 'SilentShadow', 'MysticSeer', 'ArcaneKnight'
    ];

    let balance = Number.parseInt(localStorage.getItem('balance'), 10) || 0;
    let userId = localStorage.getItem('userId') || generateUserId();
    let username = localStorage.getItem('username') || generateUsername();
    let upgrades = JSON.parse(localStorage.getItem('upgrades')) || getDefaultUpgrades();
    let tapPower = Number.parseInt(localStorage.getItem('tapPower'), 10) || 1;
    let autoRate = calculateAutoRate(upgrades);

    balanceValueElement.textContent = balance;
    profileBalanceElement.textContent = balance;
    userIdElement.textContent = userId;
    usernameElement.textContent = username;
    autoRateElement.textContent = autoRate;

    renderUpgrades(upgrades);

    tapButton.addEventListener('click', function() {
        balance += tapPower;
        updateBalance(balance);
        showClickEffect(tapPower);
    });

    function generateUserId() {
        const id = crypto.randomUUID();
        localStorage.setItem('userId', id);
        return id;
    }

    function generateUsername() {
        let username;
        do {
            const namePart1 = gamingNicknames[Math.floor(Math.random() * gamingNicknames.length)];
            const namePart2 = gamingNicknames[Math.floor(Math.random() * gamingNicknames.length)];
            username = `${namePart1}${namePart2}`;
        } while (username.length > 30 || localStorage.getItem(username) !== null);
        localStorage.setItem('username', username);
        return username;
    }

    function showClickEffect(value) {
        const clickEffect = document.createElement('div');
        clickEffect.classList.add('click-effect');
        clickEffect.textContent = `+${value}`;
        clickEffectsContainer.appendChild(clickEffect);

        setTimeout(() => {
            clickEffectsContainer.removeChild(clickEffect);
        }, 500);
    }

    window.navigateTo = function(page) {
        document.querySelectorAll('.game-window').forEach(div => div.style.display = 'none');
        document.getElementById(`${page}-page`).style.display = 'flex';
    }

    navigateTo('main');

    function updateBalance(newBalance) {
        balance = newBalance;
        balanceValueElement.textContent = balance;
        profileBalanceElement.textContent = balance;
        localStorage.setItem('balance', balance);
    }

    function autoIncrement() {
        balance += autoRate;
        updateBalance(balance);
    }
    
    setInterval(autoIncrement, 1000);

    function getDefaultUpgrades() {
        return {
            CLICK_MULTIPLIER: { displayName: "Click", description: "Multiply per click", baseMultiplier: 1, level: 0, cost: 50, costIncrement: 1.15, maxLevel: 10 },
            AUTOCLICK: { displayName: "Auto-Click", description: "Automatically clicks", baseMultiplier: 0, level: 0, cost: 300, costIncrement: 1.15, maxLevel: 10 },
            VOYAGER: { displayName: "Voyager", description: "Automatically clicks more", baseMultiplier: 0, level: 0, cost: 500, costIncrement: 1.15, maxLevel: 10 },
            ROVER: { displayName: "Rover", description: "Multiply all resources", baseMultiplier: 0, level: 0, cost: 1000, costIncrement: 1.15, maxLevel: 10, isResourceMultiplier: true },
            DELIVERY: { displayName: "Delivery", description: "Multiply all resources", baseMultiplier: 0, level: 0, cost: 5000, costIncrement: 1.15, maxLevel: 10, isResourceMultiplier: true },
            NEW_PLANET: { displayName: "New Planet", description: "Double all resources to collect", baseMultiplier: 0, level: 0, cost: 10000, costIncrement: 1.15, maxLevel: 10, unavailable: true, isResourceMultiplier: true }
        };
    }

    function renderUpgrades(upgrades) {
        upgradeListElement.innerHTML = '';
        for (const [key, upgrade] of Object.entries(upgrades)) {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = `upgrade ${balance < upgrade.cost || upgrade.level >= upgrade.maxLevel ? "-disabled" : ''}`;
            upgradeDiv.innerHTML = `
               
