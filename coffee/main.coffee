scene = require('./scene')
console.log(scene)

net = new brain.NeuralNetwork(
  hiddenLayers: [3, 4, 5, 3, 2],
)

trainingData = [{input: [0, 0], output: [0]},
                {input: [0, 1], output: [1]},
                {input: [1, 0], output: [1]},
                {input: [1, 1], output: [0]}]

trainingOptions = {
  errorThresh: 0.0001, # error threshold to reach
  iterations: 40,   # maximum training iterations
  log: true,           # console.log() progress periodically
  logPeriod: 1000,     # number of iterations between logging
  learningRate: 0.3    # learning rate
}
 
net.train(trainingData, trainingOptions)

output = net.run([1, 0])
console.log(output)

console.log("YEAH")
scene.useNet(net)
scene.render()
