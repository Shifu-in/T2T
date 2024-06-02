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
                    } else {
                        autoRate += upgrade.baseMultiplier;
                    }
                    localStorage.setItem('balance', balance);
                    localStorage.setItem('upgrades', JSON.stringify(upgrades));
                    balanceValueElement.textContent = balance;
                    profileBalanceElement.textContent = balance;
                    autoRateElement.textContent = autoRate;
                    renderUpgrades(upgrades);
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

    // Tic-Tac-Toe game logic
    const cells = document.querySelectorAll(".cell");
    const statusDisplay = document.getElementById("status");
    const gameBoard = document.getElementById("gameBoard");
    const startButton = document.getElementById("startButton");
    const playersSelect = document.getElementById("players");

    let ticTacToeBoard = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let numPlayers = 2;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellPlayed = (clickedCell, clickedCellIndex) => {
        ticTacToeBoard[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
    };

    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    };

    const handleResultValidation = () => {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = ticTacToeBoard[winCondition[0]];
            let b = ticTacToeBoard[winCondition[1]];
            let c = ticTacToeBoard[winCondition[2]];
            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        let roundDraw = !ticTacToeBoard.includes("");
        if (roundDraw) {
            statusDisplay.innerHTML = `Draw!`;
            gameActive = false;
            return;
        }

        handlePlayerChange();
        if (numPlayers === 0 || (numPlayers === 1 && currentPlayer === "O")) {
            aiPlay();
        }
    };

    const handleCellClick = (clickedCellEvent) => {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

        if (ticTacToeBoard[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    };

    const aiPlay = () => {
        if (!gameActive) return;
        let availableCells = ticTacToeBoard
            .map((cell, index) => (cell === "" ? index : null))
            .filter((index) => index !== null);
        let randomIndex =
            availableCells[Math.floor(Math.random() * availableCells.length)];
        let aiCell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
        handleCellPlayed(aiCell, randomIndex);
        handleResultValidation();
    };

    const resetGame = () => {
        ticTacToeBoard = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        statusDisplay.innerHTML = "";
        cells.forEach((cell) => (cell.innerHTML = ""));
        if (numPlayers === 0 || (numPlayers === 1 && currentPlayer === "O")) {
            aiPlay();
        }
    };

    startButton.addEventListener("click", () => {
        numPlayers = parseInt(playersSelect.value);
        gameBoard.classList.remove("hidden");
        resetGame();
    });

    cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
});
