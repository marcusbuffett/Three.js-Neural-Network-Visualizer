# Three.js-Neural-Network-Visualizer
A neural network visualizer using Three.js that recognizes 3s

Check it out here : http://marcusbuffett.github.io/Three.js-Neural-Network-Visualizer/

##The Data

The input is a column vector of 25 numbers (aka a 1D array of 25 numbers), and the output is a one dimensional vector (aka an array with a single number in it). 

The test data looks like this (`1`s highlighted for clarity) : 

![Test Data](http://i.imgur.com/o9j06Hd.png)

##The Results

Here's an example of a neural network trained for 90 iterations, with a learning rate of 0.5 and one hidden layer with two neurons.

![Trained network](http://i.imgur.com/LQZF9MY.png)

The blue lines represent positive weights, the orange lines represent negative weights, and the size of the neurons represent the average absolute weight that the nodes it's connected to assign it's output (roughly translated, the neuron's importance to the network).

Sensor and output neurons are represented by cubes, and hidden layers are represented by spheres.

## Running

Install required stuff:
```sh
npm install -g bower
bower install
npm install
```

Compile coffeescript:
```sh
browserify -t coffeeify --extension=".coffee" coffee/main.coffee > scripts/main.js
```
