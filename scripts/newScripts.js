//GLOBAL VARIABLES
const height = window.innerHeight * 0.8;
const width = window.innerWidth * 0.9;
const cellSize = 25;
const totalRows = Math.floor(height / cellSize) - 1;
const totalCols = Math.floor(width / cellSize) - 1;
let inProgress = false;
let justFinished = false;
let movingStart = false;
let movingEnd = false;
let createWalls = false; // if true, create walls through drag and if false create walls through click
let keepWalls = false;

class Node {
  constructor(row, col, id, status) {
    this.row = row;
    this.col = col;
    this.id = id;
    this.status = status; //start, end, wall or unvisited
    this.isVisited = false;
    this.prevNode = ""; // id of previous node
  }
}

class Grid {
  constructor() {
    this.grid = [];
    this.startNodeRow = Math.floor(totalRows / 4);
    this.startNodeCol = Math.floor(totalCols / 4);
    this.endNodeRow = Math.floor(3 * totalRows / 4);
    this.endNodeCol = Math.floor(3 * totalCols / 4);
  }

  generateGrid() {
    let gridHTML = `<table>`;
    let gridArray = [];
    for (let row = 0; row < totalRows; row++) {
      let currRow = [];
      gridHTML += `<tr>`;
      for (let col = 0; col < totalCols; col++) {
        let newNodeId = `${row}-${col}`;
        let newNodeClass = "";
        if (row === this.startNodeRow && col === this.startNodeCol) {
          newNodeClass = "start";
        } else if (row === this.endNodeRow && col === this.endNodeCol) {
          newNodeClass = "end";
        } else {
          newNodeClass = "unvisited";
        }
        //Instantiate a new Node object
        let node = new Node(row, col, newNodeId, newNodeClass);
        gridHTML += `<td class = ${newNodeClass} id = ${newNodeId}></td>`;
        currRow.push(node);
      }
      gridHTML += `</tr>`;
      gridArray.push(currRow);
    }
    this.grid = gridArray;
    gridHTML += `</table>`;
    return gridHTML;
  }
}

let gridObject = new Grid;
let gridHTML = gridObject.generateGrid();
let myGrid = gridObject.grid;
document.getElementById("tableContainer").innerHTML = gridHTML;


/* ------------------------- */
/* ---- MOUSE FUNCTIONS ---- */
/* ------------------------- */

let cells = document.getElementsByTagName("td");
for (let i = 0; i < cells.length; i += 1) {
  let startCellRow = gridObject.startNodeRow;
  let startCellCol = gridObject.startNodeCol;
  let endCellRow = gridObject.endNodeRow;
  let endCellCol = gridObject.endNodeCol;
  let startCellIndex = (startCellRow * totalCols) + startCellCol;
  let endCellIndex = (endCellRow * totalCols) + endCellCol;
  let currCellRowIdx = Math.floor(i / totalCols);
  let currCellColIdx = Math.floor(i % totalCols);

  cells[i].addEventListener("mousedown", (e) => {
    if (!inProgress && !e.button) {
      // clear board if just finished
      if (justFinished && !inProgress) {
        clearBoard(keepWalls = true);
        justFinished = false;
      }
      if (i == startCellIndex) {
        movingStart = true;
      } else if (i == endCellIndex) {
        movingEnd = true;
      } else {
        createWalls = true;
        // cells[i].className = "wall";
        // gridObject.grid[Math.floor(i / totalCols)][Math.floor(i / totalRows)].status = "wall";
        myGrid[currCellRowIdx][currCellColIdx].status = (myGrid[currCellRowIdx][currCellColIdx].status == "unvisited") ? "wall" : "unvisited";
        cells[i].className = myGrid[currCellRowIdx][currCellColIdx].status;
        console.log("mousedown");
        console.log(cells[i]);
        console.log(myGrid[currCellRowIdx][currCellColIdx]);
      }
    }
  });

  // cells[i].addEventListener("mouseup", () => {
  //   createWalls = false;
  //   movingStart = false;
  //   movingEnd = false;
  //   console.log("mouseup");
  // });

  cells[i].addEventListener("mouseenter", () => {
    if (!createWalls && !movingStart && !movingEnd) {
      return;
    }
    if (!inProgress) {
      if (movingStart && i != endCellIndex) {
        moveStartOrEnd(startCellIndex, i, "start", cells[i]);
      } else if (movingEnd && i != startCellIndex) {
        moveStartOrEnd(endCellIndex, i, "end", cells[i]);
      } else if (i != startCellIndex && i != endCellIndex && createWalls) {
        cells[i].className = "wall";
        // gridObject.grid[Math.floor(i / totalCols)][Math.floor(i / totalRows)].status = "wall";
        if (myGrid[currCellRowIdx][currCellColIdx].status == "unvisited") {
          myGrid[currCellRowIdx][currCellColIdx].status = cells[i].className;
        }
      }
      console.log("mouse enter", myGrid[currCellRowIdx][currCellColIdx]);
      console.log(cells[i].className);
    }
  });

  // cells[i].addEventListener("click", () => {
  //   if ((inProgress == false) && !(i == startCellIndex) && !(i == endCellIndex)) {
  //     if (myGrid[currCellRowIdx][currCellColIdx].status == "wall") {
  //       myGrid[currCellRowIdx][currCellColIdx].status = "unvisited";
  //       cells[i].className = "unvisited";
  //     }
  //     // myGrid[currCellRowIdx][currCellColIdx].status = (myGrid[currCellRowIdx][currCellColIdx].status == "unvisited") ? "walls" : "unvisited";
  //     // cells[i].className = myGrid[currCellRowIdx][currCellColIdx].status;
  //     console.log(myGrid[currCellRowIdx][currCellColIdx]);
  //     console.log(cells[i].className);
  //   }
  // });
}

let moveStartOrEnd = (prevIndex, newIndex, startOrEnd, newCell) => {
  var newCellRow = Math.floor(newIndex / totalCols);
  var newCellCol = newIndex % totalCols;
  var prevCellRow = Math.floor(prevIndex / totalCols);
  var prevCellCol = prevIndex % totalCols;
  var newCellElement = document.getElementById(`${newCellRow}-${newCellCol}`);
  var prevCellElement = document.getElementById(`${prevCellRow}-${prevCellCol}`);

  if (startOrEnd == "start") {
    if (newCellRow == myGrid.endNodeRow && newCellCol == myGrid.endNodeCol) {
      return;
    }
    console.log("Moving start to [" + newCellRow + ", " + newCellCol + "]")
    newCellElement.className = prevCellElement.className;
    prevCellElement.className = "unvisited";
    myGrid[prevCellRow][prevCellCol].status = "unvisited";
    // newCell.className = "start";
    myGrid[newCellRow][newCellCol].status = newCellElement.className;
    myGrid.startNodeRow = newCellRow;
    myGrid.startNodeCol = newCellCol;
  }
  //clearBoard(keepWalls = true);
  return;
}

// function moveSpecialNode(currNode) {
//   let currElement = document.getElementById(currNode.id);
//   let prevElement;
//   //Keep a track if prevElement was pressed or not
//   prevElement = document.getElementById(prevNode.id);
//   //Check if the node is a wall or end node or start node
//   if (mousePressed) {
//     if (
//       currNode.status !== "start" &&
//       currNode.status !== "end" &&
//       currNode.status !== "wall"
//     ) {
//       currElement.className = prevNode.status;
//       currNode.status = prevNode.status;
//       currNode.isClass = prevNode.status;
//       prevNode.status = "unvisited";
//       prevNode.isClass = "unvisited";
//       prevElement.className = "unvisited";
//     }
//     return currNode;
//   }
// }

let bodyElement = document.querySelector("body");
bodyElement.addEventListener("mouseup", () => {
  createWalls = false;
  movingStart = false;
  movingEnd = false;
  console.log("Mouseup in body")
});

/* ------------------------------------ */
/*-- Draggable Feature from W3 School-- */
/*------------------------------------- */

dragElement(document.getElementById("side-bar"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/* --- Draggable Feature ends ----- */



/* ------------------------ */
/*-- Class Declarations  -- */
/*------------------------- */

/* -------- Queue ------- */

class Queue {
  constructor() {
    this.items = new Array();
  }

  dequeue() {
    return this.items.shift();
  }

  enqueue(element) {
    this.items.push(element);
    return;
  }

  empty() {
    return this.items.length === 0;
  }

  clear() {
    this.items = new Array();
    return;
  }
}

/*------ Min Heap ----- */

class MinHeap {
  heap;
  constructor() {
    this.heap = [null];
  }

  insert = (num) => {
    this.heap.push(num);
    if (this.heap.length > 2) {
      let idx = this.heap.length - 1;
      while (this.heap[idx] < this.heap[Math.floor(idx / 2)]) {
        if (idx >= 1) {
          [this.heap[Math.floor(idx / 2)], this.heap[idx]] = [this.heap[idx], this.heap[Math.floor(idx / 2)]];
          if (Math.floor(idx / 2) > 1) {
            idx = Math.floor(idx / 2);
          } else {
            break;
          }
        }
      }
    }
  };

  remove = () => {
    let smallest = this.heap[1];
    if (this.heap.length > 2) {
      this.heap[1] = this.heap[this.heap.length - 1];
      this.heap.splice(this.heap.length - 1);
      if (this.heap.length == 3) {
        if (this.heap[1] > this.heap[2]) {
          [this.heap[1], this.heap[2]] = [this.heap[2], this.heap[1]];
        }
        return smallest;
      }
      let i = 1;
      let left = 2 * i;
      let right = 2 * i + 1;
      while (this.heap[i] >= this.heap[left] || this.heap[i] >= this.heap[right]) {
        if (this.heap[left] < this.heap[right]) {
          [this.heap[i], this.heap[left]] = [this.heap[left], this.heap[i]];
          i = 2 * i;
        } else {
          [this.heap[i], this.heap[right]] = [this.heap[right], this.heap[i]];
          i = 2 * i + 1;
        }
        left = 2 * i;
        right = 2 * i + 1;
        if (this.heap[left] == undefined || this.heap[right] == undefined) {
          break;
        }
      }
    } else if (this.heap.length == 2) {
      this.heap.splice(1, 1);
    } else {
      return null;
    }
    return smallest;
  };
}