// TODO: optimize for only cells changing

import P5 from "p5";
import { createNewBoard, setStroke, DOMsetup } from "./util";
import './style.scss'

import { Board } from "./Board";
const BACKGROUND =  "#333"
// Creating the sketch itself
const sketch = (p5: P5) => {
	let size = Number((document.getElementById('cell-config') as HTMLSelectElement).value);
	let myboard:Board;
  
	// variable configuration
	let myBoardSize = size;
	let WIDTH: number = 0;
	let HEIGHT: number = 0;
	let showStroke = false;
	let playing = false;
	let gameClock;

	// The sketch setup method 
	p5.setup = () => {
		// Creating and positioning the canvas
		let canvasSize = Math.max(p5.windowWidth/2, 400)
		myboard = createNewBoard(Number(size))
		DOMsetup(canvasSize);
		const canvas = p5.createCanvas(canvasSize, canvasSize);
		WIDTH = p5.width;
		HEIGHT = p5.width;
		canvas.parent("app");

		let cellConfig = document.getElementById('cell-config');
		cellConfig.addEventListener("change", function(e){
		  const selectedIndex = (e.target as unknown as HTMLOptionsCollection).selectedIndex
			const selectedInput = Number((e.target as HTMLSelectElement).options[selectedIndex].value)
			myboard = createNewBoard(selectedInput)
			myBoardSize = selectedInput
			if(selectedInput == 10){
				p5.loop()
			}
			else{
				p5.noLoop()
				p5.redraw();
			}
		})

		document.getElementById('cell-stroke').addEventListener('change',
		 (e) => setStroke(e, (res) => showStroke = res)
		)

		document.getElementById('tick').addEventListener('click', ()=>tick())
		document.getElementById('save').addEventListener('click', () => { 
			var lineArray = [];
			myboard.board.forEach(function (infoArray, index) {
					var line = infoArray.join(",");
					lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
			});
			var csvContent = lineArray.join("\n");
			window.open(csvContent)
		})
		document.querySelector('canvas').addEventListener('updatedBoard',
		 (e: CustomEvent) => {
			 console.log('updating board')
			JSON.parse(e.detail).forEach((row, r) => {
				 row.forEach((cell,c) => {
					if(cell === "true"){myboard.board[r][c] = true;}
					else{ myboard.board[r][c]  =  false}
				 })
			 });    
			 p5.redraw()
		}, false)


		document.querySelector('.board-controls').addEventListener('click', function(e){
			playing = !(playing)
			if(!playing){ 
				(e.target as HTMLButtonElement).textContent = "Play"
				clearInterval(gameClock) }
			else{ 	
				(e.target as HTMLButtonElement).textContent = "Pause"
				gameClock = setInterval(tick, myboard.size) }
		})
	
	}

	function tick(){
		if(myboard.board){
				let nextGen =  myboard.getNextGeneration()
				myboard.board = nextGen;
				p5.redraw() 
			}
	}

	p5.mousePressed = () => {
		if(p5.mouseX < WIDTH && p5.mouseY < HEIGHT){
			const x = Math.floor((p5.mouseX*myBoardSize)/WIDTH)
			const y = Math.floor((p5.mouseY * myBoardSize)/ HEIGHT)
			const val = myboard.board[y][x];
			myboard.board[y][x] = !val;
			p5.redraw()
		}
	}

	// The sketch draw method
	p5.draw = () => {

		p5.background(BACKGROUND);
		p5.strokeWeight(100/myboard.size);
		showStroke ? p5.stroke(0) : p5.noStroke();


		p5.push()
		for(let i = 0; i< myBoardSize; i++){
			p5.push()
			for(let j = 0; j< myBoardSize; j++){
				p5.fill(myboard.board[i][j] ? "green": "#333")
				p5.rect(0,0, WIDTH/myBoardSize, HEIGHT/myBoardSize);
				p5.translate(WIDTH/myBoardSize,0)
			}
			p5.pop()
			p5.translate(0, HEIGHT/myBoardSize)

		}
		p5.pop()
	};
};

new P5(sketch);
