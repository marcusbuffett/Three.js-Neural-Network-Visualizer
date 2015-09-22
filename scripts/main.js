(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var batchSize, currentIteration, data, error, i, initializeOptions, intervalID, iterations, net, scene, threeData, trainingOptions, xorData;

threeData = require('./threes');

xorData = require('./xor');

data = threeData;

batchSize = 5;

iterations = 10000;

currentIteration = 0;

error = Infinity;

trainingOptions = {
  errorThresh: 0.002,
  iterations: batchSize,
  callback: function(info) {
    console.log("STTING");
    info.iterations = currentIteration;
    error = info.error;
    return scene.setInfo(info);
  },
  callbackPeriod: batchSize,
  learningRate: 0.3
};

initializeOptions = {
  iterations: 0
};

console.log("HL : ");

console.log(data.hiddenLayers);

net = new brain.NeuralNetwork({
  hiddenLayers: data.hiddenLayers || void 0
});

scene = require('./scene')(net);

console.log(data);

net.train(data.trainingData, initializeOptions);

console.log(net);

scene.updateAndRender();

i = 0;

intervalID = setInterval((function() {
  var output;
  net.train(data.trainingData, trainingOptions);
  scene.updateAndRender();
  i++;
  output = net.run(data.testData);
  currentIteration = i * batchSize;
  if (i * batchSize > iterations || error < trainingOptions.errorThresh) {
    clearInterval(intervalID);
    return console.log("YEAH");
  }
}), 100);

},{"./scene":3,"./threes":4,"./xor":5}],2:[function(require,module,exports){
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
module.exports = function(net) {
  var camera, connections, generateConnections, generateNeurons, height, hiddenNode, info, neurons, orbit, outputNode, render, renderer, scene, sensorNode, setInfo, size, updateAndRender, updateScene, width;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log($('#webgl')[0]);
  $('#webgl').append(renderer.domElement);
  orbit = new THREE.OrbitControls(camera, renderer.domElement);
  neurons = [];
  connections = [];
  width = 5;
  height = 2;
  size = 0.2;
  info = {
    error: 0,
    iterations: 0
  };
  setInfo = function(newInfo) {
    return info = newInfo;
  };
  generateNeurons = function() {
    var col, colSpacing, cols, k, l, obj, ref, ref1, row, rowSpacing, rows, x, xOffset, y, yOffset;
    rows = net.sizes.length;
    for (row = k = 0, ref = rows; 0 <= ref ? k < ref : k > ref; row = 0 <= ref ? ++k : --k) {
      rowSpacing = (height * 2 - size * rows) / (rows - 1);
      y = size * row + rowSpacing * row;
      yOffset = (rows * size + rowSpacing * (rows - 1)) / 2;
      cols = net.sizes[row];
      neurons.push([]);
      for (col = l = 0, ref1 = cols; 0 <= ref1 ? l < ref1 : l > ref1; col = 0 <= ref1 ? ++l : --l) {
        colSpacing = (width * 2 - size * cols) / (cols - 1 || 1);
        xOffset = (cols * size + colSpacing * (cols - 1)) / 2;
        x = size * col + colSpacing * col;
        if (row === 0) {
          obj = sensorNode(size);
        } else if (row === rows - 1) {
          obj = outputNode(size);
        } else {
          obj = hiddenNode(size);
        }
        obj.position.set(x - xOffset, y - yOffset, 0);
        obj.renderOrder = 1;
        console.log(obj);
        scene.add(obj);
        neurons[neurons.length - 1].push(obj);
      }
    }
    return neurons;
  };
  generateConnections = function(neurons) {
    var geometry, i, j, k, layer, len, line, material, nextLayer, r, ref, results, source, sourceImportance, target, weightToNextLayer;
    ref = neurons.slice(0, -1);
    results = [];
    for (r = k = 0, len = ref.length; k < len; r = ++k) {
      layer = ref[r];
      nextLayer = neurons[r + 1];
      results.push((function() {
        var l, len1, len2, m, results1;
        results1 = [];
        for (i = l = 0, len1 = layer.length; l < len1; i = ++l) {
          source = layer[i];
          sourceImportance = 0;
          for (j = m = 0, len2 = nextLayer.length; m < len2; j = ++m) {
            target = nextLayer[j];
            material = new THREE.LineBasicMaterial({
              color: 0xFFFFFF
            });
            material.linewidth = 2;
            weightToNextLayer = net.weights[r + 1][j][i];
            sourceImportance += Math.abs(weightToNextLayer);
            material.opacity = Math.pow(Math.abs(weightToNextLayer), 3);
            material.transparent = true;
            geometry = new THREE.Geometry();
            geometry.vertices.push(source.position, target.position);
            line = new THREE.Line(geometry, material);
            line.renderOrder = sourceImportance;
            scene.add(line);
            connections.push(line);
          }
          sourceImportance = sourceImportance / nextLayer.length;
          sourceImportance = sourceImportance > 3 ? 3 : sourceImportance;
          source.scale.x = sourceImportance;
          source.scale.y = sourceImportance;
          source.scale.z = sourceImportance;
          results1.push(console.log(info.iterations));
        }
        return results1;
      })());
    }
    return results;
  };
  updateScene = function() {
    generateNeurons();
    return generateConnections(neurons);
  };
  sensorNode = function(size) {
    var cube, geometry, material;
    geometry = new THREE.BoxGeometry(size, size, size);
    material = new THREE.MeshBasicMaterial({
      color: 0xC4C4C4
    });
    cube = new THREE.Mesh(geometry, material);
    return cube;
  };
  hiddenNode = function(size) {
    var cube, geometry, material;
    geometry = new THREE.SphereGeometry(size / 2, 20);
    material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF
    });
    cube = new THREE.Mesh(geometry, material);
    return cube;
  };
  outputNode = function(size) {
    var cube, geometry, material;
    geometry = new THREE.BoxGeometry(size, size, size);
    material = new THREE.MeshBasicMaterial({
      color: 0xC4C4C4
    });
    cube = new THREE.Mesh(geometry, material);
    return cube;
  };
  camera.position.z = 10;
  updateAndRender = function() {
    var i, k, obj, ref;
    for (i = k = ref = scene.children.length; ref <= 0 ? k <= 0 : k >= 0; i = ref <= 0 ? ++k : --k) {
      obj = scene.children[i];
      if (obj !== camera) {
        scene.remove(obj);
      }
    }
    neurons = [];
    connections = [];
    updateScene();
    $($('#info p').first()).text("Error : " + info.error);
    $($('#info p').last()).text("Iterations : " + info.iterations);
    return render();
  };
  render = function() {
    requestAnimationFrame(render);
    return renderer.render(scene, camera);
  };
  return module.exports = {
    scene: scene,
    render: render,
    updateAndRender: updateAndRender,
    updateScene: updateScene,
    setInfo: setInfo
  };
};

},{}],4:[function(require,module,exports){
var noThreesData, notThrees, testThree, three, threes, yesThreesData;

threes = [[1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1], [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]];

notThrees = [[0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1], [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1], [0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]];

testThree = [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1];

noThreesData = (function() {
  var i, len, results;
  results = [];
  for (i = 0, len = notThrees.length; i < len; i++) {
    three = notThrees[i];
    results.push({
      input: three,
      output: [0]
    });
  }
  return results;
})();

yesThreesData = (function() {
  var i, len, results;
  results = [];
  for (i = 0, len = threes.length; i < len; i++) {
    three = threes[i];
    results.push({
      input: three,
      output: [1]
    });
  }
  return results;
})();

module.exports = noThreesData.concat(yesThreesData);

module.exports = {
  trainingData: noThreesData.concat(yesThreesData),
  testData: testThree,
  hiddenLayers: [5]
};

},{}],5:[function(require,module,exports){
var testData, xor, xorData, xors;

xors = [[[0, 0], [0]], [[0, 1], [1]], [[1, 0], [1]], [[1, 1], [0]]];

xorData = (function() {
  var i, len, results;
  results = [];
  for (i = 0, len = xors.length; i < len; i++) {
    xor = xors[i];
    results.push({
      input: xor[0],
      output: xor[1]
    });
  }
  return results;
})();

testData = [0, 1];

module.exports = {
  trainingData: xorData,
  testData: xor
};

},{}]},{},[1,2,3,4,5]);
