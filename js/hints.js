'use strict'



function useHint(hintNumber) {  
    if (!gGame.isOn) return //check if game started first
    const hintBulb = document.getElementById(`hint${hintNumber}`)
    if (!hintBulb.classList.contains('used') && !isHintMode) {
        isHintMode = true   //next press in onCellClicked will use hint
        hintBulb.classList.add('used')  //change lightbulb style
        console.log('Hint mode activated!')
    }
}

function revealHint(rowIdx, colIdx) {   //reveal the cell and all adjacent cells
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
function revealHintCell(i, j) { //reveal 1 cell
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

function hideHintCell(i, j) {   //turn back 1 cell
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


function safeClick() {  // start safeClick mode
    if (!gGame.isOn) return
    if (safeClickCounter < 3 && !isSafeClickMode) {
        isSafeClickMode = true
        console.log('Safe-Click mode activated!')
        revealSafeClick()
    }
}

function revealSafeClick() {    //reveal random safe cell (adds all safe to positions, and then choosing randomly from them)
    const positions = []
    const boardSize = gLevel.SIZE
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (gBoard[i][j].isRevealed || gBoard[i][j].isMine) continue
            positions.push({ i: i, j: j })
        }
    }
    const randomIdx = getRandomInt(0, positions.length)
    const pos = positions[randomIdx]
    revealHintCell(pos.i, pos.j)
    setTimeout(() => {
        hideHintCell(pos.i, pos.j)
        isSafeClickMode = false
        safeClickCounter++
    }, 1500)
}

function darkModeSwitch(elButton) {
    const body = document.body
    body.classList.toggle('dark-mode')
    if (body.classList.contains('dark-mode')) {
        elButton.textContent = '🌙'
    } else {
        elButton.textContent = '☀️'
    }
}