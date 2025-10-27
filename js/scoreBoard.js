'use strict'

var bestScores = {
    beginner: [],
    medium: [],
    expert: []
}

function saveScores() {
    const category = getDifficultyCategory()
    const scores = bestScores[category]
    localStorage.removeItem(category + '1')
    localStorage.removeItem(category + '2')
    localStorage.removeItem(category + '3')
    for (var i = 0; i < scores.length; i++) {
        localStorage.setItem(category + (i + 1), scores[i])
    }
}

function loadScores() {
    loadDiffScores('beginner')  // Load beginner scores
    loadDiffScores('medium')    // Load medium scores
    loadDiffScores('expert')    // Load expert scores
}

function loadDiffScores(diff) {
    bestScores[diff] = []
    for (var i = 1; i <= 3; i++) {
        const score = localStorage.getItem(diff + i)
        if (score) {
            bestScores[diff].push(Number(score))
        }
    }
}

function getDifficultyCategory() {
    switch (gLevel.SIZE) {
        case 4:
            return 'beginner'
        case 8:
            return 'medium'
        case 12:
            return 'expert'
        default:
            return 'beginner'
    }
}

function addScore(time) {
    const category = getDifficultyCategory()
    bestScores[category].push(time)
    bestScores[category].sort((a, b) => a - b)
    bestScores[category] = bestScores[category].slice(0, 3)
    saveScores()
    displayScores()
}

function displayScores() {
    const categories = ['beginner', 'medium', 'expert']
    for (var category of categories) {
        const scores = bestScores[category]
        const elScoreList = document.getElementById(`${category}-scores`)
        if (scores.length === 0) elScoreList.innerHTML = '<li>None</li>'
        else {
            var html = ''
            for (var i = 0; i < scores.length; i++) {
                const time = formatTime(scores[i])
                html += `<li>${time}</li>`
            }
            elScoreList.innerHTML = html
        }
    }
}