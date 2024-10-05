const cellElements3x3 = document.querySelectorAll('.s3');
const cellElements5x5 = document.querySelectorAll('.s5');
let circleTurn
const X_CLASS = 'x'
const CIRCLE_CLASS = '0'

const endGameDisplay = document.getElementById('end-game-display')
const winMessage = document.getElementById('end-game-message')
let turnCount
const restartBtn = document.getElementById('restart-button')

const startBtn = document.getElementById('start-button')

const boardGame3x3 = document.getElementById('3x3-board')
const boardGame5x5 = document.getElementById('5x5-board')
const boardGame7x7 = document.getElementById('7x7-board')

const startScreen = document.getElementById('start-screen')
const tableSize = document.getElementById('size-picker')

const homeBtn = document.getElementById('home-button')
const countdown = document.getElementById('countdown')
let startTime
const historySection = document.getElementById('history-section')

const playerTurnIndicator = document.getElementById('player-turn-indicator')
const undoButton = document.getElementById('undo-button')

let previousCell = null;
let turnHistory = document.getElementById('turn-history')
const opponentMode = document.getElementById('player-picker')


const WINNING_COMBINATIONS_LIST_3x3 = [
    /* for rows */
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    /* for columns */
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    /* diagonal */
    [0, 4, 8],
    [2, 4, 6]
]

const WINNING_COMBINATIONS_LIST_5x5 = [
    /* Row - Each row has 2 combination = 10 total */
    [0, 1, 2, 3], /* 1st row */
    [1, 2, 3, 4],
    [5, 6, 7, 8], /* 2nd row */
    [6, 7, 8, 9],
    [10, 11, 12, 13], /* 3rd */
    [11, 12, 13, 14],
    [15, 16, 17, 18], /* 4th */
    [16, 17, 18, 19],
    [20, 21, 22, 23], /* 5th */
    [21, 22, 23, 24],

    /* Column - Each column has 2 combinations = 10 total */
    [0, 5, 10, 15], /* 1st */
    [5, 15, 10, 20],
    [1, 6, 11, 16], /* 2nd */
    [6, 11, 16, 21],
    [2, 7, 12, 17], /* 3rd */
    [7, 12, 17, 22],
    [3, 8, 13, 18], /* 4th */
    [8, 13, 18, 23],
    [4, 9, 14, 19], /* 5th */
    [9, 14, 19, 24],

    /**** Diagonal *****/
    /* left to right */
    [1, 7, 13, 19],
    [0, 6, 12, 18],
    [6, 12, 18, 24],
    [5, 11, 17, 23],

    /* right to left */
    [3, 7, 11, 15],
    [4, 8, 12, 16],
    [8, 12, 16, 20],
    [9, 13, 17, 21]
]

startBtn.addEventListener('click', startGame)
restartBtn.addEventListener('click', startGame)


/* Problem: don't reset the timer when go back to the game */
homeBtn.addEventListener('click', () => {
    document.getElementById('playing-screen').style.display = 'none'

    startScreen.style.display = 'flex'      //Display start
    startTime = null;

    boardGame3x3.style.display = 'none'
    boardGame5x5.style.display = 'none'
    boardGame7x7.style.display = 'none'
})


/* Unsolved: 
1. After time out after undo btn clicked, the "playerTurnIndicator doesn't produce the result
of change player turn due to time out" (they changed but the final result is not desirable) ✔️
2. Restrict each player for each turn can only undo once
*/
undoButton.addEventListener('click', () => {
    if (opponentMode.selectedIndex === 1) {
        previousCell.innerText = ''
        let position = turnHistory.innerHTML.lastIndexOf('Player');
        turnHistory.innerHTML = turnHistory.innerHTML.substring(0, position);

        circleTurn = !circleTurn;
        playerTurnIndicator.innerText = `${circleTurn ? "O" : "X"}'s player turn!`
        turnCount--;
        previousCell.removeEventListener('click', handleCellClick)
        previousCell.addEventListener('click', handleCellClick, { once: true })
    }
})

function startGame() {
    startScreen.style.display = 'none'      //Hide the start screen
    endGameDisplay.classList.remove('show') //Hide the end game display

    if (opponentMode.selectedIndex === 0) {
        undoButton.style.display = 'none';

        if (tableSize.selectedIndex === 0) {
            boardGame3x3.style.gridTemplateColumns = 'repeat(3, auto)'
            boardGame3x3.style.display = 'grid'

            cellElements3x3.forEach(cell => {
                cell.innerText = ''
                cell.removeEventListener('click', takeTurn)
                cell.addEventListener('click', takeTurn, { once: true })
            })
        }
        else if (tableSize.selectedIndex === 1) {
            boardGame5x5.style.gridTemplateColumns = 'repeat(5, auto)'
            boardGame5x5.style.display = 'grid'

            boardGame3x3.style.display = 'none'

            cellElements5x5.forEach(cell => {
                cell.innerText = ''
                cell.removeEventListener('click', takeTurn)
                cell.addEventListener('click', takeTurn, { once: true })
            })
        }
        else {
            boardGame7x7.style.gridTemplateColumns = 'repeat(7, auto)'
            boardGame7x7.style.display = 'grid'

            boardGame3x3.style.display = 'none'
        }
    }
    else {
        if (tableSize.selectedIndex === 0) {
            boardGame3x3.style.gridTemplateColumns = 'repeat(3, auto)'
            boardGame3x3.style.display = 'grid'

            cellElements3x3.forEach(cell => {
                cell.innerText = ''
                cell.removeEventListener('click', handleCellClick)
                cell.addEventListener('click', handleCellClick, { once: true })
            })
        }
        else if (tableSize.selectedIndex === 1) {
            boardGame5x5.style.gridTemplateColumns = 'repeat(5, auto)'
            boardGame5x5.style.display = 'grid'

            boardGame3x3.style.display = 'none'

            cellElements5x5.forEach(cell => {
                cell.innerText = ''
                cell.removeEventListener('click', handleCellClick)
                cell.addEventListener('click', handleCellClick, { once: true })
            })
        }
        else {
            boardGame7x7.style.gridTemplateColumns = 'repeat(7, auto)'
            boardGame7x7.style.display = 'grid'

            boardGame3x3.style.display = 'none'
        }
    }

    document.getElementById('playing-screen').style.display = 'flex'    //Display playing screen

    circleTurn = true      /* 'O' go first */
    countdown.innerText = '';
    turnCount = 0
    playerTurnIndicator.innerText = 'O\'s player turn!'
    turnHistory.innerText = '';
    startTime = null;
}


/* Step
1. Place mark
2. Check draw
3. Check win
4. Swap turn */
function handleCellClick(e) {
    let cell = e.target
    previousCell = cell
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

    //placeMark
    placeMark(cell, currentClass)

    /* Insert turn history */
    turnHistory.innerHTML += `Player ${circleTurn ? 'O' : 'X'}: ${cell.id} \n`;

    if (checkWin(currentClass, turnCount) != null) {
        checkWin(currentClass, turnCount)

        setTimeout(() => {
            endGameDisplay.classList.add('show')
        }, 500)
    }
    else {
        swapTurn()

        playerTurnIndicator.innerText = `${circleTurn ? "O" : "X"}'s player turn!`

        // after one player choose position for their mark
        // 
        startTime = Date.now()
        const intervalID = setInterval(() => {
            countdown.innerText = `00:0${parseInt((Date.now() - startTime) / 1000)}`
            if (Date.now() - startTime >= 10000) {
                clearInterval(intervalID)
                countdown.innerText = 'Time out!'
                swapTurn()
                playerTurnIndicator.innerText = `${circleTurn ? "O" : "X"}'s player turn!`
            }
        }, 1000);

        countdown.innerText = '';
    }
}


function placeMark(cell, currentClass) {
    cell.innerText = currentClass
    turnCount++;
}

function checkWin(currentClass, turnCount) {
    if (tableSize.selectedIndex == 0) {
        if (checkWinConditions(currentClass, cellElements3x3, WINNING_COMBINATIONS_LIST_3x3) === true) {
            winMessage.innerText = `${circleTurn ? "O's" : "X's"} player wins!`;
            return 'win'
        }
        else if (turnCount === 9) {
            winMessage.innerText = "It's a draw!";
            return 'draw'
        }
    }
    else {
        if (checkWinConditions(currentClass, cellElements5x5, WINNING_COMBINATIONS_LIST_5x5) === true) {
            winMessage.innerText = `${circleTurn ? "O's" : "X's"} player wins!`;
            return 'win'
        }
        else if (turnCount === 25) {
            winMessage.innerText = "It's a draw!";
            return 'draw'
        }
    }

    return null
}

function swapTurn() {
    circleTurn = !circleTurn;   /* This one need detailed explaination rather than just mere thought */
}

/* Algorithm
Approach: We don't check based on the current marks on the board
We check the winner based on the pre-defined winning combinations 
that then, check current marks on the board 

1. 1st LOOP: Loop through each possibilities (9 in total)
2. Each possibility is an array contain 3 consecutive numbers
3. 2nd LOOP: We use those 3 number as indexes to loop through the array of cell elements
4. First is '0', then '1', then '2'. If all 3 indexes have same mark 
-> return win and stop 2nd loop and then the first loop. 
5. If not match, end the 1st possibility and continue to next one (4, 5, 6)
*/
function checkWinConditions(currentClass, cellElements, WINNING_COMBINATIONS) {
    return WINNING_COMBINATIONS.some((oneCombination) => {
        return oneCombination.every((index) => {
            return cellElements[index].innerText === currentClass;
        })
    })
}

/* Disabled features and Unused functions in "1-player" mode: Undo button, placeMark()*/

/* AI Player
1. If human (O's)-> handleCellClick(e)
2. If non-human (X's) -> minimax
*/
function takeTurn(e) {
    let x = [];
    let botSpot, startTime, randomId = '';

    let humanCell = e.target
    humanCell.innerText = CIRCLE_CLASS;
    turnCount++;

    /* Insert turn history */
    turnHistory.innerHTML += `Player O: ${humanCell.id} \n`;

    if (checkWin(CIRCLE_CLASS, turnCount) != null) {
        checkWin(CIRCLE_CLASS, turnCount)

        setTimeout(() => {
            endGameDisplay.classList.add('show')
        }, 500)

    }

    else {
        swapTurn();
        playerTurnIndicator.innerText = "X's player turn!"

        if (tableSize.selectedIndex === 0) {
            cellElements3x3.forEach(cell => {
                if (cell.innerHTML === '') x.push(cell)
            })

            // findBestSpot(x, cellElements) = cell
            // cell.innerText = X_CLASS
            // turnHistory.innerHTML += `Player X: ${cell.id} \n`;

            if (turnCount < 2) {
                let index = parseInt(humanCell.id.at(1))
                if (index === 1) index++
                else index--;
                randomId = humanCell.id.at(0) + index

                x.forEach(cell => {
                    if (cell.id === randomId) cell.innerText = X_CLASS
                })

                turnHistory.innerHTML += `Player X: ${randomId} \n`;
            } else {
                botSpot = findBestSpot(x, cellElements3x3)
                setTimeout(() => {
                    botSpot.innerText = X_CLASS
                    turnHistory.innerHTML += `Player X: ${botSpot.id} \n`
                }, 500);
            }
            turnCount++;

        }

        else if (tableSize.selectedIndex === 1) {
            cellElements5x5.forEach(cell => {
                if (cell.innerHTML === '') x.push(cell)
            })
            // findBestSpot(x, cellElements) = cell
            // cell.innerText = X_CLASS
            // turnHistory.innerHTML += `Player X: ${cell.id} \n`;

            if (turnCount < 2) {
                let index = parseInt(humanCell.id.at(1))
                if (index === 1) index++
                else index--;
                randomId = humanCell.id.at(0) + index

                x.forEach(cell => {
                    if (cell.id === randomId) cell.innerText = X_CLASS
                })

                turnHistory.innerHTML += `Player X: ${randomId} \n`;
            } else {
                botSpot = findBestSpot(x, cellElements5x5)
                setTimeout(() => {
                    botSpot.innerText = X_CLASS
                    turnHistory.innerHTML += `Player X: ${botSpot.id} \n`
                }, 500);
            }
            turnCount++;

            if (checkWin(X_CLASS, turnCount) != null) {
                checkWin(X_CLASS, turnCount)
        
                setTimeout(() => {
                    endGameDisplay.classList.add('show')
                }, 500)
        
            } else {
                swapTurn()
                playerTurnIndicator.innerText = "O's player turn!"
            }
        }

    }




    /* startTime = Date.now()
    const intervalID = setInterval(() => {
        countdown.innerText = `00:0${parseInt((Date.now() - startTime) / 1000)}`
        if (Date.now() - startTime > 10000) {
            clearInterval(intervalID)
            countdown.innerText = 'Time out!'
            swapTurn();
            playerTurnIndicator.innerText = "X's player turn!"
            takeTurn(e)
        }
    }, 1000);

    countdown.innerText = ''; */

}

/* 
Usage: Find the next best spot for X player by 
testing next two turn, one by X and one by O. Mostly for not getting lose.

arrayOfEmptySpots contains empty cells
-> Retrieve empty cells by using arrayOfEmptySpots
-> Each of empty cell = 'X'
1. Check win: 
    If X win: score = terminalPoint[0]
    If draw: score = terminalPoint[1]
    If X lose: score = terminalPoint[2]
    If not reach terminal state, continue step 2
2. Create new array to store remaining empty spots
3. 
*/
function findBestSpot(arrayOfEmptySpots, cellElements) {
    let bestMaxScore = -Infinity, bestCell, cellScore;
    let pseudoBoard, pseudoTurnCount;
    var terminalPoint3x3 = [-1, 0, 1]

    //Know only best score, don't what score belongs to which cell
    for (let i = 0; i < arrayOfEmptySpots.length; i++) {
        pseudoBoard = []        //Reset empty board
        pseudoTurnCount = turnCount;    //Reset pseudoTurnCount to current real turnCount
        arrayOfEmptySpots[i].innerText = X_CLASS;       //Testing next empty cell
        pseudoTurnCount++;
        cellScore = 0     //Reset the score for new cell

        cellElements.forEach(cell => {
            if (cell.innerHTML === '') pseudoBoard.push(cell)
        })

        if (tableSize.selectedIndex === 0) {
            cellScore = minimax3x3(pseudoBoard, pseudoTurnCount, terminalPoint3x3)
            if (cellScore > bestMaxScore) {
                bestMaxScore = cellScore
                bestCell = arrayOfEmptySpots[i]
            }
        }

        else {
            cellScore = minimax5x5(pseudoBoard, pseudoTurnCount)
            // Prioritiy: X win chance (bigger win) > Circle win chance (smaller win) > score (bigger than bestMaxScore win)
            if (cellScore != null && cellScore > bestMaxScore) {
                bestMaxScore = cellScore
                bestCell = arrayOfEmptySpots[i]
            }

            /* Reset tested spot */
            arrayOfEmptySpots[i].innerText = ''
        }
    }
    return bestCell;
}


/* X (Bot): max, Circle (Human): min */
function minimax3x3(pseudoBoard, pseudoTurnCount) {
    let score, bestMinScore = Infinity;
    let resultCircle, resultX;
    let terminalPoint = [-10, 0, 10];

    pseudoTurnCount++;
    for (let i = 0; i < pseudoBoard.length; i++) {
        score = null;
        pseudoBoard[i].innerText = CIRCLE_CLASS

        resultCircle = checkWin(CIRCLE_CLASS, pseudoTurnCount)
        resultX = checkWin(X_CLASS, pseudoTurnCount)

        if (resultCircle != null || resultX != null) {
            if (resultCircle === 'draw') score += terminalPoint[1]
            else if (resultCircle === 'win') score += terminalPoint[0]
            else if (resultX === 'win')
                score += terminalPoint[2]

            if (score < bestMinScore) bestMinScore = score
        }
        pseudoBoard[i].innerText = ''
    }

    return bestMinScore;
}

function minimax5x5(pseudoBoard, pseudoTurnCount) {
    let bestMinScore = Infinity;
    let isCircleWin, isX_Win, isThreeCircle, isThreeX;
    let score = null, terminalPoint = [-15, -10, -5, 0, 5, 10, 15];
    let boardForCountWin

    pseudoTurnCount++;
    for (let i = 0; i < pseudoBoard.length; i++) {
        pseudoBoard[i].innerText = CIRCLE_CLASS
        boardForCountWin = []

        isCircleWin = checkWin(CIRCLE_CLASS, pseudoTurnCount)
        /* isX_Win = checkWin(X_CLASS, pseudoTurnCount) */
        isThreeCircle = check3MarkFor5x5(CIRCLE_CLASS)
        isThreeX = check3MarkFor5x5(X_CLASS)

        if (isCircleWin != null || isX_Win != null) {
            if (isCircleWin === 'draw') score += terminalPoint[4]
            else if (isCircleWin === 'win') score += terminalPoint[0]
            /* else if (isX_Win === 'win')
                score += terminalPoint[7] */
        }
        else {
            pseudoBoard.forEach(cell => {
                if (cell.innerText === '') boardForCountWin.push(cell)
            })

            // Prioritize spot that allow only 1 chance to ALMOST win
            //over ones that allow 2 chances to ALMOST win 
            if (isThreeCircle === true) {
                predictedCountWin_Circle = countWin_OnPredictedThreeMarks(CIRCLE_CLASS, boardForCountWin)
                if (predictedCountWin_Circle > 1) score += terminalPoint[1] * (predictedCountWin_Circle)
                score += terminalPoint[2]
            }
            if (isThreeX === true) {
                predictedCountWin_X = countWin_OnPredictedThreeMarks(X_CLASS, boardForCountWin)
                if (predictedCountWin_X > 1) score += terminalPoint[6] * (predictedCountWin_X)
                score += terminalPoint[5]
            }
        }


        if (/* score != null && */ score < bestMinScore) bestMinScore = score
        pseudoBoard[i].innerText = ''
    }

    return bestMinScore
}

function check3MarkFor5x5(currentMark) {

    if (checkRow(currentMark)) return true          //Just check first 3 cells of each row
    else if (checkColunm(currentMark)) return true  //Just check first 3 cells of each column
    else if (checkDiagonal(currentMark)) return true
    else return null
}

function checkRow(currentMark) {
    let countRow, skipForRow = 0;

    for (let i = 0; i < cellElements5x5.length; i++) {
        countRow = 0
        skipForRow++
        for (let j = i; j <= i + 2; j++) {
            if (cellElements5x5[j].innerText === currentMark) countRow++;
            if (countRow === 3) {
                //Check cells in one or two heads of the chain is empty -> j can be at: beginning edge, middle, last edge
                if (i % 5 === 0) {
                    if (cellElements5x5[j + 1].innerText === '') return true
                }
                else if (i == 2 || i == 7 || i == 12 || i == 17 || i == 22)
                    if (cellElements5x5[i - 1].innerText === '') return true
                    else {
                        if (cellElements5x5[j + 1].innerText === '' || cellElements5x5[i - 1].innerText === '') return true
                    }
            }
        }
        if (skipForRow === 3) {
            i += 2;
            skipForRow = 0;
        }
    }

    return false
}

function checkColunm(currentMark) {
    let countCol;

    for (let i = 0; i < 15; i++) {
        countCol = 0
        for (let j = i; j <= i + 10; j += 5) {
            if (cellElements5x5[j].innerText === currentMark) countCol++;
            if (countCol === 3) {
                if (i < 5) {
                    if (cellElements5x5[j + 5].innerText === '') return true
                }
                else if (i >= 10 && i <= 14) {
                    if (cellElements5x5[i - 5].innerText === '') return true
                }
                else {
                    if (cellElements5x5[j + 5].innerText === '' || cellElements5x5[i - 5].innerText === '') return true
                }
            }
        }
    }

    return false
}

// Diagonal: All cell in first 3 rows, except cell #A3, #A11, A15
// Left to right: all cells whose index + 12 <= 24
// Right to left: All cells whose index + 8 <= 21
function checkDiagonal(currentMark) {
    let skipForRow = 0, countDiagonal;

    //Check rows valid for left-to-right diagonal check
    for (let i = 0; i <= 10; i += 5) {  //limit checked rows
        countDiagonal = 0;

        for (let k = i; k <= i + 2; k++) {  //limit checked cells
            countDiagonal = 0;
            skipForRow++;
            if (k != 2 || k != 10) {
                for (let j = k; j <= k + 12; j += 6) {  //limit checked diagonal cells
                    if (cellElements5x5[j].innerText === currentMark) countDiagonal++
                    if (countDiagonal === 3) return true
                }
            } else {
                if (skipForRow === 3) {
                    i += 2;
                    skipForRow = 0;
                }
            }
        }
    }

    //Check rows valid for right-to-left diagonal check
    for (let i = 4; i <= 14; i += 5) {
        countDiagonal = 0;

        for (let k = i; k >= i - 2; k--) {
            countDiagonal = 0;
            skipForRow++;
            if (k != 2 | k != 14) {
                for (let j = k; j <= k + 8; j += 4) {
                    if (cellElements5x5[j].innerText === currentMark) countDiagonal++
                    if (countDiagonal === 3) return true
                }
            } else {
                if (skipForRow === 3) {
                    i += 2;
                    skipForRow = 0;
                }
            }
        }
    }

    return false;
}

/* Add one more circle to remaining empty cells. If found cirlce win, win++ */
function countWin_OnPredictedThreeMarks(currentMark, boardGame) {
    let winCount = 0
    boardGame.forEach(cell => {
        cell.innerText = currentMark;
        if (checkWin(currentMark) === 'win') winCount++

        cell.innerText = ''
    })

    return winCount
}

/* If this circle spot is  */