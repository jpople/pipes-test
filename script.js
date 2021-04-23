var canvas = document.getElementById("main");
var context = canvas.getContext("2d");

var image = new Image(128, 128);
image.src = "tilemap.png"

image.onload = function() {
  for (var r = 0; r < map.outputRows; r++) {
    for (var c = 0; c < map.outputCols; c++) {
      var tile = map.getTile(c, r);
      console.log(tile);

      var tileX = (tile.spriteId % map.spriteCols) * map.spriteSize;
      var tileY = (Math.floor(tile.spriteId / map.spriteCols)) * map.spriteSize;

      // clearRect where tile will go (not necessary yet)
      // save default transform
      context.save();
      // move transform to center of cell at row, col
      context.translate((c + 0.5) * map.outputSize, (r + 0.5) * map.outputSize);
      // rotate transform appropriate amount
      context.rotate(tile.rotation * Math.PI / 2);
      // draw image around center point
      context.drawImage(
        image, // image
        tileX, // source x
        tileY, // source y
        map.spriteSize, // source width
        map.spriteSize, // source height
        -0.5 * map.outputSize, // target x
        -0.5 * map.outputSize, // target y
        map.outputSize, // target width
        map.outputSize // target height
      );
      //restore previous transform
      context.restore();
    }
  }
}

canvas.onload = function() {
}

var map = {
    spriteCols: 4, // # of columns on spritesheet
    spriteRows: 4, // # of rows on spritesheet
    outputCols: 3, // # of columns on canvas
    outputRows: 3, // # of rows on canvas
    spriteSize: 16, // size of tile on spritesheet
    outputSize: 128, // size of tile on output canvas
    tileIdentities: [ // index on spritesheet of tile to be drawn
      12, 12, 12, 
      10, 0, 10, 
      12, 12, 12, 
    ],
    tileRotations: [ // # of times tile should be rotated 90° clockwise before drawing (from 0-3)
      0, 0, 0, 
      2, 0, 0, 
      0, 0, 0,
    ],
    getTile: function(col, row) { // gets information required to draw tile by position
        var index = (row * map.outputCols) + col;
        return {
            spriteId: this.tileIdentities[index],
            rotation: this.tileRotations[index]
        }
    }
  };