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
            CLICK_MULTIPLIER: { displayName: "Click Multiplier", description: "Multiply per click", baseMultiplier: 1, level: 0, cost: 50, costIncrement: 1.15, maxLevel: 10 },
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
                <div class="upgrade-icon">
                    <img src="https://raw.githubusercontent.com/yourusername/yourrepository/main/Gem.png" alt="${upgrade.displayName}">
                </div>
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
    let playerSymbol = "";
    let compSymbol = "";
    let playerTurn;

    const AI = function() {
        let game = {};
        let nextMove;
        this.AISymbol = "";

        let _this = this;

        function minimax(state) {
            if (state.gameOver()) {
                return Game.score(state);
            } else {
                let scores = [];
                let moves = state.emptyCells();
                for (let i = 0; i < moves.length; i++) {
                    let possibleState = new State(state, { turn: state.turn, position: moves[i] });
                    let currScore = minimax(possibleState);
                    scores.push(currScore);
                }

                if (state.turn == "X") {
                    let max = findMaxIndex(scores);
                    nextMove = moves[max];
                    return scores[max];
                } else {
                    let min = findMinIndex(scores);
                    nextMove = moves[min];
                    return scores[min];
                }
            }
        }

        this.plays = function(_game) {
            game = _game;
        };

        this.takeMove = function(_state) {
            _state.turn = _this.AISymbol;
            minimax(_state);
            let newState = new State(_state, { turn: _this.AISymbol, position: nextMove });
            myGame.advanceTo(newState);
        }
    }

    const Game = function(AI) {
        this.ai = AI;
        this.currentState = new State();
        this.currentState.turn = "X";
        this.status = "start";

        this.advanceTo = function(_state) {
            this.currentState = _state;
            this.updateUI();
        }

        this.start = function() {
            if (this.status = "start") {
                this.advanceTo(this.currentState);
                this.status = "running";
            }
        }

        this.updateUI = function() {
            let board = this.currentState.board;
            for (let i = 0; i <= 8; i++) {
                let selector = "#space-" + i;
                if (board[i]) {
                    document.querySelector(selector).innerHTML = board[i];
                    document.querySelector(selector).classList.remove("empty");
                } else {
                    document.querySelector(selector).innerHTML = "";
                    document.querySelector(selector).classList.add("empty");
                }
            }

            if (this.currentState.gameOver()) {
                let message = "";
                if (this.currentState.result == "draw") {
                    message = "It's a draw.";
                } else if (this.currentState.result != playerSymbol) {
                    message = "You lose!";
                } else {
                    message = "You win!";
                }
                document.querySelector(".message").innerHTML = message;
                document.querySelector(".message-area").style.display = 'block';
            }
        }

        this.isValid = function(space) {
            return this.currentState.board[space] == 0;
        }
    }

    Game.score = function(_state) {
        if (_state.result !== "active") {
            if (_state.result === "X") {
                return 10 - _state.depth;
            } else if (_state.result === "O") {
                return -10 + _state.depth;
            } else {
                return 0;
            }
        }
    }

    let State = function(old, move) {
        this.turn = "";
        this.depth = 0;
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.result = "active";

        if (old) {
            for (let i = 0; i <= 8; i++) {
                this.board[i] = old.board[i];
            }
            this.depth = old.depth;
            this.result = old.result;
            this.turn = old.turn;
        }

        if (move) {
            this.turn = move.turn;
            this.board[move.position] = move.turn;
            if (move.turn === "O") {
                this.depth++;
            }
            this.turn = move.turn == "X" ? "O" : "X";
        }

        this.emptyCells = function() {
            let indexes = [];
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === 0) {
                    indexes.push(i);
                }
            }
            return indexes;
        }

        this.gameOver = function() {
            for (let i = 0; i <= 6; i += 3) {
                if (this.board[i] !== 0 && this.board[i] === this.board[i + 1] && this.board[i + 1] === this.board[i + 2]) {
                    this.result = this.board[i];
                    return true;
                }
            }

            for (let i = 0; i <= 2; i++) {
                if (this.board[i] !== 0 && this.board[i] === this.board[i + 3] && this.board[i + 3] === this.board[i + 6]) {
                    this.result = this.board[i];
                    return true;
                }
            }

            if (this.board[4] !== 0 && (((this.board[0] === this.board[4]) && (this.board[4] === this.board[8])) || 
                                        ((this.board[2] === this.board[4]) && (this.board[4] === this.board[6])))) {
                this.result = this.board[4];
                return true;
            }

            let available = this.emptyCells();
            if (available[0] == undefined) {
                this.result = "draw";
                return true;
            } else {
                return false;
            }
        };
    }

    let findMaxIndex = function(arr) {
        let indexOfMax = 0;
        let max = 0;
        if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] >= max) {
                    indexOfMax = i;
                    max = arr[i];
                }
            }
        }
        return indexOfMax;
    }

    let findMinIndex = function(arr) {
        let indexOfMin = 0;
        let min = 0;
        if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] <= min) {
                    indexOfMin = i;
                    min = arr[i];
                }
            }
        }
        return indexOfMin;
    }

    let myAI = new AI();
    let myGame = new Game(myAI);
    myAI.plays(myGame);

    document.querySelector(".selection-area .btn#X").addEventListener('click', function() {
        playerSymbol = "X";
        compSymbol = "O";
        playerTurn = true;
        playGame();
    });

    document.querySelector(".selection-area .btn#O").addEventListener('click', function() {
        playerSymbol = "O";
        compSymbol = "X";
        playerTurn = false;
        playGame();
    });

    let playGame = function() {
        myAI = new AI();
        myGame = new Game(myAI);
        myAI.plays(myGame);

        myGame.updateUI();

        myAI.AISymbol = compSymbol;
        Game.prototype.playerSymbol = playerSymbol;

        document.querySelector(".hide-me").style.display = 'none';
        document.querySelector(".board-area").style.display = 'block';

        if (myAI.AISymbol == "X") {
            myGame.ai.takeMove(myGame.currentState);
            myGame.updateUI();
            playerTurn = true;
        }
    }

    document.querySelectorAll(".space").forEach(cell => {
        cell.addEventListener('click', function() {
            let num = this.getAttribute('id').substr(6, 6);
            if (playerTurn && myGame.isValid(num)) {
                let newState = new State(myGame.currentState, { turn: playerSymbol, position: num });
                myGame.advanceTo(newState);
                myGame.updateUI();
                playerTurn = false;

                setTimeout(function() {
                    myGame.ai.takeMove(myGame.currentState);
                    myGame.updateUI();
                    playerTurn = true;
                }, 1000);
            }
        });
    });

    document.querySelector("#replay").addEventListener('click', playGame);
});
