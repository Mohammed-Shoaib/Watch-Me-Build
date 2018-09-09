import os
import json
import pickle
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from random import randrange
import keras
from keras.models import Sequential
from keras.layers import Flatten
from keras.layers import Dense
from keras.layers import Conv2D
from keras.layers import MaxPooling2D
from keras.backend import argmax
from keras.applications import MobileNet
import tensorflowjs as tfjs

print("Done importing")

NUM_CLASSES = 5
mapping = {'A': 0, 'OKAY': 1, 'PEACE': 2, 'THUMBS UP': 3, 'Y': 4}
BATCH_SIZE = 64


def load_mobilenet():
    """Loads the MobileNet model"""
    print("Loading the MobileNet model...")
    mobilenet = MobileNet(alpha=0.25)
    print("Model Loaded.")
    layer = mobilenet.get_layer('conv_pw_13_relu')
    return keras.Model(inputs=mobilenet.inputs, outputs=layer.output)


def load_pickle(pickle_path):
    """Loads the pickle object"""
    pickle_in = open(pickle_path, 'rb')
    data = pickle.load(pickle_in)
    pickle_in.close()
    return data


def load_pickle_object(dir_name, pickle_path):
    """Loading the entire pickle object which are stored in chunks"""
    print('Loading ' + dir_name)
    dir_name += '/'
    data = []
    file_path = pickle_path + dir_name
    labels = os.listdir(file_path)
    for label in labels:
        label += '/'
        label_path = pickle_path + dir_name + label
        files = os.listdir(label_path)
        for file in files:
            file_path = label_path + file
            print(file_path)
            data.extend(load_pickle(file_path))
    data = np.array(data)
    return data


def show_image(image):
    """Takes an array of pixels of shape 224x224x3 and displays the image on the screen"""
    # Denormalizing the data from -1 to 1 to 0 to 255
    for i in range(len(image)):
        for j in range(len(image[i])):
            pixel = image[i][j][0]
            pixel += 1
            pixel *= 127
            image[i][j] = np.full(3, pixel)
    plt.imshow(image, interpolation='nearest')
    plt.show()


def get_label(y):
    """Takes in a numpy array with one-hot encoding and output the label"""
    output_label = y.argmax(axis=-1)
    for pose, label in  mapping.items():
            if label == output_label:
                return pose


def shuffle_in_unison(a, b):
    """Takes in 2 numpy arrays and shuffles them together"""
    rng_state = np.random.get_state()
    np.random.shuffle(a)
    np.random.set_state(rng_state)
    np.random.shuffle(b)


def create_model():
    """Creates the model"""
    model = Sequential()

    # Creating the hidden layers
    # Conv Layer
    model.add(Conv2D(input_shape=(7, 7, 256),
                     kernel_size=4,
                     filters=8,
                     strides=1,
                     activation='relu',
                     kernel_initializer='VarianceScaling'))

    # Pooling layer to halve the output from previous layer
    model.add(MaxPooling2D(pool_size=(2, 2), strides=2))

    # Conv layer
    model.add(Conv2D(kernel_size=1,
                     filters=16,
                     strides=1,
                     activation='relu',
                     kernel_initializer='VarianceScaling'))

    # Pooling layer to halve the output from previous layer
    model.add(MaxPooling2D(pool_size=(2, 2), strides=2))

    # Flatten layer to flatten to output of the previous layer to a vector
    model.add(Flatten())

    # Output layer
    model.add(Dense(units=NUM_CLASSES,
                    activation='softmax',
                    kernel_initializer='VarianceScaling'))

    # Compiling the model
    sgd = keras.optimizers.SGD(lr=0.01)
    model.compile(optimizer=sgd,
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    return model


def train(train_xs, train_ys, test_xs, test_ys):
    """Trains the model"""
    print("Training the model...")
    model.fit(train_xs, train_ys,
              batch_size=BATCH_SIZE,
              validation_data=(test_xs, test_ys),
              epochs=30,
              shuffle=True,
              verbose=1)
    print("Finished training the model.")


def evaluate(test_xs, test_ys):
    """Checking how well the model performed"""
    score = model.evaluate(test_xs, test_ys, verbose=0)
    print('Test Loss:', score[0])
    print('Test Accuracy: ', score[1])


def predict(x):
    """Predicts a pose for a given value"""
    x = np.expand_dims(x, axis=0)
    x_activation = mobilenet.predict(x)
    output = model.predict(x_activation)[0]
    return get_label(output)

def predict_random(test_xs, test_ys, image=False):
    """Predicts a random element from the test set"""
    i = randrange(len(test_xs))
    predicted_y = predict(test_xs[i])
    actual_y = get_label(test_ys[i])
    if image:
        show_image(test_xs[i])
    print("Predicted: {} Actual: {}".format(predicted_y,actual_y))


mobilenet = load_mobilenet()


# Loading the data
pickle_path = 'data/Pickle Objects/'
# dir_name = 'test_xs'
# test_xs = load_pickle_object(dir_name, pickle_path)
dir_name = 'train_activations'
train_activations = load_pickle_object(dir_name, pickle_path)
dir_name = 'test_activations'
test_activations = load_pickle_object(dir_name, pickle_path)
dir_name = 'train_ys'
train_ys = load_pickle_object(dir_name, pickle_path)
dir_name = 'test_ys'
test_ys = load_pickle_object(dir_name, pickle_path)
train_ys = train_ys.astype(int)
test_ys = test_ys.astype(int)
shuffle_in_unison(train_activations, train_ys)
shuffle_in_unison(test_activations, test_ys)


# Creating and training the model
model = create_model()
train(train_activations, train_ys, test_activations, test_ys)
evaluate(test_activations, test_ys)


# Saving the model and it's weights
tfjs.converters.save_keras_model(model, 'Model')
model.save_weights('Model/model.h5')