
function createMat(rows, cols) {
    const mat = []

    for (var i = 0; i < rows; i++) {
        const row = []
        
        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function renderBoard(board) {
    var strHtml = ''

    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        strHtml += '<tr>'
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            // TODO: figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black'
            var cellId = `cell-${i}-${j}`
            strHtml += `<td id="${cellId}" onclick="cellClicked(this)" class="${className}">${cell}</td>`
        }
        strHtml += '</tr>'
    }
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

// Convert a cell ID string to coord object
function getCellCoord(strCellId) {
    var coord = {}
    var parts = strCellId.split('-')

    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord
}
function getSelector(coord) {
    return `#cell-${coord.i}-${coord.j}`
}


// Move the player by keyboard arrows
function handleKey(event) {
	const i = gGamerPos.i
	const j = gGamerPos.j

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1)
			break
		case 'ArrowRight':
			moveTo(i, j + 1)
			break
		case 'ArrowUp':
			moveTo(i - 1, j)
			break
		case 'ArrowDown':
			moveTo(i + 1, j)
			break
	}
}

// add Restart button- with onclick function
function addRestartButton() {
	const elBody = document.querySelector('body')
	const elButton = document.createElement('button')
	elButton.className = 'restart-btn'
	elButton.innerText = 'Restart Game'
	elButton.onclick = function () {
		gBallsCount = 0
		gTotalBalls = 2
		initGame()
		elButton.remove()
		isWin = false
	}
	elBody.appendChild(elButton)
}


function getRandomInt(min, max) {
	var rand = Math.random()
	var randomInt = rand * (max - min) + min
	return Math.floor(randomInt)
}

function countNeighbors(rowIdx, colIdx, board) {
	var neighborsCount = 0

	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i >= board.length) continue

		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j >= board[i].length) continue
			if (i === rowIdx && j === colIdx) continue

			if (board[i][j].gameElement === 'BALL') neighborsCount++
		}
	}
	return neighborsCount
}

function moveTo(i, j) {
	const toCell = gBoard[i][j]
	// Calculate distance to make sure we are moving to a neighbor cell
	const iAbsDiff = Math.abs(i - gGamerPos.i)
	const jAbsDiff = Math.abs(j - gGamerPos.j)

	// If the clicked Cell is not one of the four allowed - exit
	if (iAbsDiff + jAbsDiff !== 1) {
		console.log('TOO FAR', iAbsDiff, jAbsDiff)
		return
	}
	//change position of gamer (from gGamerPos to toCell)
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
	renderCell(gGamerPos, '')
	gBoard[i][j].gameElement = GAMER
	gGamerPos = { i, j }
	renderCell(gGamerPos, GAMER_IMG)

	if (isWin) return
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	const cellSelector = '.' + getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}


function getRandomInt(min, max) {
	var rand = Math.random()
	var randomInt = rand * (max - min) + min
	return Math.floor(randomInt)
}

function countNeighbors(rowIdx, colIdx, board) {
	var neighborsCount = 0

	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i >= board.length) continue

		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j >= board[i].length) continue
			if (i === rowIdx && j === colIdx) continue

			if (board[i][j].gameElement === 'BALL') neighborsCount++
		}
	}
	return neighborsCount
}

// Returns the class name for a specific cell
function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}

function drawNum() {
    var randomNum = getRandomInt(0, gNums.length)
    var numDrew = gNums[randomNum]
    gNums.splice(randomNum, 1)
    return numDrew
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}