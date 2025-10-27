'use strict'


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
    const elTimer = document.querySelector('.timeDigits')
    elTimer.textContent =formatTime(timerMilliSeconds)
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const msms = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${msms.toString().padStart(2, '0')}`
}