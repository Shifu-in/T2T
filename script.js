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

    let usersData = JSON.parse(localStorage.getItem('usersData')) || {};
    let userId = localStorage.getItem('userId') || generateUserId();
    let userData = usersData[userId] || getDefaultUserData();

    updateUserData();

    tapButton.addEventListener('click', function() {
        userData.balance += userData.tapPower;
        updateBalance(userData.balance);
        showClickEffect(userData.tapPower);
    });

    function generateUserId() {
        const id = crypto.randomUUID();
        localStorage.setItem('userId', id);
        return id;
    }

    function getDefaultUserData() {
        return {
            userId: userId,
            username: generateUsername(),
            balance: 0,
            upgrades: getDefaultUpgrades(),
            tapPower: 1,
            autoRate: 0
        };
    }

    function generateUsername() {
        let username;
        do {
            const namePart1 = gamingNicknames[Math.floor(Math.random() * gamingNicknames.length)];
            const namePart2 = gamingNicknames[Math.floor(Math.random() * gamingNicknames.length)];
            username = `${namePart1}${namePart2}`;
        } while (username.length > 30 || Object.values(usersData).some(user => user.username === username));
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
        if (page === 'store') {
            renderUpgrades(userData.upgrades);
        }
    }

    function subscribeToChannel(url) {
        window.open(url, '_blank');
    }

    navigateTo('main');

    function updateBalance(newBalance) {
        userData.balance = newBalance;
        updateUserData();
    }

    function autoIncrement() {
        userData.balance += userData.autoRate;
        updateBalance(userData.balance);
    }
    
    setInterval(autoIncrement, 1000);

    function getDefaultUpgrades() {
        return {
            CLICK_MULTIPLIER: { displayName: "Click", description: "Multiply per click", baseMultiplier: 1, level: 0, cost: 50, costIncrement: 1.15, maxLevel: 10 },
            AUTOCLICK: { displayName: "Auto-Click", description: "Automatically clicks", baseMultiplier: 1, level: 0, cost: 300, costIncrement: 1.15, maxLevel: 10 },
            VOYAGER: { displayName: "Voyager", description: "Automatically clicks more", baseMultiplier: 2, level: 0, cost: 500, costIncrement: 1.15, maxLevel: 10 },
            ROVER: { displayName: "Rover", description: "Multiply all resources", baseMultiplier: 5, level: 0, cost: 1000, costIncrement: 1.15, maxLevel: 10 },
            DELIVERY: { displayName: "Delivery", description: "Multiply all resources", baseMultiplier: 10, level: 0, cost: 5000, costIncrement: 1.15, maxLevel: 10 },
            NEW_PLANET: { displayName: "New Planet", description: "Double all resources to collect", baseMultiplier: 20, level: 0, cost: 10000, costIncrement: 1.15, maxLevel: 10 }
        };
    }

    function renderUpgrades(upgrades) {
        upgradeListElement.innerHTML = '';
        for (const [key, upgrade] of Object.entries(upgrades)) {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = `upgrade ${userData.balance < upgrade.cost || upgrade.level >= upgrade.maxLevel ? "-disabled" : ''}`;
            upgradeDiv.innerHTML = `
                <div class="upgrade-icon">
                    <img src="assets/images/Gem.png" alt="${upgrade.displayName}">
                </div>
                <div class="upgrade-info">
                    <h2>${upgrade.displayName}</h2>
                    <ul>
                        <li>Lv. ${upgrade.level}</li>
                        <li class="cost ${userData.balance < upgrade.cost ? '-disabled' : ''}">${upgrade.cost}</li>
                        <li class="income">Income: ${calculateIncome(upgrade)} Energy/sec</li>
                    </ul>
                </div>
            `;
            upgradeDiv.onclick = () => {
                if (userData.balance >= upgrade.cost && !upgrade.unavailable && upgrade.level < upgrade.maxLevel) {
                    userData.balance -= upgrade.cost;
                    upgrade.level += 1;
                    upgrade.cost = Math.floor(upgrade.cost * upgrade.costIncrement);
                    if (key === 'CLICK_MULTIPLIER') {
                        userData.tapPower += upgrade.baseMultiplier;
                    } else {
                        userData.autoRate += upgrade.baseMultiplier;
                    }
                    updateUserData();
                    upgradeDiv.classList.add('active');
                    setTimeout(() => {
                        upgradeDiv.classList.remove('active');
                    }, 200);
                }
            };
            upgradeListElement.appendChild(upgradeDiv);
        }
    }

    function calculateAutoRate(upgrades) {
        let autoRate = 0;
        for (const upgrade of Object.values(upgrades)) {
            autoRate += upgrade.baseMultiplier * upgrade.level;
        }
        return autoRate;
    }

    function calculateIncome(upgrade) {
        return upgrade.baseMultiplier * upgrade.level;
    }

    // Функция экспорта данных пользователя
    window.exportUserData = function() {
        // Уникальный идентификатор вашего пользователя
        const adminUserId = '802d237f-1bcc-4d49-ad8c-6873ba7ff0c5';
        
        // Проверяем, является ли текущий пользователь администратором
        if (userId === adminUserId) {
            const userDataStr = JSON.stringify(usersData, null, 2);
            const blob = new Blob([userDataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `users_data.json`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        } else {
            alert('You do not have permission to export user data.');
        }
    };

    // Динамическое добавление кнопки "Export User Data" для администратора
    if (userId === '802d237f-1bcc-4d49-ad8c-6873ba7ff0c5' && !document.querySelector('.nav-button.export-user-data')) {
        const exportButton = document.createElement('button');
        exportButton.className = 'nav-button export-user-data';
        exportButton.textContent = 'Export User Data';
        exportButton.onclick = exportUserData;
        document.querySelector('.profile-content').appendChild(exportButton);
    }

    function updateUserData() {
        balanceValueElement.textContent = userData.balance;
        profileBalanceElement.textContent = userData.balance;
        userIdElement.textContent = userId;
        usernameElement.textContent = userData.username;
        autoRateElement.textContent = userData.autoRate;

        usersData[userId] = userData;
        localStorage.setItem('usersData', JSON.stringify(usersData));
    }
});
