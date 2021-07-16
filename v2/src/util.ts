import { Board } from "./Board";

export function createGridOfSize(size: number){
  // define board as an array of boolean arrays. 
  let _board : Boolean[][] = [];

  for(let i = 0; i < size; i++){
    _board.push([]);
    for(let j = 0; j < size; j++){
      _board[i].push(false);
    }
  }
  return _board;
}


export function createNewBoard(myBoardSize: number): Board{
  const board = new Board(createGridOfSize(myBoardSize))
  board.populate();
  return board;
}

export function setStroke(e: Event, configure){
  configure((e.target as HTMLInputElement).checked)
}

export function DOMsetup(size){
  document.querySelector('#configs').setAttribute('style',`width:${size}`)
}
