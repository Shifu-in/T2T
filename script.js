document.addEventListener("DOMContentLoaded", function() {
    const balanceValueElement = document.querySelector('#balance-value');
    const tapButton = document.querySelector('#tap-button');
    const clickEffectsContainer = document.querySelector('#click-effects');
    const profileBalanceElement = document.querySelector('#profile-balance');
    const userIdElement = document.querySelector('#user-id');
    const usernameElement = document.querySelector('#username');

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

    // Отображаем текущий баланс, ID пользователя и никнейм
    balanceValueElement.textContent = balance;
    profileBalanceElement.textContent = balance;
    userIdElement.textContent = userId;
    usernameElement.textContent = username;

    // Обработчик клика по кнопке
    tapButton.addEventListener('click', function() {
        balance += 1;
        balanceValueElement.textContent = balance;
        profileBalanceElement.textContent = balance;
        localStorage.setItem('balance', balance);
        showClickEffect();
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
            username = `${namePart1}${namePart
