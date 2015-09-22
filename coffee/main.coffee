threeData = require('./threes')
xorData   = require('./xor')
data = threeData

batchSize = 5
iterations = 10000
currentIteration = 0
error = Infinity

trainingOptions = {
  errorThresh: 0.002, # error threshold to reach
  iterations: batchSize,   # maximum training iterations
  callback: (info) ->
    console.log("STTING")
    info.iterations = currentIteration
    error = info.error
    scene.setInfo(info)
  callbackPeriod: batchSize,     # number of iterations between logging
  learningRate: 0.3    # learning rate
}

initializeOptions = {
  iterations: 0
}

console.log("HL : ")
console.log data.hiddenLayers
net = new brain.NeuralNetwork
  hiddenLayers: data.hiddenLayers || undefined

scene = require('./scene')(net)
console.log(data)
net.train(data.trainingData, initializeOptions)
console.log(net)
scene.updateAndRender()

i = 0
intervalID = setInterval( (->
  net.train(data.trainingData, trainingOptions)
  scene.updateAndRender()
  i++
  output = net.run(data.testData)
  currentIteration = i*batchSize
  if i*batchSize > iterations || error < trainingOptions.errorThresh
    clearInterval(intervalID)
    console.log("YEAH")
  ), 100)


