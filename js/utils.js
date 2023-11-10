'use strict'

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}


function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}



function renderCell(location, value) {
	const cellSelector = '.'+getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}