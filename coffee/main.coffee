scene = require('./scene')


net = new brain.NeuralNetwork(
  hiddenLayers: [4,5],
)

trainingData = [{input: [0.1, 0.5], output: [0.6]},
                {input: [0.7, 0.2], output: [0.9]},
                {input: [0.3, 0.6], output: [0.9]},
                {input: [0.1, 0.1], output: [0.2]},
                {input: [0.15, 0.15], output: [0.3]},
                {input: [0.05, 0.1], output: [0.15]},
                {input: [0.15, 0.05], output: [0.2]}]


trainingOptions = {
  errorThresh: 0.0001, # error threshold to reach
  iterations: 4000,   # maximum training iterations
  log: true,           # console.log() progress periodically
  callback: () ->
    scene.render(net)
  callbackPeriod: 100,
  logPeriod: 1000,     # number of iterations between logging
  learningRate: 0.3    # learning rate
}
 
net.train(trainingData, trainingOptions)

# scene.useNet(net)
scene.render(net)

output = net.run([0.2, 0.3])
console.log(output)

console.log("YEAH")
