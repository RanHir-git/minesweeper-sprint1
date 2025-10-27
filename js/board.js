'use strict'

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
            const cellContent = (costumeMode === 1 && cell.isMine) ? '💣' : ''  // if we are still making the board in custom
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

function setCostumeMode() { //costumMode=0 : normal, =1: setting mines, =2: playing custom mode
    if (costumeMode === 0) {    //start setting mines stage
        var tableSize = +prompt('Enter Table Size (num of cells on each column/row): ')
        if (!tableSize) {
            alert('Please enter a valid size')
            return
        }
        gLevel.SIZE = tableSize
        gLevel.MINES = 0
        const elBtn = document.querySelector('.smiley button')
        resetGame(elBtn)
        costumeMode = 1
        alert('Click on cells to place mines. When done, click "Custom" again.')
    }
    else if (costumeMode === 1) {   //end setting stage
        if (gLevel.MINES === 0) {
            alert('Please place at least one mine before starting!')
            return
        }
        costumeMode = 2
        setMinesNegsCount(gBoard)
        gGame.isOn = true
        startTimer()
        renderBoard(gBoard) //to show the mines
        alert('Game started! Good luck!')
    }
    else {
        costumeMode = 0
        const elBtn = document.querySelector('.smiley button')
        resetGame(elBtn)
    }
}