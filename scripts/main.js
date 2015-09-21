(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var net, output, scene, trainingData, trainingOptions;

scene = require('./scene');

console.log(scene);

net = new brain.NeuralNetwork({
  hiddenLayers: [3, 4, 5, 3, 2]
});

trainingData = [
  {
    input: [0, 0],
    output: [0]
  }, {
    input: [0, 1],
    output: [1]
  }, {
    input: [1, 0],
    output: [1]
  }, {
    input: [1, 1],
    output: [0]
  }
];

trainingOptions = {
  errorThresh: 0.0001,
  iterations: 40,
  log: true,
  logPeriod: 1000,
  learningRate: 0.3
};

net.train(trainingData, trainingOptions);

output = net.run([1, 0]);

console.log(output);

console.log("YEAH");

scene.useNet(net);

scene.render();

},{"./scene":3}],2:[function(require,module,exports){
var getNeurons;

getNeurons = function(net) {
  var col, cols, cube, edges, geometry, i, material, ref, results, row, rows, x, xOffset, y, yOffset;
  console.log(net);
  rows = net.hiddenSizes.length;
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

},{}],3:[function(require,module,exports){
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

},{}]},{},[1,2,3]);
