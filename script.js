// object to represent a possible game state. Will be used for traversal by the minimax AI.
let State = function (old, move) {
    // whose turn is it?
    this.turn = "X";

    // number of AI moves so far - used by the minmax algorithm
    this.depth = 0;

    // current representation of board
    // 0 = blank space
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    // current status of the game
    this.result = "active";

    // if old state has been passed in to generate this state, copy the state over.
    if (old) {
        for (let i = 0; i <= 8; i++) {
            this.board[i] = old.board[i];
        }
        this.depth = old.depth;
        this.result = old.result;
        this.turn = old.turn;
    }

    //if there's a move object, advance the turn to that move's turn and place it at the specified position
    if (move) {
        this.turn = move.turn;
        this.board[move.position] = move.turn;

        if (move.turn === "O") {
            this.depth++;
        }

        this.turn = move.turn == "X" ? "O" : "X";
    }

    // find all empty cells in the state and return them
    this.emptyCells = function () {
        let indexes = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === 0) {
                indexes.push(i);
            }
        }
        return indexes;
    };

    // check if the game is over.
    // return true if the game is over.
    this.gameOver = function () {
        // check horizontally
        for (let i = 0; i <= 6; i += 3) {
            if (this.board[i] !== 0 && this.board[i] === this.board[i + 1] && this.board[i + 1] === this.board[i + 2]) {
                this.result = this.board[i];
                return true;
            }
        }

        // check vertically
        for (let i = 0; i <= 2; i++) {
            if (this.board[i] !== 0 && this.board[i] === this.board[i + 3] && this.board[i + 3] === this.board[i + 6]) {
                this.result = this.board[i];
                return true;
            }
        }

        // check diagonally
        if (
            this.board[4] !== 0 &&
            ((this.board[0] === this.board[4] && this.board[4] === this.board[8]) ||
                (this.board[2] === this.board[4] && this.board[4] === this.board[6]))
        ) {
            this.result = this.board[4];
            return true;
        }

        //if none of the win checks are met, check for a draw.
        let available = this.emptyCells();
        if (available[0] == undefined) {
            this.result = "draw";
            return true;
        } else {
            return false;
        }
    };
};

// unbeatable AI, original minimax algorithm adapted from Mostafa Samir:
// https://mostafa-samir.github.io/Tic-Tac-Toe-AI/
let AI = function () {
    //current game being played by the AI.
    let game = {};

    // "global" variable used to store the next move, determined by the recursive minmax function
    let nextMove;

    // initialize the AI's symbol. This will be defined via the UI.
    this.AISymbol = "O";

    // for scoping
    let _this = this;

    // minimax function to determine the best move.
    function minimax(state) {
        // if this particular state is a finished game, return the score of the current board.
        if (state.gameOver()) {
            return Game.score(state);
        } else {
            //store all scores (index will correspond to the second array of moves)
            var scores = [];
            var moves = state.emptyCells();

            //calculate the minmax value for every possible move.
            for (let i = 0; i < moves.length; i++) {
                //the next turn for the possible state will be whoever is not currently in this state.
                //let nextTurn = state.turn == "X" ? "O" : "X";

                //create a possible state for every possible move
                let possibleState = new State(state, { turn: state.turn, position: moves[i] });

                //push that state's score
                let currScore = minimax(possibleState);

                scores.push(currScore);
            }

            //TODO - replace with player/computer value
            if (state.turn == "X") {
                // if it's the player's turn, find the maximum value.
                let max = findMaxIndex(scores);
                // store the move to be executed
                nextMove = moves[max];

                // return the maximum score
                return scores[max];
            } else {
                // if it's the player's turn, find the maximum value.
                let min = findMinIndex(scores);

                // store the move to be executed
                nextMove = moves[min];

                // return the minimum score
                return scores[min];
            }
        }
    }

    this.plays = function (_game) {
        game = _game;
    };

    this.takeMove = function (_state) {
        // call the minimax function to determine best move.
        _state.turn = _this.AISymbol;
        minimax(_state);

        let newState = new State(_state, { turn: _this.AISymbol, position: nextMove });
        myGame.advanceTo(newState);
    };
};

//game object
let Game = function (AI) {
    // initialize the AI
    this.ai = AI;

    // initialize the game state
    this.currentState = new State();
    this.currentState.turn = "X";

    // start game
    this.status = "start";

    // function to advance game to a new state
    this.advanceTo = function (_state) {
        this.currentState = _state;
    };

    // function to start the game
    this.start = function () {
        if ((this.status = "start")) {
            this.advanceTo(this.currentState);
            this.status = "running";
        }
    };
};

// initialize AI object
var myAI = new AI();

let myGame = new Game(myAI);
myAI.plays(myGame);

// function to determine the score of a game state
Game.score = function (_state) {
    if (_state.result === "X") {
        return 10 - _state.depth;
    } else if (_state.result === "O") {
        return -10 + _state.depth;
    } else {
        return 0;
    }
};

window.onload = function () {
    let spaces = document.querySelectorAll(".space");

    //initialize game state
    myGame.start();

    //on click, set the state to X and advance the state
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].addEventListener("click", function (e) {
            let index = e.target.id.split("-")[1];
            let move = new State(myGame.currentState, { turn: "X", position: index });
            myGame.advanceTo(move);

            //call the AI to take a move
            myAI.takeMove(myGame.currentState);

            render();
        });
    }

    //render the game state to the screen
    function render() {
        for (let i = 0; i < spaces.length; i++) {
            if (myGame.currentState.board[i] === 0) {
                spaces[i].innerText = "";
            } else {
                spaces[i].innerText = myGame.currentState.board[i];
            }
        }

        if (myGame.currentState.result !== "active") {
            document.querySelector(".message-area").classList.remove("hide-me");
            document.querySelector(".message").innerText =
                myGame.currentState.result == "draw" ? "It's a Draw." : myGame.currentState.result + " wins.";
        }
    }

    document.querySelector("#replay").addEventListener("click", function () {
        myGame = new Game(myAI);
        myAI.plays(myGame);
        myGame.start();
        render();
        document.querySelector(".message-area").classList.add("hide-me");
    });

    document.querySelector("#startGame").addEventListener("click", function () {
        document.querySelector(".board-area").classList.remove("hide-me");
        document.querySelector(".message-area").classList.add("hide-me");
    });
};
