'use strict'

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function isFull(board){
	var elCell
	var cellClass
	for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
			cellClass = `cell-${i}-${j}`
   			elCell = document.querySelector(cellClass)
            if(!elCell.innerText) return false
            } }
    return true
}
