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
