'use strict'

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

function getRandomInt(min, max) {
    var rand = Math.random()
    var randomInt = rand * (max - min) + min
    return Math.floor(randomInt)
}