var camera, net, render, renderer, scene, useNet;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

net = {};

useNet = function(net) {
  var col, colSpacing, cols, cube, edges, geometry, i, material, neurons, ref, results, row, rowSpacing, rows, size, x, xOffset, y, yOffset;
  colSpacing = 0.5;
  rowSpacing = 0.5;
  size = 0.5;
  rows = net.sizes.length;
  console.log(net);
  neurons = [];
  results = [];
  for (row = i = 0, ref = rows; 0 <= ref ? i < ref : i > ref; row = 0 <= ref ? ++i : --i) {
    y = size * row + rowSpacing * row;
    yOffset = (rows * size + rowSpacing * (rows - 1)) / 2;
    cols = net.hiddenSizes[row];
    console.log("y : " + y);
    console.log("yOffset : " + yOffset);
    results.push((function() {
      var j, ref1, results1;
      results1 = [];
      for (col = j = 0, ref1 = cols; 0 <= ref1 ? j < ref1 : j > ref1; col = 0 <= ref1 ? ++j : --j) {
        xOffset = (cols * size + colSpacing * (cols - 1)) / 2;
        x = size * col + colSpacing * col;
        geometry = new THREE.BoxGeometry(size, size, 0.1);
        material = new THREE.MeshBasicMaterial({
          color: 0xFF0000
        });
        cube = new THREE.Mesh(geometry, material);
        cube.position.set(x - xOffset, y - yOffset, 0);
        edges = new THREE.EdgesHelper(cube, 0x00ff00);
        scene.add(edges);
        results1.push(scene.add(cube));
      }
      return results1;
    })());
  }
  return results;
};

camera.position.z = 5;

render = function(net) {
  return renderer.render(scene, camera);
};

module.exports = {
  scene: scene,
  render: render,
  useNet: useNet
};
