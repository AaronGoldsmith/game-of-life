import { createGridOfSize } from "./util";

type Icon = '🌕' | '🌑'
const liveCell:Icon = '🌕'
const deadCell:Icon = '🌑'

export class Board{
  board: Boolean[][];
  size: number;
  constructor(gameboard: Boolean[][]){
    this.board = gameboard;
    this.size = gameboard[0].length;
  }

  // optional param to set percent of cells alive
  populate(p: Number = 0.5){
    this.board.forEach( (row,i) => {
      row.forEach( (_,j) => {
        if(Math.random() < p){
          this.board[i][j] = true;
        }
      })
    })
  }

  show(): void{
    let str: String = '';
    this.board.forEach(row => {
      row.forEach(column => {
        if(column) str += liveCell;
        else str += deadCell;
      })
      str += '\n'
    })
    console.log(str);
  }

  // return active cells surrounding a given row and column
  getActiveNeighbors(cellRow: number, cellCol: number): number{
    if(!this.board){
      return;
    }
    let aliveNeighbors: number = 0;
    for(let r = cellRow -1; r <= cellRow + 1; r ++){
      if(r >= 0 && r < this.size){
        for(let c = cellCol -1; c <= cellCol + 1; c ++){
          if(c < 0 || c >= this.size || (r==cellRow && c==cellCol)) continue;
          else aliveNeighbors += Number(this.board[r][c])
        } 
      }
    }
    return aliveNeighbors;
  }

  getNextGeneration(): Boolean[][]{
    let nextGen:Boolean[][] = createGridOfSize(this.size);
    this.board.forEach( (row,i) => {
      row.forEach( (cell,j) => {
        let neighbors = this.getActiveNeighbors(i, j);
        if(neighbors && cell){
          if(neighbors < 2 || neighbors > 3) nextGen[i][j] = false;
          else nextGen[i][j] = true;
        }
        else if(neighbors == 3) nextGen[i][j] = true;
      })
    })
    return nextGen;
  }
}

// Testing CLI
// const b = createGridOfSize(45);
// let myboard = new Board(b);
// function animate(myboard){
//   myboard.populate(0.6);
// }
// animate(myboard)