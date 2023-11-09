'use strict'

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function hideEl(elName, isHide) {
	const el = document.querySelector(elName)
	if (isHide) {
	  el.classList.add('hidden')
	} else {
	  el.classList.remove('hidden')
	}
  }