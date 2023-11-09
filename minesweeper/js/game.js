'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG='🚩'
var gInterval
var gStartTime

var gBoard= {
    mineAroundCount:0,
    isShown:false,
    isMine:false,
    isMarked:false
}

const gLevel = {
    SIZE:4,
    MINES:3
}

const gGame={
    isOn:false,
    shownCount:0,
    markedCount:0,
    secsPassed:0,
    gameOver: false,
    lives:3,
    isHint:false,
    isLiveLost:false
}


function onInit(){    
   
    var elBtn=document.querySelector('.restart')
    elBtn.innerText='😀'
    var elLive=document.querySelector('.lives')
    elLive.innerText='Lives:❤❤❤'
    gGame.isOn=false
    gGame.gameOver=false
    gGame.lives=3
    unHint()
    stopTimer()
    var elTimer=document.querySelector('.timer')
    elTimer.innerText=0.00
    var elMsg=document.querySelector('.gameOver')
    if(!elMsg.classList.contains('hide'))   elMsg.classList.add('hide')
    var elMsgwin=document.querySelector('.youWon')
    if(!elMsgwin.classList.contains('hide'))   elMsgwin.classList.add('hide')
    gBoard=buildBoard()
    renderBored(gBoard)
    initMines()
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
            board[i][j].mineAroundCount=0
            board[i][j].isMine=false
            }
    }
    console.log(board)
    return board

}

function initMines(){
    if(gLevel.SIZE===4)   gLevel.MINES=3
    if(gLevel.SIZE===8)   gLevel.MINES=8
    if(gLevel.SIZE===12)  gLevel.MINES=18
    var elspan=document.querySelector('.updateMines')
    elspan.innerText=gLevel.MINES
}



function updateMines(plusMinus){
    var elspan=document.querySelector('.updateMines')
    var counter=+elspan.innerText+plusMinus
    elspan.innerText=counter
    console.log(isFull(gBoard))
}

function createCell(){
    return{
    mineAroundCount:0,
    isShown:false,
    isMine:false,
    isMarked:false,
    }
}

function renderBored(board){
    var strHTML = ''
	const elBoard = document.querySelector('.board')

	for (var i = 0; i < board.length; i++) {

		strHTML += '<tr>\n'

		for (var j = 0; j < board[i].length; j++) {
            var strCell=EMPTY
			var cellClass = getClassName({ i, j })
				strHTML += `\t<td class="closed cell ${cellClass}"  onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this,${i},${j})">${strCell}`
	
			strHTML += '</td>\n'
		}
		strHTML += '</tr>\n'
    }
	elBoard.innerHTML = strHTML
}

function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
    //console.log(cellClass,position)
	return cellClass
}



function renderCell(location, value) {
	const cellSelector = '.'+getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

function dark(elBtn){
var elBody=document.querySelector('body')
var elTable=document.querySelector('.board')
if(elBody.classList.contains('dark'))  {
    elBody.classList.remove('dark')
    elTable.classList.remove('dark')
    elBtn.innerText='Dark Mode'
}
else{
    elBody.classList.add('dark')
    elTable.classList.add('dark')
    elBtn.innerText='Light Mode'
} 
}

function changeBoardSize(elBtn){

    if(elBtn.innerText==='Easy')
    {
        gLevel.SIZE=4
        gLevel.MINES=3
        onInit()
    }
    if(elBtn.innerText==='Medium')
    {
        gLevel.SIZE=8
        gLevel.MINES=8
        onInit()
    }
    if(elBtn.innerText==='Hard')
    {
        gLevel.SIZE=12
        gLevel.MINES=18
        onInit()
    }
}

function findRendomCell(idxi,idxj){
var i=getRandomInt(0,gLevel.SIZE-1)
var j=getRandomInt(0,gLevel.SIZE-1)

while((idxi===i && idxj===j)||gBoard[i][j].isMine===true){
    var i=getRandomInt(0,gLevel.SIZE-1)
    var j=getRandomInt(0,gLevel.SIZE-1)
    console.log(i,j)
}
    return {i,j} 
}

function createMines(idxi,idxj){
    for(var k=0;k<gLevel.MINES;k++){
        var position=findRendomCell(idxi,idxj)
      //  console.log(position.i, position.j)
        gBoard[position.i][position.j].isMine=true
        //renderCell(position, MINE)
        setMinesNegsCount(position.i,position.j,gBoard)
    }
}


function onCellClicked(elcell,i,j){
    if(!gGame.isOn){
        createMines(i,j)
        startTimer()
        gGame.isOn=true
    }
    else if(gGame.isHint){
        pick(i,j)
        return
    }
    if(gGame.gameOver===true || elcell.innerText===FLAG) return
    open(elcell,i,j)
    console.log(isFull(gBoard))
    if((!gLevel.MINES) && isFull(gBoard)) youWon()
}   

function renderCell(position, value){
     var selector = getClassName(position)
     var elToCell = document.querySelector('.' + selector)
     elToCell.innerHTML = value
}


function setMinesNegsCount(rowIdx,colIdx,board){
   
for(var i = rowIdx - 1; i <= rowIdx + 1; i++){
    if(i < 0 || i >= board.length) continue

    for(var j = colIdx - 1; j <= colIdx + 1; j++){
        if(j < 0 || j >= board[i].length) continue
        if(i === rowIdx && j === colIdx) continue
        gBoard[i][j].mineAroundCount++
        //if(!gBoard[i][j].isMine)
             //renderCell({i,j}, gBoard[i][j].mineAroundCount)
    }
}}

function open(elcell,i,j){
    elcell.classList.remove('closed')
    if(gBoard[i][j].isMine===true) 
    { 
        elcell.innerText=MINE
        updateMines(-1)
        loseLife()
    }
    else if(gBoard[i][j].mineAroundCount) elcell.innerText=gBoard[i][j].mineAroundCount
    else elcell.innerText=EMPTY
    console.log(elcell.innerText,i,j)
    if(!elcell.innerText)  openNgs(gBoard,i,j)
}



function openNgs(board,rowIdx,colIdx){
   
    for(var i = rowIdx - 1; i <= rowIdx + 1; i++){
        if(i < 0 || i >= board.length) continue
    
        for(var j = colIdx - 1; j <= colIdx + 1; j++){
            if(j < 0 || j >= board[i].length) continue
            if(i === rowIdx && j === colIdx) continue
            const cellSelector = '.'+getClassName({i,j})
            var elNewCell=document.querySelector(cellSelector)
            if(elNewCell.classList.contains('closed'))  open(elNewCell,i,j)
        }
    }
}


function gameOver(){
    var elBtn=document.querySelector('.restart')
    elBtn.innerText='🙁'
    gGame.gameOver=true
    var elMsg=document.querySelector('.gameOver')
    elMsg.classList.remove('hide')
    stopTimer()
}

function youWon(){
    var elBtn=document.querySelector('.restart')
    elBtn.innerText='😎'
    //gGame.gameOver=true
    var elMsg=document.querySelector('.youWon')
    elMsg.classList.remove('hide')
    stopTimer()
}





function updateTimer() {
	const currentTime = new Date().getTime()
	const elapsedTime = (currentTime - gStartTime) / 1000
	document.querySelector('.timer').innerText = elapsedTime.toFixed(1)
}

function startTimer() {
	gStartTime = new Date().getTime()
	gInterval = setInterval(updateTimer, 60)
}

function stopTimer() {
	clearInterval(gInterval)
}

function onCellMarked(elCell,i,j) {
   if(gGame.gameOver)  return
    if(!elCell.innerText)  
    { 
        elCell.innerText=FLAG
        gBoard[i][j].isMarked=true
        updateMines(-1)
    }
    else if(elCell.innerText===FLAG)  
    {
        elCell.innerText=EMPTY
        gBoard[i][j].isMarked=false
        updateMines(1)
    } 
}

function loseLife(){
    gGame.lives--
    var elLive=document.querySelector('.lives')
    var str=elLive.innerText
    str=str.slice(0,-1)
    elLive.innerText=str
    var elMsg=document.querySelector('.loseLife')
    if(gGame.lives){
    elMsg.classList.remove('hide')
    setTimeout(()  =>  {elMsg.classList.add('hide')},2000)
    }
    if(!gGame.lives)   gameOver()
}

function hint(elHint){
    if(!gGame.isOn) {
        var elMsg=document.querySelector('.useHint')  
        elMsg.classList.remove('hide')
        setTimeout(()  =>  {elMsg.classList.add('hide')},2000)
    }
    else{
    elHint.classList.add('shine')
    gGame.isHint=true
    }  
}

function unHint(){
    var elHint
    var str=''
    for(var i=1;i<=3;i++){
        str=`.hint${i}`
        elHint=document.querySelector(str)
        elHint.classList.remove('shine')
    }
}

function pick(rowIdx,colIdx){/*
    for(var i = rowIdx - 1; i <= rowIdx + 1; i++){
        if(i < 0 || i >= gBoard.length) continue
    
        for(var j = colIdx - 1; j <= colIdx + 1; j++){
            if(j < 0 || j >=gBoard[i].length) continue

            if(gBoard[i][j].isMine===MINE) renderCell({i,j}, MINE)
            else if(gBoard[i][j].mineAroundCount) renderCell({i,j},gBoard[i][j].mineAroundCount)
            else renderCell({i,j},EMPTY)

        }
    }
*/
}




function isFull(board){
	var elCell
	var cellClass
	for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
			cellClass = `.cell-${i}-${j}`
   			elCell = document.querySelector(cellClass)
            if(!elCell.innerText && gGame.isOn && elCell.classList.contains('closed')) return false
            } }
    return true
}
