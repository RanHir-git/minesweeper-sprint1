'use strict'

var gBoard
var timerInterval = null
var timerMilliSeconds = 0
var hints = 0
var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var isHintMode = false
var lives = 3
var gLevel = {
    SIZE: 4,
    MINES: 2
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
    return board
}

function addMinesToBoard(board, rowIdx, colIdx) {
    const positions = []
    const boardSize = gLevel.SIZE
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (i === rowIdx && j === colIdx) continue
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
                        oncontextmenu="onCellMarked(this, ${i}, ${j}); return false;">
                            ${cellContent}
                        </td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}


function onCellClicked(elCell, rowIdx, colIdx) {
    const cell = gBoard[rowIdx][colIdx]
    if (!gGame.isOn) { // first click
        addMinesToBoard(gBoard, rowIdx, colIdx)
        setMinesNegsCount(gBoard)
        gGame.isOn = true
        startTimer()
    }
    else if (cell.isRevealed || cell.isMarked) return
    if (isHintMode) {
        if (!cell.isRevealed) {
            revealHint(rowIdx, colIdx)
            isHintMode = false
        }
        return
    }
    if (cell.isMine) { // clicked on a mine
        elCell.innerHTML = '💣'
        elCell.classList.add('revealed')
        setTimeout(() => {
            cell.isRevealed = false
            elCell.innerHTML = ''
            elCell.classList.remove('revealed')
        }, 1000)
        lives--
        updateLivesDisplay()
        if (lives === 0) {//lose condition
            setTimeout(() => {
                gameOver(false)
            }, 100)
        }
        console.log('you stepped on a mine! ')
        console.log('lives left: ', lives)
        return
    }
    gGame.revealedCount++
    cell.isRevealed = true
    elCell.classList.add('revealed')
    elCell.innerHTML = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
    if (cell.minesAroundCount > 0) {
        elCell.classList.add(`mines-${cell.minesAroundCount}`)
    }
    if (cell.minesAroundCount === 0) expandReveal(gBoard, rowIdx, colIdx)
    if (checkGameOver()) {//win condition
        setTimeout(() => {
            gameOver(true)
        }, 100)
    }
}

function onCellMarked(elCell, i, j) {
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
    if (checkGameOver()) {   //win condition on flag
        gameOver(true)
    }
}

function setDifficulty(size) {
    switch (size) {
        case 4:
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break
        case 8:
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break
        case 12:
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break
    }
    const elBtn = document.querySelector('.smiley button')
    resetGame(elBtn)
}

function gameOver(win) {
    var elSmiley = document.querySelector('.smiley button')
    clearInterval(timerInterval)
    if (win) {
        elSmiley.innerText = '😎'
        alert(`You Won! Time: ${document.getElementById('timer').innerText}`)
    }
    else {
        elSmiley.innerText = '🤯'
        alert('Game Over! You have lost all lives!')
    }
}

function resetGame(elBtn) {
    clearInterval(timerInterval)
    timerMilliSeconds = 0
    updateTimerDisplay()
    lives = 3
    updateLivesDisplay()
    hints = 0
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`hint${i}`).classList.remove('used')
    }
    gGame.isOn = false
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
    elBtn.innerText = '😃'
    timerMilliSeconds = 0
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

function checkGameOver() {
    const totalCells = gLevel.SIZE * gLevel.SIZE
    const totalMinesChecked = gGame.markedCount
    const revealedCells = gGame.revealedCount
    return totalCells === (revealedCells + totalMinesChecked)
}

function expandReveal(board, rowIdx, colIdx) {
    const cell = board[rowIdx][colIdx]
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const neighborCell = board[i][j]
            if (neighborCell.isRevealed || neighborCell.isMarked) continue
            neighborCell.isRevealed = true
            gGame.revealedCount++
            const elNeighbor = document.querySelector(`.cell-${i}-${j}`)
            elNeighbor.classList.add('revealed')
            elNeighbor.innerHTML = neighborCell.minesAroundCount > 0 ? neighborCell.minesAroundCount : ''
            if (neighborCell.minesAroundCount > 0) {
                elNeighbor.classList.add(`mines-${neighborCell.minesAroundCount}`)
            }
            if (neighborCell.minesAroundCount === 0) expandReveal(board, i, j)
        }
    }
}

function updateLivesDisplay() {
    const elLives = document.getElementById('lives')
    var hearts = ''
    for (var i = 0; i < lives; i++) {
        hearts += '❤️'
    }
    elLives.innerHTML = `Lives: ${hearts}`
}

function useHint(hintNumber) {
    if (!gGame.isOn) return //check if game started first
    const hintBulb = document.getElementById(`hint${hintNumber}`)
    if (!hintBulb.classList.contains('used') && !isHintMode) {
        isHintMode = true
        hintBulb.classList.add('used')
        console.log('Hint mode activated!')
    }
}

function revealHint(rowIdx, colIdx) {
    revealHintCell(rowIdx, colIdx)
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            revealHintCell(i, j)
        }
    }
    setTimeout(() => {
        hideHint(rowIdx, colIdx)
    }, 1500)
}

function hideHint(rowIdx, colIdx) {// turns back to the original cells
    hideHintCell(rowIdx, colIdx)
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            hideHintCell(i, j)
        }
    }
}
function revealHintCell(i, j) {
    const cell = gBoard[i][j]
    if (!cell.isRevealed) {
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.classList.add('revealed')
        if (cell.isMine) {
            elCell.innerHTML = '💣'
        } else {
            elCell.innerHTML = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
            if (cell.minesAroundCount > 0) {
                elCell.classList.add(`mines-${cell.minesAroundCount}`)
            }
        }
    }
}
function hideHintCell(i, j) {
    const cell = gBoard[i][j]
    if (!cell.isRevealed) {
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.classList.remove('revealed')
        elCell.innerHTML = ''
        if (cell.minesAroundCount > 0) {
            elCell.classList.remove(`mines-${cell.minesAroundCount}`)
        }
    }
}