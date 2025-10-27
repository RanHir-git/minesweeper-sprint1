'use strict'


function onCellClicked(elCell, rowIdx, colIdx) {
    console.log('onCellClicked - costumeMode:', costumeMode)
    const cell = gBoard[rowIdx][colIdx]
    if (costumeMode === 1) { //custom mode
        console.log('In costume mode block')
        cell.isMine = !cell.isMine // Toggle mine
        if (cell.isMine) {
            gLevel.MINES++
            elCell.innerHTML = '💣'
        } else {
            gLevel.MINES--
            elCell.innerHTML = ''
        }
         console.log('About to return from costume mode')
        return
    }
    console.log('After costume mode check - this should NOT print!')
    if (!gGame.isOn) { // first click
        if (costumeMode === 0) {
            addMinesToBoard(gBoard, rowIdx, colIdx)
            setMinesNegsCount(gBoard)
        }
        if (costumeMode != 1) {
            gGame.isOn = true
            startTimer()
        }
    }
    else if (cell.isRevealed || cell.isMarked) return   //does nothing if cell flagged/open already
    if (isHintMode) {   // hint mode
        if (!cell.isRevealed) {
            revealHint(rowIdx, colIdx)
            isHintMode = false
        }
        return
    }
    if (isSafeClickMode) return 
    if (cell.isMine) { // clicked on a mine
        elCell.innerHTML = '💣'
        elCell.classList.add('revealed-mine')
        lives--
        updateLivesDisplay()
        if (lives === 0) {//lose condition
            setTimeout(() => {
                gameOver(false, rowIdx, colIdx)
            }, 100)
        } else {
            // hide the mine if game continues (still have lives)
            setTimeout(() => {
                cell.isRevealed = false
                elCell.innerHTML = ''
                elCell.classList.remove('revealed-mine')
            }, 1000)
        }
        console.log('you stepped on a mine! ')
        console.log('lives left: ', lives)
        return
    }
    gLastMove = []
    revealCell(cell, rowIdx, colIdx)
    if (cell.minesAroundCount === 0) expandReveal(gBoard, rowIdx, colIdx) //call for full expand
    if (checkGameOver()) {//win condition
        setTimeout(() => {
            gameOver(true)
        }, 100)
    }
}


function revealCell(currCell, i, j) {
    if (gLastMove !== null && !currCell.isRevealed) { //save cell to gLastMove - for undo
        gLastMove.push({
            row: i,
            col: j,
            wasRevealed: currCell.isRevealed,
            minesAroundCount: currCell.minesAroundCount
        })
    }
    currCell.isRevealed = true  // reveal cell content, and update vars
    gGame.revealedCount++
    const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
    elCurrCell.classList.add('revealed')
    elCurrCell.innerHTML = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ''
    if (currCell.minesAroundCount > 0) {
        elCurrCell.classList.add(`mines-${currCell.minesAroundCount}`)
        return currCell
    }
}


function onCellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isRevealed) return
    if (costumeMode === 1) return //still making custom board
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


function expandReveal(board, rowIdx, colIdx) {  //recursive full expend
    const cell = board[rowIdx][colIdx]
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const neighborCell = board[i][j]
            if (neighborCell.isRevealed || neighborCell.isMarked) continue
            revealCell(neighborCell, i, j)
            if (neighborCell.minesAroundCount === 0) expandReveal(board, i, j)
        }
    }
}

function undoMove() {
    if (!gGame.isOn) {  //game hasnt started
        console.log('Game not started')
        return
    }
    if (!gLastMove || gLastMove.length === 0) { //zero moves
        console.log('No move to undo')
        return
    }
    console.log('Undoing move with', gLastMove.length, 'cells')
    for (const cellData of gLastMove) { //undo all cells of last move
        const cell = gBoard[cellData.row][cellData.col]
        const elCell = document.querySelector(`.cell-${cellData.row}-${cellData.col}`)
        cell.isRevealed = cellData.wasRevealed
        gGame.revealedCount--
        elCell.classList.remove('revealed')
        elCell.classList.remove(`mines-${cellData.minesAroundCount}`)
        elCell.innerHTML = ''
    }
    gLastMove = null
}

function checkGameOver() {
    if (costumeMode === 1) return false // dont check win durning custom mine placement
    const totalCells = gLevel.SIZE * gLevel.SIZE
    const totalMinesChecked = gGame.markedCount
    const revealedCells = gGame.revealedCount
    return totalCells === (revealedCells + totalMinesChecked)
}

function gameOver(win, mineRow = null, mineCol = null) {
    var elSmiley = document.querySelector('.smiley button')
    clearInterval(timerInterval)
    if (win) {
        elSmiley.innerText = '😎'
        addScore(timerMilliSeconds) //update scoreboard
        alert(`You Won! Time: ${document.querySelector('.timeDigits').innerText}`)
    }
    else {
        elSmiley.innerText = '🤯'
        showAllMines(mineRow, mineCol)  //the coordinates for the mine are for the end of game showing of the board
        alert('Game Over! You have lost all lives!')
    }
}

function showAllMines(rowIdx, colIdx) { //when lost
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine) {
                const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
                if (i === rowIdx && j === colIdx) continue
                else {
                    elCurrCell.innerHTML = '💣'
                    elCurrCell.classList.add('revealed')
                }
            }
        }
    }

}

