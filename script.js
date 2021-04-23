var canvas = document.getElementById("main");
var context = canvas.getContext("2d");

var image = new Image(128, 128);
image.src = "tilemap.png"

image.onload = function() {
  for (var r = 0; r < map.rows; r++) {
    for (var c = 0; c < map.cols; c++) {
      var tile = map.getTile(c, r).spriteId;

      var tileX = (tile % map.cols) * map.spriteSize;
      var tileY = (Math.floor(tile / map.cols)) * map.spriteSize;
      context.drawImage(
        image, // image
        tileX, // source x
        tileY, // source y
        map.spriteSize, // source width
        map.spriteSize, // source height
        c * map.outputSize, // target x
        r * map.outputSize, // target y
        map.outputSize, // target width
        map.outputSize // target height
      );
    }
  }
}

canvas.onload = function() {
}

var map = {
    cols: 4, // # of columns on canvas
    rows: 4, // # of rows on canvas
    spriteSize: 16, // size of tile on spritesheet
    outputSize: 128, // size of tile on output canvas
    tileIdentities: [ // index on spritesheet of tile to be drawn
      0, 1, 2, 3,
      4, 5, 6, 7,
      8, 9, 10, 11,
      0, 0, 0, 0
    ],
    tileRotations: [ // # of times tile should be rotated 90° clockwise before drawing (0-3)
      0, 0, 0, 0,
      0, 0, 0, 0, 
      0, 0, 0, 0, 
      0, 0, 0, 0
    ],
    getTile: function(col, row) { // gets information required to draw tile by position
        var index = (row * map.cols) + col;
        return {
            spriteId: this.tileIdentities[index],
            rotation: this.tileRotations[index]
        }
    }
  };