/*


// INTERFACE 

I think that the best way I should go about this is to implement 
a simple multidimensional array of bools. The array will basically just hold each
"cell's" value of on or off.

EDIT:
   Now i'm thinking that instead of two separate arrays I should just make an
   object "cell" which holds a location and a bool 


// IMPLEMENTATION + NECCESARY ATTRIBUTES

 - Typical GUI of Canvas
 - Beginning Settings will Control number of cells
 - Can stop and start the run at any point
 - Can click any cell to turn the cell on. 
 - Randomize arbitrary number of cells to be on/off
 - Start of each 'tick' should display all cells that are on
 - Each 'tick' should compute the cells that will be on and off in the next generation



  */

//Canvas Implementation
var can = document.getElementById("canvas"),
ctx = can.getContext("2d");


var eLeft = canvas.offsetLeft, eTop = canvas.offsetTop,
cWidth = canvas.width-eLeft,
cHeight  = canvas.height-eTop;

//2500 360000
var num_sqrs = 400, rc = Math.floor(Math.sqrt(num_sqrs));
var space = Math.floor(can.height/rc);

var cellCount = 0;
var Board; // for now lets just do a 100 by 100 Cells
var pos = [];
var deadCells = [], newCells = [];
var began = false;
var alarm;
var startingColor = "green";
var adultColor1 = "yellow";
var adultColor2 = "red";
var canvasGUI;

canvas.addEventListener('click', handleclick, false);

window.onload = function()
{
ctx.save();
instructions();
}
function goHome()
{
    location.reload();   
}
function changeIf(val)
{
console.log(val);

if(val>300){
  document.getElementById('len').value=300;
}
else if(val<10){
  document.getElementById('len').value=10;
}
document.getElementById('result').innerHTML=val;
}
function newBoard()
{
initBoard();
initCells();
}


function toPoint(iteration) //convert from one toPoint 
{

var i = parseInt(iteration/rc); //x cordinates
var j = iteration%rc; //y cordinates

return new Point(i,j);
}
function run()
{
var but = document.getElementById("run");
if(but.innerHTML == "Run"){
  document.getElementById("run").innerHTML="Stop";
  alarm = setInterval(tick,200);
}
else{
  document.getElementById("run").innerHTML="Run";
  clearInterval(alarm);
}
}
function start()
{
began = true;
ctx.clearRect(0,0,can.width,can.height);
newBoard();
drawCells();

document.getElementById("run").style.visibility = "visible";
document.getElementById("gen").style.visibility = "visible";
document.getElementById("res").style.visibility = "visible";
document.getElementById("tick").style.visibility = "visible";

}
function reset()
{
document.getElementById("run").innerHTML="Run";
clearInterval(alarm);
for(var i = 0;i<rc;i++)
{
  for(var j = 0;j<rc;j++)
  {
    Board[i][j].color = startingColor;
    Board[i][j].isOn = false;
  }
}
drawCells();
    location.reload()
}
function initBoard()
{
for(Board = [];Board.length < rc; Board.push([])); //add all the y's
}
function playG()
{
for(var i = 0;i<deadCells.length;i++){
  deadCells[i].isOn=false;
  deadCells[i].color=startingColor;
}
deadCells.length=0;
for(var j = 0;j<newCells.length;j++)
{
  newCells[j].isOn=true;
}
newCells.length=0;
}

function generate()
{
var j = 4;
if(rc<=100){j=8;}
  for(var i = 0;i<rc*8;i++)
  {	
    //console.log(rc);
    var rand = Math.floor(Math.random()*rc), 
      rand1 = Math.floor(Math.random()*rc);

    if(!Board[rand][rand1].isOn)
      cellSwitch(rand,rand1);
  }

  drawCells();


}
function tick()
{
for(var i = 0;i<rc;i++) //row
{
  for(var j = 0;j<rc;j++) //col
  {
    var curC = Board[i][j];
    var safeCheck = false;
    if(curC.isOn){

      if(getNeighbors(curC)==2){
        Board[i][j].color = adultColor1;
        console.log(i,j);
        safeCheck=true;
        //console.log("     lives on because of " + getNeighbors(curC) + " neighbors");
      }
      if(getNeighbors(curC)==3){
        Board[i][j].color = adultColor2;
        console.log(i,j);
        safeCheck=true;
      }
      if(getNeighbors(curC)>=4 || getNeighbors(curC)<=1)
      {
        deadCells.push(curC);
      }
      
    }
    else if(getNeighbors(curC)==3&&!safeCheck){
      newCells.push(curC);
    }
  }
}
playG();
ctx.clearRect(0,0,canvas.width,canvas.height);
drawCells();
}
function getNeighbors(cellA)
{
var row = cellA.Pt.R;
var col = cellA.Pt.C;
var Nbors = [];
var numOn = 0;
if(col<(rc-1)&&row<(rc-1))
  Nbors.push(Board[col+1][row+1]);

if(col<(rc-1))
   Nbors.push(Board[col+1][row]);

if(row<(rc-1))
   Nbors.push(Board[col][row+1]);

if(row>0&&col>0)
  Nbors.push(Board[col-1][row-1]); 

if(col>0)
  Nbors.push(Board[col-1][row]);

if(row>0)
   Nbors.push(Board[col][row-1]);

if(col>0&&row<(rc-1))
  Nbors.push(Board[col-1][row+1]);

if(col<(rc-1)&&row>0)
  Nbors.push(Board[col+1][row-1]);


for(var i = 0;i<Nbors.length;i++)
{
  if(Nbors[i].isOn){numOn++;}
}

return numOn;
//console.log("Safe Neighbors " + numOn);

}
function isCell(type)
{
if(type!=undefined && !isNaN(type.Pt.C)&&!isNaN(type.Pt.R)){
  return true;
}
return false;
}
function drawCells()
{
ctx.clearRect(0,0,can.width,can.height);
ctx.fillStyle = "Blue";
//console.log(pos.length);
for(var i = 0;i<pos.length;i++)
{
  var s = toPoint(i);
  //console.log(s);
  
  var row=s.R, col = s.C;
  var curCell = Board[col][row];

  if(curCell.isOn==true){ctx.fillStyle = curCell.color;}
  else{ctx.fillStyle = "#333";}
  ctx.fillRect(pos[i].X,pos[i].Y,space-.5,space-.5);
}
}

function initCells()
{
var row = 0;
var col = 0;
if(eLeft<rc && eTop < rc){
  for(var i = 0; i<can.height;i+=space){
    for(var j = 0; j < can.width; j+=space){
      ctx.fillStyle = "Blue";
      var pt = new Pixel(i,j);
      pos.push(pt);
      var P = new Point(row,col);
      if(!Board[col]){Board[col] = [];} //neccesary for initiializing the row
      Board[col][row] = new Cell(P);
      row++;
    }
    row = 0;
    col++;
  }
}
}
function cellSwitch(i,j)
{
//console.log(Board[i][j]);
getNeighbors(Board[i][j]);

if(Board[i][j].isOn==true)
{
  Board[i][j].isOn = false;
  Board[i][j].color = startingColor;
}
else{
  Board[i][j].isOn = true
}

}
function handleclick()
{

  var x = parseInt(event.pageX)-canvas.offsetLeft, 
  y = parseInt(event.pageY)-canvas.offsetTop;
  var pt = new Pixel(x,y); // pt holds value of x,y coordinate

  if(began){
  var row = 0;
  var col = 0;

  for(var i = 0; i<can.height;i+=space){
      for(var j = 0; j < can.width; j+=space){
        

        if(Math.abs((x-(i+(space/2))))<(space/2)&&Math.abs(y-(j+(space/2)) )<(space/2))  //
        {
          cellSwitch(row,col);
        }
        row++;

      }
      row = 0;
      col++;
    }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawCells();
}
else if(x>=450&&x<=560&&y>=520&&y<=565){
  var s = parseInt(document.getElementById("len").value);
  num_sqrs = Math.pow(s,2);
  rc = Math.floor(Math.sqrt(num_sqrs));
  space = Math.floor(can.height/rc);
  console.log(num_sqrs,rc,space);
  document.getElementById("cellCounter").style.visibility = "hidden";
  start();
}
}
function instructions()
{
var half = canvas.width/2;
ctx.lineWidth = 1.45;

ctx.fillStyle = "#333";
ctx.fillRect(0,0,can.width,can.height);
ctx.fillStyle = "red";
ctx.font = ("bold 2em Arial");
ctx.StrokeStyle = "black";
ctx.fillText("Game Of Life ",(half/2)-120,100);
ctx.strokeText("Game Of Life ",(half/2)-120,100);

ctx.fillStyle = "#C1CCD0";;
ctx.font = ("bold 1.8em 'Roboto, Sans' ");
ctx.fillText("Instructions: how to play GAME OF LIFE?",(half/2)-110, 150);
// ctx.strokeText("Instructions: how to LIFE?",(half/2)-110, 150);
ctx.font = ("bold 1.4em 'Courier New' ");
ctx.fillText("1) Click anywhere to add life to a cell ",(half/2)-90,200);
ctx.fillText("2) Click any cell to take it's life :( ",(half/2)-90,250);
// ctx.strokeText("2) Click any cell to take it's life :( ",(half/2)-90,250);
ctx.fillText("3) Tick button is used to ",(half/2)-90,300);
// ctx.strokeText("3) Tick button is used to ",(half/2)-100,300);
ctx.fillText("incremement generations by 1 step",(half/2)-50,330);
// ctx.strokeText("incremement generations by 1 step",(half/2)-70,330);

ctx.fillText("4) Run button starts the clock of 'life' ",(half/2)-90,390);
// ctx.strokeText("4) Run button starts the clock of 'life' ",(half/2)-100,390);
ctx.fillText("How many Cells would you like ",half/2-90,450);
// ctx.strokeText("How many Cells would you like ",half/2-90,450);
ctx.fillText("to have per row?",half/2-90,480);
// ctx.strokeText("to have per row?",half/2-90,480);

ctx.fillStyle="Red";
ctx.strokeStyle = "black";
ctx.fillRect(half+150,can.height-80,100,40);
ctx.lineWidth = 5;
ctx.strokeRect(half+150,can.height-80,100,40);
ctx.stroke();

ctx.fillStyle = "black";
ctx.fillText("Begin!",half+160,can.height-55);
ctx.restore();
}
function Pixel(x,y)
{
var pt = {X:x, Y:y};
return pt;
}

function Point(row,col){
var pt = {R:row, C:col};
return pt;
}

function Cell(point)
{
var C = {Pt:point, isOn:false, color:"green"};
return C;
}


