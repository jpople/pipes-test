// important nomenclature note: make sure you're properly differentiating "tiles" and "sprites"

var canvas = document.getElementById("main");
var context = canvas.getContext("2d");

var tilemap = { // these should be hardcoded based on the image file and never change during running
  image: "tilemap.png",
  cols: 4,
  rows: 4,
  spriteSize: 16,
  spriteConnections: [
    // values start from the top side of the sprite in its default rotation and go clockwise
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
    var duped = this.spriteConnections[index].concat(this.spriteConnections[index]);
    var result = duped.slice(rotation, rotation + 4);
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
      console.log(map.tileConnections[(r * map.cols) + c]);
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
      12, 12, 12, 12, 
    ],
    tileRotations: [ // # of times sprite should be rotated 90° clockwise before drawing (from 0-3)
      0, 0, 0, 0,
      2, 0, 0, 0,
      2, 0, 0, 0,
      0, 0, 0, 0
    ],
    tileConnections: [],
    getTile: function(col, row) { // gets information required to draw tile by position
        // probably nice to have access to the index elsewhere... is there a particular reason this needs to take col, row instead of just index?
        var index = (row * map.cols) + col;
        return {
            spriteId: this.tileIndices[index],
            rotation: this.tileRotations[index]
        }
    }
  };