'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG='🚩'


var gBoard= {
    mineAroundCount:0,
    isShown:false,
    isMine:false,
    isMarked:true
}

const gLevel = {
    SIZE:4,
    MINES:2
}

const gGame={
    isOn:false,
    shownCount:0,
    markedCount:0,
    secsPassed:0,
}


function onInit(){
    var elBtn=document.querySelector('.restart')
    elBtn.innerText='😀'
    gGame.isOn=false
   // minesAmount()
    gBoard=buildBoard()
    renderBored(gBoard)
    
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
				strHTML += `\t<td class="closed cell ${cellClass}"  onclick="onCellClicked(this, ${i}, ${j})">${strCell}`
	
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

    if(elBtn.innerText==='4')
    {
        gLevel.SIZE=4
        gLevel.MINES=2
        onInit()
    }
    if(elBtn.innerText==='8')
    {
        gLevel.SIZE=8
        gLevel.MINES=8
        onInit()
    }
    if(elBtn.innerText==='12')
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
    findRendomCell(idxi,idxj)
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
        gGame.isOn=true
        createMines(i,j)
    }
    open(elcell,i,j)
    
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
    { elcell.innerText=MINE
        gameOver()
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

/*function minesAmount(){
    var elBtn=document.querySelector(minesAmount)
    console.log('elBtn:',elBtn)
  //  var str=elBtn.innerText+=gLevel.MINES
  //  elBtn.innerText=str
}*/

function gameOver(){
    var elBtn=document.querySelector('.restart')
    elBtn.innerText='🙁'
}
