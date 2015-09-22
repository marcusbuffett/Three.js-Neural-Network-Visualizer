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
