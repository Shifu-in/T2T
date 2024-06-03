document.addEventListener("DOMContentLoaded", function() {
    const balanceValueElement = document.querySelector('#balance-value');
    const tapButton = document.querySelector('#tap-button');
    const clickEffectsContainer = document.querySelector('#click-effects');
    const profileBalanceElement = document.querySelector('#profile-balance');
    const userIdElement = document.querySelector('#user-id');
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
    let userData = usersData[userId] || { userId: userId, balance: 0 };

    updateUserData();

    tapButton.addEventListener('click', function() {
        userData.balance += 1;
        updateBalance(userData.balance);
        showClickEffect(1);
    });

    function generateUserId() {
        const id = crypto.randomUUID();
        localStorage.setItem('userId', id);
        return id;
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

    function subscribeToChannel(url) {
        window.open(url, '_blank');
    }

    function updateBalance(newBalance) {
        userData.balance = newBalance;
        updateUserData();
    }

    function autoIncrement() {
        userData.balance += 1; // Или ваш автоинкремент
        updateBalance(userData.balance);
    }
    
    setInterval(autoIncrement, 1000);

    function updateUserData() {
        balanceValueElement.textContent = userData.balance;
        profileBalanceElement.textContent = userData.balance;
        userIdElement.textContent = userId;

        usersData[userId] = userData;
        localStorage.setItem('usersData', JSON.stringify(usersData));
    }

    // Функция экспорта данных пользователя
    window.exportUserData = function() {
        const userDataStr = JSON.stringify(Object.values(usersData).map(({ userId, balance }) => ({ userId, balance })), null, 2);
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
    };

    // Динамическое добавление кнопки "Export User Data" для администратора
    if (userId === '802d237f-1bcc-4d49-ad8c-6873ba7ff0c5' && !document.querySelector('.nav-button.export-user-data')) {
        const exportButton = document.createElement('button');
        exportButton.className = 'nav-button export-user-data';
        exportButton.textContent = 'Export User Data';
        exportButton.onclick = exportUserData;
        document.querySelector('.profile-content').appendChild(exportButton);
    }
});

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
        if (this.status == "start") {
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
        if (available.length === 0) {
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

    document.querySelector(".selection-area").style.display = 'none';
    document.querySelector(".board-area").style.display = 'block';

    if (myAI.AISymbol == "X") {
        myGame.ai.takeMove(myGame.currentState);
        myGame.updateUI();
        playerTurn = true;
    }
}

document.querySelectorAll(".space").forEach(cell => {
    cell.addEventListener('click', function() {
        let num = this.getAttribute('id').substr(6, 1);
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
