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

    // Получаем данные пользователя из локального хранилища
    let balance = Number.parseInt(localStorage.getItem('balance'), 10) || 0;
    let userId = localStorage.getItem('userId') || generateUserId();
    let username = localStorage.getItem('username') || generateUsername();
    let upgrades = JSON.parse(localStorage.getItem('upgrades')) || getDefaultUpgrades();
    let tapPower = Number.parseInt(localStorage.getItem('tapPower'), 10) || 1;
    let autoRate = calculateAutoRate(upgrades);

    // Обновляем элементы интерфейса
    balanceValueElement.textContent = balance;
    profileBalanceElement.textContent = balance;
    userIdElement.textContent = userId;
    usernameElement.textContent = username;
    autoRateElement.textContent = autoRate;

    renderUpgrades(upgrades);

    // Обработчик клика по кнопке
    tapButton.addEventListener('click', function() {
        balance += tapPower;
        updateBalance(balance);
        showClickEffect(tapPower);
    });

    // Генерация уникального ID пользователя с использованием UUID
    function generateUserId() {
        const id = crypto.randomUUID();
        localStorage.setItem('userId', id);
        return id;
    }

    // Генерация уникального никнейма пользователя
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

    // Показать эффект клика
    function showClickEffect(value) {
        const clickEffect = document.createElement('div');
        clickEffect.classList.add('click-effect');
        clickEffect.textContent = `+${value}`;
        clickEffectsContainer.appendChild(clickEffect);

        setTimeout(() => {
            clickEffectsContainer.removeChild(clickEffect);
        }, 500);
    }

    // Навигация между страницами
    window.navigateTo = function(page) {
        document.querySelectorAll('.game-window').forEach(div => div.style.display = 'none');
        document.getElementById(`${page}-page`).style.display = 'flex';
    }

    // Инициализация начальной страницы
    navigateTo('main');

    // Функция для обновления баланса
    function updateBalance(newBalance) {
        balance = newBalance;
        balanceValueElement.textContent = balance;
        profileBalanceElement.textContent = balance;
        localStorage.setItem('balance', balance);
    }

    // Функция авто-начислений
    function autoIncrement() {
        balance += autoRate;
        updateBalance(balance);
    }
    
    setInterval(autoIncrement, 1000);

    // Получение улучшений по умолчанию
    function getDefaultUpgrades() {
        return {
            CLICK_MULTIPLIER: { displayName: "Click", description: "Multiply per click", baseMultiplier: 1, level: 0, cost: 500, costIncrement: 1.15, maxLevel: 10 },
            AUTOCLICK: { displayName: "Auto-Click", description: "Automatically clicks", baseMultiplier: 0, level: 0, cost: 3000, costIncrement: 1.15, maxLevel: 10 },
            VOYAGER: { displayName: "Voyager", description: "Automatically clicks more", baseMultiplier: 0, level: 0, cost: 5000, costIncrement: 1.15, maxLevel: 10 },
            ROVER: { displayName: "Rover", description: "Multiply all resources", baseMultiplier: 0, level: 0, cost: 10000, costIncrement: 1.15, maxLevel: 10, isResourceMultiplier: true },
            DELIVERY: { displayName: "Delivery", description: "Multiply all resources", baseMultiplier: 0, level: 0, cost: 50000, costIncrement: 1.15, maxLevel: 10, isResourceMultiplier: true },
            NEW_PLANET: { displayName: "New Planet", description: "Double all resources to collect", baseMultiplier: 0, level: 0, cost: 100000, costIncrement: 1.15, maxLevel: 10, unavailable: true, isResourceMultiplier: true }
        };
    }

    // Рендеринг улучшений
    function renderUpgrades(upgrades) {
        upgradeListElement.innerHTML = '';
        for (const [key, upgrade] of Object.entries(upgrades)) {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = `upgrade ${balance < upgrade.cost || upgrade.level >= upgrade.maxLevel ? "-disabled" : ''}`;
            upgradeDiv.innerHTML = `
                <div class="upgrade-img"></div>
                <div class="upgrade-info">
                    <h2>${upgrade.displayName}</h2>
                    <ul>
                        <li>Lv. ${upgrade.level}</li>
                        <li class="cost ${balance < upgrade.cost ? '-disabled' : ''}">${upgrade.cost}</li>
                        <li class="income">Income: ${calculateIncome(upgrade)} Energy/sec</li>
                    </ul>
                </div>
            `;
            upgradeDiv.onclick = () => {
                if (balance >= upgrade.cost && !upgrade.unavailable && upgrade.level < upgrade.maxLevel) {
                    balance -= upgrade.cost;
                    upgrade.level += 1;
                    upgrade.cost = Math.floor(upgrade.cost * upgrade.costIncrement);
                    if (key === 'CLICK_MULTIPLIER') {
                        tapPower += upgrade.baseMultiplier;
                        localStorage.setItem('tapPower', tapPower);
                    } else if (upgrade.baseMultiplier) {
                        upgrade.baseMultiplier += 1;
                    }
                    localStorage.setItem('balance', balance);
                    localStorage.setItem('upgrades', JSON.stringify(upgrades));
                    balanceValueElement.textContent = balance;
                    profileBalanceElement.textContent = balance;
                    autoRate = calculateAutoRate(upgrades);
                    autoRateElement.textContent = autoRate;
                    renderUpgrades(upgrades);
                    upgradeDiv.classList.add('active'); // Добавляем класс выделения
                    setTimeout(() => {
                        upgradeDiv.classList.remove('active'); // Убираем класс через некоторое время
                    }, 200);
                }
            };
            upgradeListElement.appendChild(upgradeDiv);
        }
    }

    // Вычисление авто-ставки
    function calculateAutoRate(upgrades) {
        let autoRate = 0;
        for (const upgrade of Object.values(upgrades)) {
            if (upgrade.baseMultiplier && !upgrade.isResourceMultiplier) {
                autoRate += upgrade.baseMultiplier * upgrade.level;
            }
        }
        return autoRate;
    }

    // Вычисление дохода от апгрейда
    function calculateIncome(upgrade) {
        return upgrade.baseMultiplier * upgrade.level;
    }
});
