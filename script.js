document.addEventListener("DOMContentLoaded", function() {
    const balanceValueElement = document.querySelector('#balance-value');
    const tapButton = document.querySelector('#tap-button');

    // Получаем данные пользователя из локального хранилища
    let balance = Number.parseInt(localStorage.getItem('balance'), 10) || 0;
    let userId = localStorage.getItem('userId') || generateUserId();

    // Отображаем текущий баланс
    balanceValueElement.textContent = balance;

    // Обработчик клика по кнопке
    tapButton.addEventListener('click', function() {
        balance += 1;
        balanceValueElement.textContent = balance;
        localStorage.setItem('balance', balance);
    });

    // Генерация уникального ID пользователя с использованием UUID
    function generateUserId() {
        const id = crypto.randomUUID();
        localStorage.setItem('userId', id);
        return id;
    }
});
