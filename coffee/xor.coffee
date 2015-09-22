xors = [
  [[0,0], [0]]
  [[0,1], [1]]
  [[1,0], [1]]
  [[1,1], [0]]
]

xorData = ({input:xor[0], output:xor[1]} for xor in xors)
testData = [0,1]
module.exports = {
  trainingData: xorData
  testData:     xor
}
