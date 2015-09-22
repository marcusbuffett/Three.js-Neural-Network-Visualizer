threeData = require('./threes')
xorData   = require('./xor')
threeData = require('./threesLeg')
data = threeData

batchSize = 1
iterations = 100000
currentIteration = 0
error = Infinity
intervalID = 0
net = null
trainingOptions = null
hiddenLayers = [4]

net = new brain.NeuralNetwork
  hiddenLayers: data.hiddenLayers || undefined
scene = require('./scene')(net)

setBatchSize = (size) ->
  batchSize = size

setLearningRate = (rate) ->
  trainingOptions.learningRate = rate

displayOpts = {
  grid: true
}

initializeOptions = {
  iterations: 0
}

resetAll = ->
  clearInterval(intervalID)
  net = new brain.NeuralNetwork
    hiddenLayers: hiddenLayers || undefined
  scene.setNet(net)
  trainingOptions = {
    errorThresh: 0.01, # error threshold to reach
    iterations: batchSize,   # maximum training iterations
    callback: (info) ->
      info.iterations = currentIteration
      error = info.error
      scene.setInfo(info)
    callbackPeriod: batchSize,     # number of iterations between logging
    learningRate: 0.3    # learning rate
  }
  net.train(data.trainingData, initializeOptions)
  scene.updateAndRender(displayOpts)

console.log("HL : ")
console.log data.hiddenLayers
resetAll()

train = ->
  i = 0
  intervalID = setInterval( (->
    net.train(data.trainingData, trainingOptions)
    scene.updateAndRender(displayOpts)
    i++
    output = net.run(data.testData)
    currentIteration = i*batchSize
    if i*batchSize > iterations || error < trainingOptions.errorThresh
      clearInterval(intervalID)
      console.log("YEAH")
    ), 100)



$('#batch-size-button').click (e) ->
  size = Number($('#batch-size-input').val())
  console.log("BLAH")
  debugger
  setBatchSize(size)

$('#learning-rate-button').click (e) ->
  rate = Number($('#learning-rate-input').val())
  console.log("BLAH")
  setLearningRate(rate)

$('#reset-button').click (e) ->
  resetAll()
  console.log("BLAH")

$('#train-button').click (e) ->
  resetAll()
  console.log("BLAH")
  train()


$('#hidden-layers-button').click (e) ->
  console.log($('#hidden-layers-input').val())
  debugger
  hLayers = JSON.parse($('#hidden-layers-input').val())
  console.log(hLayers)
  hiddenLayers = hLayers
  resetAll()

