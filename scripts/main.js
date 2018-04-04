(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var batchSize, currentIteration, data, displayOpts, error, hiddenLayers, initializeOptions, intervalID, iterations, learningRate, net, resetAll, scene, setBatchSize, setLearningRate, stop, threeData, train, trainingOptions, xorData;

threeData = require('./threes');

xorData = require('./xor');

// threeData = require('./threesLeg')
data = threeData;

batchSize = 1;

learningRate = 0.5;

iterations = 100000;

currentIteration = 0;

error = 2e308;

intervalID = 0;

net = null;

trainingOptions = null;

hiddenLayers = [4];

net = new brain.NeuralNetwork({
  hiddenLayers: data.hiddenLayers || void 0
});

scene = require('./scene')(net);

setBatchSize = function(size) {
  return batchSize = size;
};

setLearningRate = function(rate) {
  return learningRate = rate;
};

displayOpts = {
  grid: true
};

initializeOptions = {
  iterations: 1
};

stop = function() {
  return clearInterval(intervalID);
};

resetAll = function() {
  stop();
  net = new brain.NeuralNetwork({
    hiddenLayers: hiddenLayers || void 0
  });
  scene.setNet(net);
  trainingOptions = {
    errorThresh: 0.01, // error threshold to reach
    iterations: batchSize, // maximum training iterations
    callback: function(info) {
      info = Object.assign({}, info);
      info.iterations = currentIteration;
      error = info.error;
      return scene.setInfo(info);
    },
    callbackPeriod: batchSize, // number of iterations between logging
    learningRate: learningRate // learning rate
  };
  console.log("LEARNING RATE IS : " + learningRate);
  net.train(data.trainingData, initializeOptions);
  return scene.updateAndRender(displayOpts);
};

console.log("HL : ");

console.log(data.hiddenLayers);

resetAll();

train = function() {
  var i;
  stop();
  i = 0;
  return intervalID = setInterval((function() {
    var output;
    net.train(data.trainingData, trainingOptions);
    scene.updateAndRender(displayOpts);
    i++;
    output = net.run(data.testData);
    currentIteration = i * batchSize;
    if (i * batchSize > iterations || error < trainingOptions.errorThresh) {
      clearInterval(intervalID);
      return console.log("YEAH");
    }
  }), 100);
};

$('#batch-size-button').click(function(e) {
  var size;
  size = Number($('#batch-size-input').val());
  console.log("BLAH");
  return setBatchSize(size);
});

$('#learning-rate-button').click(function(e) {
  var rate;
  rate = Number($('#learning-rate-input').val());
  console.log("BLAH");
  return setLearningRate(rate);
});

$('#reset-button').click(function(e) {
  resetAll();
  return console.log("BLAH");
});

$('#stop-button').click(function(e) {
  stop();
  return console.log("BLAH");
});

$('#train-button').click(function(e) {
  return train();
});

$('#hidden-layers-button').click(function(e) {
  var hLayers;
  console.log($('#hidden-layers-input').val());
  hLayers = JSON.parse($('#hidden-layers-input').val());
  console.log(hLayers);
  hiddenLayers = hLayers;
  return resetAll();
});


},{"./scene":2,"./threes":3,"./xor":4}],2:[function(require,module,exports){
module.exports = function(net) {
  var camera, connections, displayGrid, displayLayer, generateConnections, generateNeurons, height, hiddenNode, info, neurons, orbit, outputNode, render, renderer, scene, sensorNode, setInfo, setNet, size, updateAndRender, updateScene, width;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  // camera = new THREE.OrthographicCamera( window.innerWidth / - 2,
  // window.innerWidth / 2,
  // window.innerHeight / 2,
  // window.innerHeight / - 2,
  // 1,
  // 1000 )
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
  height = 3;
  size = 0.2;
  info = {
    error: 0,
    iterations: 0
  };
  setInfo = function(newInfo) {
    return info = newInfo;
  };
  generateNeurons = function(displayOpts) {
    var constructor, k, ref, results, row, rowSpacing, rows, y, yOffset;
    rows = net.sizes.length;
    results = [];
    for (row = k = 0, ref = rows; (0 <= ref ? k < ref : k > ref); row = 0 <= ref ? ++k : --k) {
      rowSpacing = (height * 2 - size * rows) / (rows - 1);
      y = size * row + rowSpacing * row;
      yOffset = (rows * size + rowSpacing * (rows - 1)) / 2;
      neurons.push([]);
      if (row === 0 && displayOpts.grid) {
        constructor = sensorNode;
      } else if (row === rows - 1 && displayOpts.grid) {
        constructor = outputNode;
      } else if (displayOpts.grid) {
        constructor = hiddenNode;
      }
      if (displayOpts.grid) {
        results.push(displayGrid(row, y - yOffset, constructor));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  // else
  displayLayer = function(row, y, nodeConstructor) {
    var col, colSpacing, cols, k, obj, ref, results, x, xOffset;
    cols = net.sizes[row];
    results = [];
    for (col = k = 0, ref = cols; (0 <= ref ? k < ref : k > ref); col = 0 <= ref ? ++k : --k) {
      colSpacing = (width * 2 - size * cols) / (cols - 1 || 1);
      xOffset = (cols * size + colSpacing * (cols - 1)) / 2;
      x = size * col + colSpacing * col;
      obj = nodeConstructor(size);
      obj.position.set(x - xOffset, y, 0);
      obj.renderOrder = 1;
      scene.add(obj);
      results.push(neurons[neurons.length - 1].push(obj));
    }
    return results;
  };
  displayGrid = function(row, y, nodeConstructor) {
    var col, colSpacing, cols, farX, k, obj, ref, results, rowCols, rowSize, rows, rowsHeight, x, xOffset, z, zOffset;
    cols = net.sizes[row];
    rowCols = Math.floor(Math.sqrt(cols));
    rows = Math.ceil(Math.sqrt(cols));
    rowSize = rowCols;
    colSpacing = 1;
    rowsHeight = colSpacing * (rows - 1);
    xOffset = rowCols / 2;
    results = [];
    for (col = k = 0, ref = cols; (0 <= ref ? k < ref : k > ref); col = 0 <= ref ? ++k : --k) {
      farX = colSpacing * col;
      x = farX % rowSize;
      z = Math.floor(farX / rowSize);
      zOffset = rowsHeight / 2;
      obj = nodeConstructor(size);
      obj.position.set(x - xOffset, y, z - zOffset);
      obj.renderOrder = 1;
      scene.add(obj);
      results.push(neurons[neurons.length - 1].push(obj));
    }
    return results;
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
            // material.linewidth = Math.abs(net.weights[r+1][j][i])*5
            weightToNextLayer = net.weights[r + 1][j][i];
            if (weightToNextLayer > 0) {
              material.color.setHSL(0.5, 0.5, 0.5);
            }
            if (weightToNextLayer < 0) {
              material.color.setHSL(0.1, 0.5, 0.5);
            }
            sourceImportance += Math.abs(weightToNextLayer);
            material.opacity = Math.pow(Math.abs(weightToNextLayer), 3);
            material.transparent = true;
            geometry = new THREE.Geometry();
            geometry.vertices.push(source.position, target.position);
            line = new THREE.Line(geometry, material);
            line.renderOrder = -Math.abs(weightToNextLayer);
            if (Math.abs(weightToNextLayer) > 0.2) {
              scene.add(line);
              connections.push(line);
            }
          }
          sourceImportance = sourceImportance / nextLayer.length;
          // if sourceImportance > 1
          // debugger
          // console.log("IMPORTANTCE : " + sourceImportance)
          sourceImportance = sourceImportance > 3 ? 3 : sourceImportance;
          if (r > 0) {
            source.scale.x = sourceImportance;
            source.scale.y = sourceImportance;
            results1.push(source.scale.z = sourceImportance);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };
  // if r == 0
  // source.scale.x = Math.pow(sourceImportance, .5)
  // source.scale.y = Math.pow(sourceImportance, .5)
  // source.scale.z = sourceImportance
  updateScene = function(opts) {
    generateNeurons(opts);
    return generateConnections(neurons);
  };
  sensorNode = function(size) {
    var cube, geometry, material;
    geometry = new THREE.BoxGeometry(size, size, size);
    material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF
    });
    cube = new THREE.Mesh(geometry, material);
    return cube;
  };
  hiddenNode = function(size) {
    var cube, geometry, material;
    geometry = new THREE.SphereGeometry(size / 2, 60);
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
      color: 0xFFFFFF
    });
    cube = new THREE.Mesh(geometry, material);
    return cube;
  };
  camera.position.z = 10;
  updateAndRender = function(opts) {
    var i, k, obj, ref;
    for (i = k = ref = scene.children.length; (ref <= 0 ? k <= 0 : k >= 0); i = ref <= 0 ? ++k : --k) {
      obj = scene.children[i];
      if (obj !== camera) {
        scene.remove(obj);
      }
    }
    neurons = [];
    connections = [];
    updateScene(opts);
    $($('#info p').first()).text(`Error : ${Math.round(info.error * 100) / 100}`);
    return $($('#info p').last()).text(`Iterations : ${info.iterations}`);
  };
  render = function() {
    requestAnimationFrame(render);
    return renderer.render(scene, camera);
  };
  render();
  setNet = function(n) {
    return net = n;
  };
  return module.exports = {
    scene: scene,
    render: render,
    updateAndRender: updateAndRender,
    updateScene: updateScene,
    setInfo: setInfo,
    setNet: setNet
  };
};


},{}],3:[function(require,module,exports){
var data, test, three, threes;

threes = [[[0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], [1]], [[0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1], [1]], [[0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], [1]], [[1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], [1]], [[0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], [1]], [[0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1], [1]], [[0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], [1]], [[0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], [1]], [[0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1], [0]], [[0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1], [0]], [[0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], [0]], [[0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], [0]], [[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], [0]], [[1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0]], [[1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1], [0]], [[0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [0]]];

test = [[1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], [0]];

data = (function() {
  var i, len, results;
  results = [];
  for (i = 0, len = threes.length; i < len; i++) {
    three = threes[i];
    results.push({
      input: three[0],
      output: three[1]
    });
  }
  return results;
})();

module.exports = {
  trainingData: data,
  testData: test
};


},{}],4:[function(require,module,exports){
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


},{}]},{},[1]);
