'use strict'
var timerInterval = null
var timerMilliSeconds = 0
var gBoard
var hints = 0
var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var costumeMode = 0
var gLastMove = null
// var moon = 🌙
var darkMode = false
var safeClickCounter = 0
var isSafeClickMode = false
var isHintMode = false
var lives = 3
var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    loadScores()
    displayScores()
    gBoard = buildBoard()
    renderBoard(gBoard)
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
    isSafeClickMode = false
    costumeMode = 0
    gLastMove = null
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

function updateLivesDisplay() {
    const elLives = document.getElementById('lives')
    var hearts = ''
    for (var i = 0; i < lives; i++) {
        hearts += '❤️'
    }
    elLives.innerHTML = `Lives: ${hearts}`
}
