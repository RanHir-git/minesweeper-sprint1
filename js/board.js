'use strict'

var gBoard
var timerInterval = null
var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var cell = {
    minesAroundCount: 4,
    isRevealed: false,
    isMine: false,
    isMarked: false
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const board = []
    const boardSize = gLevel.SIZE
    for (var i = 0; i < boardSize; i++) {
        board.push([])
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    addMinesToBoard(board)
    setMinesNegsCount(board)
    return board
}

function addMinesToBoard(board) {
    const positions = []
    const boardSize = gLevel.SIZE
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            positions.push({ i: i, j: j })
        }
    }
    for (var m = 0; m < gLevel.MINES; m++) {
        const randomIdx = getRandomInt(0, positions.length)
        const pos = positions[randomIdx]
        board[pos.i][pos.j].isMine = true
        positions.splice(randomIdx, 1)
    }
}

function setMinesNegsCount(board) {
    const boardSize = gLevel.SIZE
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = countNeighbors(i, j, board)
        }
    }
}
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            const cellContent = ''
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})"
                        oncontextmenu="onCellRightClicked(this, ${i}, ${j}); return false;">
                            ${cellContent}
                        </td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


function onCellClicked(elCell, rowIdx, colIdx) {
    const cell = gBoard[rowIdx][colIdx]
    if (!gGame.isOn) { // first click
        // startTimer()
        gGame.isOn = true
    }
    else if (cell.isRevealed || cell.isMarked) return
    gGame.revealedCount++
    cell.isRevealed = true
    elCell.classList.add('revealed')
    if (cell.isMine) { // clicked on a mine
        elCell.innerHTML = '💣'
    }
    else {
        elCell.innerHTML = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
    }
    // if (winCondition) {//win condition
    //     clearInterval(timerInterval)
    //     alert(`You Won! Time: ${document.getElementById('timer').innerText}`)
    // }
}

function onCellRightClicked(elCell, i, j) {
    const cell = gBoard[i][j]

    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked

    if (cell.isMarked) {
        elCell.innerHTML = '🚩'
        gGame.markedCount++
    } else {
        elCell.innerHTML = ''
        gGame.markedCount--
    }
}

function setDifficulty(size) {
    switch (size) {
        case 4:
            size = 4
            break
        case 8:
            size = 8
            break
        case 12:
            size = 12
            break
    }
    gLevel.size = size
    const elBtn = document.getElementById('newGame')
    resetGame(elBtn)
}

function resetGame(elBtn) {
    clearInterval(timerInterval)
    timerMilliSeconds = 0
    updateTimerDisplay()
    touchCounter = 0
    gBoard = createBoard(totalSize)
    renderBoard(gBoard)
    elBtn.disabled = false
}

//timers functions
function startTimer() {
    clearInterval(timerInterval)
    timerMilliSeconds = 0
    updateTimerDisplay()
    timerInterval = setInterval(() => {
        timerMilliSeconds += 10
        updateTimerDisplay()
    }, 10)
}
function updateTimerDisplay() {
    const elTimer = document.getElementById('timer')
    const totalSeconds = Math.floor(timerMilliSeconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const msms = Math.floor((timerMilliSeconds % 1000) / 10)
    elTimer.textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${msms.toString().padStart(2, '0')}`
}


function countNeighbors(rowIdx, colIdx, board) {
    var neighborsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}
