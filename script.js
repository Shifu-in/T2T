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
            CLICK_MULTIPLIER: { displayName: "Click", description: "Multiply per click", baseMultiplier: 1, level: 0, cost: 10, costIncrement: 1.3 },
            AUTOCLICK: { displayName: "Auto-Click", description: "Automatically clicks", baseMultiplier: 0, level: 0, cost: 50, costIncrement: 1.1
