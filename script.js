//// GAME MODULE ////
var gameController = (function () {

    var game = {
        board: ['', '', '',
                '', '', '',
                '', '', ''],
        count: 0,
        turn: 0,
        winner: false
    }

    var winningFormula = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

    var checkWin = function (winningArr) {
        var a, b, c;

        a = winningArr[0];
        b = winningArr[1];
        c = winningArr[2];

        if (game.board[a] && game.board[b] && game.board[c] && !game.winner) {
            game.winner = (game.board[a] == game.board[b] && game.board[a] == game.board[c])
        }
    };


    return {
        nextTurn: function () {
            if (game.turn === 0) {
                game.turn = 1;
            } else {
                game.turn = 0;
            }
            return game.turn;
        },

        checkWinner: function () {

            for (var i = 0; i < winningFormula.length; i++) {
                checkWin(winningFormula[i]);
            }

            console.log(game.winner);

            // If board is filled up & there isn't no winning line...
            if (!game.winner && !game.board.includes('')) {
                game.winner = "draw"
            }

            return game.winner;
        },

        getTurn: function () {
            return game.turn;
        },

        initGameCtrl: function () {
            game.board = ['', '', '',
                          '', '', '',
                          '', '', ''];
            game.count = 0;
            game.turn = 0;
            game.winner = false;
        },

        updateBoard: function (cellID, turn, playerArr) {
            game.board[cellID] = playerArr[turn].counter[turn];
            return game.board;
        },


        getBoard: function () {
            return game.board;
        },
    }

})()




//// PLAYER MODULE ////
var playerController = (function () {

    // Code here
    var Player = function (name, AI) {
        this.name = name ? name : "Computer";
        this.AI = AI;
        this.score = 0;
        this.counter = ['X', 'O'];
    }

    var allPlayers = [];

    return {

        createPlayers: function (names, AIArr) {
            var playerOne, playerTwo;

            // if blank

            playerOne = new Player(names[0], AIArr[0]);
            playerTwo = new Player(names[1], AIArr[1]);

            allPlayers.push(playerOne, playerTwo);
        },

        getPlayers: function () {
            return allPlayers;
        },

        initPlayers: function () {
            allPlayers = [];
        }
    };

})()




//// UI CONTROLLER ////
var UIController = (function () {

    // All of our DOM strings
    var DOMStrings = {
        boardContainer: '.board-container',
        cell: '.cell',
        playerOneAICheck: '#player-one-AI',
        playerTwoAICheck: '#player-two-AI',
        playerOneName: '#player-one',
        playerTwoName: '#player-two',
        startGameBtn: '#start',
        resetGameBtn: '#reset',
        nextPlayerMsg: '#message'
    }

    var AICheckboxes = {
        AIArr: [false, false]
    }

    var displayMsg = function (msg) {
        var msgWrap;

        msgWrap = "<h3>" + msg + "</h3>";

        document.querySelector(DOMStrings.nextPlayerMsg).innerHTML = msgWrap;
    }



    // Our globally accesible functions
    return {

        drawBoard: function () {
            var board, html;

            board = document.querySelector(DOMStrings.boardContainer)

            board.innerHTML = "";

            for (var i = 0; i < 9; i++) {
                html = '<div class="cell" id="' + i + '"></div>'
                board.insertAdjacentHTML('beforeEnd', html);
            }
        },

        showBoard: function () {
            var board;
            board = document.querySelector(DOMStrings.boardContainer);
            
            board.style.display = 'block';
        },

        getDOMStrings: function () {
            return DOMStrings;
        },

        getAICheckboxes: function () {
            return AICheckboxes.AIArr
        },

        checkAI: function (event) {
            var plyrOneAI, plyrTwoAI;

            plyrOneAI = document.querySelector(DOMStrings.playerOneAICheck);
            plyrTwoAI = document.querySelector(DOMStrings.playerTwoAICheck);
            plyrOneInput = document.querySelector(DOMStrings.playerOneName);
            plyrTwoInput = document.querySelector(DOMStrings.playerTwoName);

            if (plyrOneAI.checked) {
                plyrTwoAI.disabled = true;
                plyrOneInput.disabled = true;
                plyrOneInput.placeholder = 'Computer';
                plyrOneInput.value = "";
            } else if (!plyrOneAI.checked) {
                plyrTwoAI.disabled = false;
                plyrOneInput.disabled = false;
                plyrOneInput.placeholder = 'Player 1';
            };

            if (plyrTwoAI.checked) {
                plyrOneAI.disabled = true;
                plyrTwoInput.disabled = true;
                plyrTwoInput.placeholder = 'Computer';
                plyrTwoInput.value = "";
            } else if (!plyrTwoAI.checked) {
                plyrOneAI.disabled = false;
                plyrTwoInput.disabled = false
                plyrTwoInput.placeholder = 'Player 2';
            };

            // Returns a true/false array for AI or not
            AICheckboxes.AIArr = [plyrOneAI.checked, plyrTwoAI.checked]
        },

        getInputs: function () {
            var plyrOneName, plyrTwoName, namesArr = [];

            plyrOneName = document.querySelector(DOMStrings.playerOneName).value;
            plyrTwoName = document.querySelector(DOMStrings.playerTwoName).value;

            if ((plyrOneName || AICheckboxes.AIArr[0] === true) && (plyrTwoName || AICheckboxes.AIArr[1] === true)) {
                namesArr.push(plyrOneName);
                namesArr.push(plyrTwoName);
                return namesArr;
            } else {
                // If fields empty - return -1
                return -1;
            }

        },

        displayPlayers: function () {
            document.querySelector(DOMStrings.playerOneAICheck).disabled = true;
            document.querySelector(DOMStrings.playerTwoAICheck).disabled = true;
            document.querySelector(DOMStrings.playerOneName).disabled = true;
            document.querySelector(DOMStrings.playerTwoName).disabled = true;
        },

        displayCurrentPlayer: function (turn, players) {
            if (turn == 0) {
                displayMsg(players[0].name + "'s turn");

            } else if (turn == 1) {
                displayMsg(players[1].name + "'s turn");
            }
        },

        displayWinner: function (name) {
            displayMsg(name + " is the winner!");
        },

        displayDraw: function () {
            displayMsg("It's a draw!");
        },

        initUI: function () {

            document.querySelector(DOMStrings.playerOneAICheck).checked = false;
            document.querySelector(DOMStrings.playerTwoAICheck).checked = false;
            document.querySelector(DOMStrings.playerOneName).value = "";
            document.querySelector(DOMStrings.playerTwoName).value = "";

            document.querySelector(DOMStrings.playerOneAICheck).disabled = false;
            document.querySelector(DOMStrings.playerTwoAICheck).disabled = false;
            document.querySelector(DOMStrings.playerOneName).disabled = false;
            document.querySelector(DOMStrings.playerTwoName).disabled = false;

            document.querySelector(DOMStrings.boardContainer).innerHTML = "";
            document.querySelector(DOMStrings.nextPlayerMsg).innerHTML = "";

            document.querySelector(DOMStrings.playerOneName).placeholder = "Player 1";
            document.querySelector(DOMStrings.playerTwoName).placeholder = "Player 2";
            
            document.querySelector(DOMStrings.boardContainer).style.display = 'none';
            
            AICheckboxes.AIArr = [false, false];
        },

        updateBoard: function (cellID, playerCounter) {
            var cell

            cell = document.getElementById(cellID);

            cell.innerHTML = playerCounter;
        }


    }

})()


//// AI CONTROLLER ////
var AIController = (function () {

    var getRand = function () {
        return Math.floor(Math.random() * 8);
    }


    return {
        getAIMove: function (board) {

            var cellChoice, num, cellFound = false;

            // Make a random move... 
            while (!cellFound) {
                num = getRand()
                if (board[num] === "") {
                    cellChoice = num;
                    cellFound = true;
                }
            }

            return cellChoice;
        }
    }
})()


//// GLOBAL MODULE ////
var globalModule = (function (gameCtrl, playerCtrl, UICtrl, AICtrl) {

    // Code here
    var initGame = function () {
        UICtrl.initUI();
        gameCtrl.initGameCtrl();
        playerCtrl.initPlayers();
        setupEventListeners();
    };

    var cellClickListener = function (event) {
        if (event.target.id) {
            makeMove(event.target.id);
        }
    };

    var setupEventListeners = function () {
        var DOMStrings, board, AIArr = [];

        DOMStrings = UICtrl.getDOMStrings();

        document.querySelector(DOMStrings.playerOneAICheck).addEventListener('click', function (event) {
            AIArr = UICtrl.checkAI(event);
        })

        document.querySelector(DOMStrings.playerTwoAICheck).addEventListener('click', function (event) {
            AIArr = UICtrl.checkAI(event);
        })

        document.querySelector(DOMStrings.startGameBtn).addEventListener('click', startGame);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                startGame();
            }
        })

        document.querySelector(DOMStrings.resetGameBtn).addEventListener('click', initGame);

    };

    var addCellEventListeners = function () {
        for (var i = 0; i < 9; i++) {
            document.getElementById(i).addEventListener('click', cellClickListener)
        }
    };

    var removeCellEventListeners = function (cellID) {
        cell = document.getElementById(cellID);
        cell.removeEventListener('click', cellClickListener)
    };

    var removeAllCellEventListeners = function () {
        for (var i = 0; i < 9; i++) {
            cell = document.getElementById(i)
            cell.removeEventListener('click', cellClickListener)
        }
    };

    var startGame = function () {
        var playerNamesArr, AIArr = [],
            playersArr = [];

        playerNamesArr = UICtrl.getInputs();
        AIArr = UICtrl.getAICheckboxes();

        if (playerNamesArr !== -1) {
            gameCtrl.initGameCtrl();
            UICtrl.showBoard();
            UICtrl.drawBoard(gameCtrl.getBoard());
            playerCtrl.createPlayers(playerNamesArr, AIArr);
            UICtrl.displayPlayers(playerCtrl.getPlayers());
            UICtrl.displayCurrentPlayer(gameCtrl.getTurn(), playerCtrl.getPlayers());

            // If the first player is computer...
            if (playerCtrl.getPlayers()[0].AI) {
                AIMove();
            }

            addCellEventListeners();
        }
    };

    var endGame = function (turn) {

        var winnerName = playerCtrl.getPlayers()[turn].name;

        UICtrl.displayWinner(winnerName);
        removeAllCellEventListeners();

    };

    var gameDraw = function () {
        console.log("It's a draw!");
        UICtrl.displayDraw()
        removeAllCellEventListeners();
    }


    var AIMove = function () {
        var board, AIChoice;

        removeAllCellEventListeners();

        board = gameCtrl.getBoard();
        AIChoice = AICtrl.getAIMove(board);

        addCellEventListeners();

        setTimeout(function () {
            makeMove(AIChoice)
        }, 1000);

    }

    var makeMove = function (cellID) {
        var playersArr, turn, gameOver = true;

        playersArr = playerCtrl.getPlayers();
        turn = gameCtrl.getTurn();

        gameCtrl.updateBoard(cellID, turn, playersArr);

        UICtrl.updateBoard(cellID, playersArr[turn].counter[turn])
        removeCellEventListeners(cellID);

        gameOver = gameCtrl.checkWinner();

        if (gameOver === true) {
            endGame(turn);
        } else if (gameOver === "draw") {
            gameDraw();
        } else {
            gameCtrl.nextTurn();
            turn = gameCtrl.getTurn();
            UICtrl.displayCurrentPlayer(turn, playersArr);
            if (playersArr[turn].AI) {
                AIMove();
            }
        }

    };


    return {

        init: function () {
            initGame();
        }

    };

})(gameController, playerController, UIController, AIController)



// Only global line of code
globalModule.init();