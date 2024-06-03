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

    // Загружаем данные всех пользователей из localStorage
    let usersData = JSON.parse(localStorage.getItem('usersData')) || {};

    // Получаем данные текущего пользователя
    let userId = localStorage.getItem('userId') || generateUserId();
    let userData = usersData[userId] || getDefaultUserData();

    // Обновляем элементы интерфейса
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
        document.get
