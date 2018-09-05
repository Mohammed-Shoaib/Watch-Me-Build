# Hand Gesture Estimation

A model for sign recognition using Transfer Learning with the MobileNet model. MobileNets are simple and light weight yet very efficient models which work on mobile and can be used for computer vision.

A second model was built which takes in as input the output of an internal activation from one of the last layers of the MobileNet model. This was chosen as the layers towards the end learn more features as compared to the layers before.

As of now, the model only recognizes 2 signs, namely `A` and `Y`.

![A](https://s22.postimg.cc/cfsg8eqzl/image.png)
![Y](https://s22.postimg.cc/6sw3ag3r5/image.png)

# Demo

![Demo](https://media.giphy.com/media/5UG0JbqBnDOCBOGUEK/giphy.gif)

Click [here](https://mohammed-shoaib.github.io/Hand-Gesture-Estimation/) to check out the live version.

# Architecture

The MobileNet model with `alpha=0.25` was chosen due it's properties. The model is more light weight as compared to its other versions and hence is more computationally efficient.

For the second model, to summarize, shown below is the architecture:
* `2D Convolutional Layer`
* `2D Max Pooling Layer`
* `2D Convolutional Layer`
* `2D Max Pooling Layer`
* `Flatten Layer`

The MobileNet model takes as input an image of shape `224×224×3` where the last dimension specifies the number of color channels which is 3 for an RGB image. The layer `conv_pw_13_relu` outputs an internal activation of shape `7×7×256`. The second model takes as input this shape and outputs a one-hot encoded array of length `NUM_CLASSES` in this case 2 classes.


# Model Deployment

The model was trained using `Keras` with `TensorFlow` as backend. It was trained over a span of 12 Epochs with an accuracy of over **99%** on the Test set. The data for the training the model was self-made with `3000` images for each label.

The model is then deployed on the browser using `TensorFlow.js` by loading it with `tf.loadModel` function.
