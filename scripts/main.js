(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var net, output, scene, trainingData, trainingOptions;

scene = require('./scene');

net = new brain.NeuralNetwork({
  hiddenLayers: [4, 5]
});

trainingData = [
  {
    input: [0.1, 0.5],
    output: [0.6]
  }, {
    input: [0.7, 0.2],
    output: [0.9]
  }, {
    input: [0.3, 0.6],
    output: [0.9]
  }, {
    input: [0.1, 0.1],
    output: [0.2]
  }, {
    input: [0.15, 0.15],
    output: [0.3]
  }, {
    input: [0.05, 0.1],
    output: [0.15]
  }, {
    input: [0.15, 0.05],
    output: [0.2]
  }
];

trainingOptions = {
  errorThresh: 0.0001,
  iterations: 4000,
  log: true,
  callback: function() {
    return scene.render(net);
  },
  callbackPeriod: 100,
  logPeriod: 1000,
  learningRate: 0.3
};

net.train(trainingData, trainingOptions);

scene.render(net);

output = net.run([0.2, 0.3]);

console.log(output);

console.log("YEAH");

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
var camera, colSpacing, connections, controls, generateConnections, generateNeurons, hiddenNode, neurons, outputNode, render, renderer, rowSpacing, scene, sensorNode, size, useNet;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera);

controls.addEventListener('change', render);

neurons = [];

connections = [];

colSpacing = 0.5;

rowSpacing = 1.0;

size = 0.5;

generateNeurons = function(net) {
  var col, cols, k, l, obj, ref, ref1, row, rows, x, xOffset, y, yOffset;
  rows = net.sizes.length;
  for (row = k = 0, ref = rows; 0 <= ref ? k < ref : k > ref; row = 0 <= ref ? ++k : --k) {
    y = size * row + rowSpacing * row;
    yOffset = (rows * size + rowSpacing * (rows - 1)) / 2;
    cols = net.sizes[row];
    neurons.push([]);
    for (col = l = 0, ref1 = cols; 0 <= ref1 ? l < ref1 : l > ref1; col = 0 <= ref1 ? ++l : --l) {
      xOffset = (cols * size + colSpacing * (cols - 1)) / 2;
      x = size * col + colSpacing * col;
      if (row === 0) {
        obj = sensorNode(size);
      } else if (row === rows - 1) {
        obj = outputNode(size);
      } else {
        obj = hiddenNode(size);
      }
      obj.position.set(x - xOffset, y - yOffset, Math.random() * 1);
      obj.renderOrder = 1;
      scene.add(obj);
      neurons[neurons.length - 1].push(obj);
    }
  }
  return neurons;
};

generateConnections = function(net, neurons) {
  var geometry, i, j, k, layer, len, line, material, nextLayer, r, ref, results, source, target;
  ref = neurons.slice(0, -1);
  results = [];
  for (r = k = 0, len = ref.length; k < len; r = ++k) {
    layer = ref[r];
    nextLayer = neurons[r + 1];
    results.push((function() {
      var l, len1, results1;
      results1 = [];
      for (i = l = 0, len1 = layer.length; l < len1; i = ++l) {
        source = layer[i];
        results1.push((function() {
          var len2, m, results2;
          results2 = [];
          for (j = m = 0, len2 = nextLayer.length; m < len2; j = ++m) {
            target = nextLayer[j];
            material = new THREE.LineBasicMaterial({
              color: 0xB4B4B4
            });
            material.linewidth = 1;
            material.opacity = Math.abs(net.weights[r + 1][j][i]);
            material.transparent = true;
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(source.position.x, source.position.y, source.position.z - 0.1), new THREE.Vector3(target.position.x, target.position.y, target.position.z - 0.1));
            line = new THREE.Line(geometry, material);
            line.renderOrder = 0;
            scene.add(line);
            results2.push(connections.push(line));
          }
          return results2;
        })());
      }
      return results1;
    })());
  }
  return results;
};

useNet = function(net) {
  generateNeurons(net);
  return generateConnections(net, neurons);
};

sensorNode = function(size) {
  var cube, geometry, material;
  geometry = new THREE.BoxGeometry(size, size, 0);
  material = new THREE.MeshBasicMaterial({
    color: 0xC4C4C4
  });
  cube = new THREE.Mesh(geometry, material);
  return cube;
};

hiddenNode = function(size) {
  var cube, geometry, material;
  geometry = new THREE.CircleGeometry(size / 2, 20);
  material = new THREE.MeshBasicMaterial({
    color: 0x757575
  });
  cube = new THREE.Mesh(geometry, material);
  return cube;
};

outputNode = function(size) {
  var cube, geometry, material;
  geometry = new THREE.BoxGeometry(size, size, 0);
  material = new THREE.MeshBasicMaterial({
    color: 0xC4C4C4
  });
  cube = new THREE.Mesh(geometry, material);
  return cube;
};

camera.position.z = 5;

render = function(net) {
  var i, k, obj, ref;
  for (i = k = ref = scene.children.length; ref <= 0 ? k <= 0 : k >= 0; i = ref <= 0 ? ++k : --k) {
    obj = scene.children[i];
    if (obj !== camera) {
      scene.remove(obj);
    }
  }
  neurons = [];
  connections = [];
  useNet(net);
  return renderer.render(scene, camera);
};

module.exports = {
  scene: scene,
  render: render,
  useNet: useNet
};

},{}]},{},[1,2,3]);
