// important nomenclature note: make sure you're properly differentiating "tiles" and "sprites"

var canvas = document.getElementById("main");
var context = canvas.getContext("2d");

var tilemap = { // these should be hardcoded based on the spritesheet file and never change during running
  image: "tilemap.png",
  cols: 4,
  rows: 4,
  spriteSize: 16,
  spriteConnections: [
    // values start from the top side of the sprite in its orientation on the spritesheet and go clockwise from there
    [null, "blue", null, "blue"],
    [null, null, "blue", "blue"],
    [null, "blue", "blue", "blue"],
    ["blue", "blue", "blue", "blue"],
    [null, "orange", null, "orange"],
    [null, null, "orange", "orange"],
    [null, "orange", "orange", "orange"],
    ["orange", "orange", "orange", "orange",],
    ["orange", "blue", "orange", "blue"],
    ["blue", "orange", "orange", "blue"],
    [null, null, null, "blue"],
    [null, null, null, "orange"],
    [null, null, null, null],
  ],
  rotateConnections: function(index, rotation) {
    // returns connections array of tile at index after rotating clockwise the appropriate number of times
    var duped = this.spriteConnections[index].concat(this.spriteConnections[index]);
    var result = duped.slice(4 - rotation, 8 - rotation);
    return result;
  }
}

var image = new Image(128, 128);
image.src = tilemap.image;

image.onload = function() {
  for (var r = 0; r < map.rows; r++) {
    for (var c = 0; c < map.cols; c++) {
      var tile = map.getTile(c, r);

      var tileX = (tile.spriteId % tilemap.cols) * tilemap.spriteSize;
      var tileY = (Math.floor(tile.spriteId / tilemap.cols)) * tilemap.spriteSize;
      // save correct connection array to gamestate
      map.tileConnections[(r * map.cols) + c] = tilemap.rotateConnections(tile.spriteId, tile.rotation);
      // clearRect where tile will go (not necessary yet)
      // save default transform
      context.save();
      // move transform to center of cell at row, col
      context.translate((c + 0.5) * map.tileSize, (r + 0.5) * map.tileSize);
      // rotate transform appropriate amount
      context.rotate(tile.rotation * Math.PI / 2);
      // draw image around center point
      context.drawImage(
        image, // image
        tileX, // source x
        tileY, // source y
        tilemap.spriteSize, // source width
        tilemap.spriteSize, // source height
        -0.5 * map.tileSize, // target x
        -0.5 * map.tileSize, // target y
        map.tileSize, // target width
        map.tileSize // target height
      );
      //reset transform
      context.restore();
    }
  }
}

var map = {
  cols: 4, // # of columns on canvas
  rows: 4, // # of rows on canvas
  tileSize: 128, // size of tile on output canvas
  tileIndices: [ // index on spritesheet of tile to be drawn 
    12, 12, 12, 12,
    10, 0, 0, 10, 
    11, 4, 4, 11,
    12, 12, 12, 12
  ],
  tileRotations: [ // # of times sprite should be rotated 90° clockwise before drawing (from 0-3)
    0, 0, 0, 0,
    2, 0, 0, 0,
    2, 0, 0, 0,
    0, 0, 0, 0
  ],
  tileConnections: [],
  getTile: function(col, row) { // gets information required to draw tile by position
      // finding myself needing access to index based on row, col or row, col based on index interchangeably a lot, think about reworking somehow
      var index = (row * map.cols) + col;
      return {
          spriteId: this.tileIndices[index],
          rotation: this.tileRotations[index]
      }
  },
  isConnected: function(startIndex, destinationIndex) { // checks to see if a connected path exists between two tiles (given as indices)

    // a few things to note about this algorithm:
    // - it can fail if there's a closed loop on the board; not sure we need to actively account for this, it's probably fine to just make sure that's never possible 
    // - it doesn't correctly handle paths that branch (will need to be fixed)
    // - it doesn't correctly handle multicolor tiles because it doesn't remember what input it "came in on" (will need to be fixed)
    // - it returns false if startIndex and destinationIndex are the same, which is probably fine 
    var visitedIndices = [];
    var pathFound = false;
    var currentTile = {
      index: startIndex,
      row: Math.floor(startIndex / this.cols),
      col: startIndex % this.cols
    }
    visitedIndices.push(currentTile.index);
    for(var i = 0; i < 4; i ++){    
      if (this.tileConnections[currentTile.index][i]){
        // check wherever there's actually an output on the tile   
        if (i % 2 == 0) {
          // we care about vertical axis
          var checkedRow = currentTile.row + (i - 1) // some convenient mathy nonsense
          if (checkedRow >= 0 && checkedRow <= (map.rows - 1)) {
            var checkedTile = {
              row: checkedRow,
              col: currentTile.col,
              index: ((checkedRow) * this.cols) + currentTile.col
            }
            if(!visitedIndices.includes(checkedTile.index)) {
              //checks if connection matches
              if (this.tileConnections[currentTile.index][i] == this.tileConnections[checkedTile.index][(i + 2) % 4]) {
                if (checkedTile.index == destinationIndex) {
                  pathFound = true;
                }
                else {
                  visitedIndices.push(currentTile.index);
                  currentTile = checkedTile;
                  i = 0;
                }
              }
            }
          }
        }
        else {
          // we care about horizontal axis
          var checkedCol = currentTile.col + (2 - i) // more convenient mathy nonsense
          if (checkedCol >= 0 && checkedCol <= (map.cols - 1)) {
            var checkedTile = {
              row: currentTile.row,
              col: checkedCol,
              index: (currentTile.row * this.cols) + checkedCol
            }
            if(!visitedIndices.includes(checkedTile.index)) {
              //checks if connection matches
              if (this.tileConnections[currentTile.index][i] == this.tileConnections[checkedTile.index][(i + 2) % 4]) {
                if (checkedTile.index == destinationIndex) {
                  pathFound = true;
                }
                else {
                  visitedIndices.push(currentTile.index);
                  currentTile = checkedTile;
                  i = 0;
                }
              }
            }
          }
        }
      }
    }
    return pathFound;
  }
}

function handleButtonClick() {
  result = map.isConnected(document.getElementById("start").value, document.getElementById("end").value);
  document.getElementById("result-text").innerHTML = result ? "Connected!" : "Not connected!";
}