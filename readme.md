### Space Plumbing

Proof-of-concept for a game about putting pipes into place, and also learning a bit about how HTML canvases work.

The canvas is rendered dynamically using sprites from tilemap.png. You can put two different numbers in the two inputs representing indices of tile positions (0-15; 0 in the top-left corner, and proceeding left-to-right then top-to-bottom after that) and click the button on the main page to check if there is an unbroken path between them.  Or, well.  Mostly.  See the comments on the `isConnected` method in `script.js` for some details.