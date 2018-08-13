# Digit Recognizer
A digit recognizer using the MNIST Dataset built using TensorFlow.js

You can check out the [Demo](https://media.giphy.com/media/ksKJmUfSUcK0ye5lDg/giphy.gif) to see an example.

### Architecture

The architecture of the model was taken from the tutorial on the [website](https://js.tensorflow.org/) of TensorFlow.js, link to the tutorial can be found [here](https://js.tensorflow.org/tutorials/mnist.html).

To summarize, shown below is the architecture:
* ``2D Convolutional Layer``
* ``2D Max Pooling Layer``
* ``2D Convolutional Layer``
* ``2D Max Pooling Layer``
* ``Flatten Layer``
* ``Dense Layer``

The input given to the network is a Tensor of shape ``[28,28,1]``. Since the MNIST Dataset originally stores the values in a linear array of depth 784, we need to preprocess our data to get in the desired format. To preprocess the data, I have used the ``data.js`` file link to which can be found [here](https://github.com/tensorflow/tfjs-examples/blob/master/mnist-core/data.js).

### Model Options

There are 3 things the user can do with the model:
1. ``Load Model``: This loads a pre-trained model which was trained using Keras with an Accuracy of over **98%**. The model is imported using ``tf.loadModel``.
2. ``Train Model``: This trains the model using ``fit`` which is a function belonging to ``tf.Model`` for a set number of iterations given by the user in the ``Train Iterations`` input field. As the model is being trained, the results are plotted using ``Plotly.js`` library.
3. ``Test Model``: This just tests the model over the entire test set and gives out an Accuracy and a Loss value. The model is tested using ``evalute`` which is a function belonging to ``tf.Model``.

### Prediction

There is a canvas element which was created using the ``p5.js`` library to allow the user to draw and write a given number. The user can then click on Predict which runs the ``predict`` function in the ``tf.Model`` and gives an output of the number. The results of all the class scores are plotted.

### Helper Functions

There are 3 helper functions that were used:
1. ``canvasToMnistData``: This function uses the pixel array of the canvas and converts it into an array of 784 values. The size of the canvas was chosen to be a multiple of 28 to allow easy transformation. Since the canvas is larger than the size 28×28, Max Pooling was applied over the entire pixel array.
2. ``mnistDataToCanvas``: This function takes in an array of 784 values and draws it onto the canvas. The function uses the pixel array and the conversion from Grayscale to RGB was done by duplication of values across all the axes.
3. ``RGB2GRAY``: The MNIST images are of Grayscale color format and the canvas element is of type RGB color format. This function just converts an RGB color to a GRAYSCALE value using Relative Luminance link to the Wikipedia page can be found [here](https://en.wikipedia.org/wiki/Relative_luminance).
