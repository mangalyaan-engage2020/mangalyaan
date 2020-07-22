"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greedyBFS = undefined;

var _utility = require("/src/utility.js");

var _script = require("./script.js");

function updateNeighbours(neighbours, endNode) {
  neighbours.forEach(function (neighbour) {
    neighbour.h = neighbour.weight * getDistance(neighbour, endNode);
    neighbour.f = neighbour.h;
  });
}
function backtrack(endNode, nodesToAnimate) {
  nodesToAnimate.push([endNode, "shortest"]);
  var currNode = new _script.Node();
  currNode = endNode.parent;
  while (currNode !== null) {
    nodesToAnimate.push([currNode, "shortest"]);
    currNode = currNode.parent;
  }
}
function getDistance(nodeA, nodeB) {
  var diagonal = document.getElementById("diagonal-flag").checked;
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);
  if (diagonal === false) {
    //Manhattan Distance
    return dx + dy;
  } else {
    if (dx > dy) {
      //Better results than using sqrt(2) and 1
      return 14 * dy + 10 * (dx - dy);
    }
    return 14 * dx + 10 * (dy - dx);
  }
}
var greedyBFS = function greedyBFS(nodesToAnimate, pathFound) {
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  var openList = new _utility.minHeap();
  startNode.h = getDistance(startNode, endNode);
  startNode.f = startNode.h;
  openList.push([startNode.f, startNode]);

  var _loop = function _loop() {
    currNode = new _script.Node();

    var currArr = openList.getMin();
    currNode = currArr[1];
    if (currNode.status == endNode.status) {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      return "break";
    }
    if (currNode.isVisited) {
      return "continue";
    }
    currNode.isVisited = true;
    nodesToAnimate.push([currNode, "visited"]);

    neighboursIndex = (0, _utility.getNeighbours)(currNode.row, currNode.col);

    var neighbours = [];
    neighboursIndex.forEach(function (indices) {
      var m = indices[0];
      var n = indices[1];
      var neighbour = new _script.Node();
      neighbour = _script.gridArray[m][n];
      neighbours.push(neighbour);
    });
    updateNeighbours(neighbours, endNode);
    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      nodesToAnimate.push([neighbour, "searching"]);
      openList.push([neighbour.f, neighbour]);
    }
  };

  _loop2: while (!openList.isEmpty()) {
    var currNode;
    var neighboursIndex;

    var _ret = _loop();

    switch (_ret) {
      case "break":
        break _loop2;

      case "continue":
        continue;}
  }

  while (!openList.isEmpty()) {
    var cell = new _script.Node();
    var arr = openList.getMin();
    cell = arr[1];
    if (cell.isVisited) {
      continue;
    }
    cell.isVisited = true;
    nodesToAnimate.push([cell, "visited"]);
  }
  openList.clear();
  return pathFound;
};
exports.greedyBFS = greedyBFS;