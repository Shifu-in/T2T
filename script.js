document.addEventListener("DOMContentLoaded", function() {
    const balanceValueElement = document.querySelector('#balance-value');
    const tapButton = document.querySelector('#tap-button');
    const clickEffectsContainer = document.querySelector('#click-effects');
    const profileBalanceElement = document.querySelector('#profile-balance');
    const userIdElement = document.querySelector('#user-id');

    // Получаем данные пользователя из локального хранилища
    let balance = Number.parseInt(localStorage.getItem('balance'), 10) || 0;
    let userId = localStorage.getItem('userId') || generateUserId();

    // Отображаем текущий баланс и ID пользователя
    balanceValueElement.textContent = balance;
    profileBalanceElement.textContent = balance;
    userIdElement.textContent = userId;

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

    // Показать эффект клика
    function showClickEffect() {
        const clickEffect = document.createElement('div');
        clickEffect.classList.add('click-effect');
        clickEffect.textContent = '+1';
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
});
