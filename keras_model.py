import os
import json
import pickle
import numpy as np
import scipy.misc as smp
from random import randrange
import keras
from keras.models import Sequential
from keras.layers import Flatten
from keras.layers import Dense
from keras.backend import argmax
from keras.applications import MobileNet
import tensorflowjs as tfjs

print("Done importing")

NUM_CLASSES = 2
BATCH_SIZE = 64
labels = {'A': 0, 'Y': 1}


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


def load_pickle_object(file_name, pickle_path):
    """Loading the entire pickle object which are stored in chunks"""
    print('Loading ' + file_name)
    file_name += '/'
    data = []
    file_path = pickle_path + file_name
    files = os.listdir(file_path)
    for file in files:
        file_path = pickle_path + file_name + file
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
    img = smp.toimage(image)
    img.show()


def get_label(y):
    """Takes in a numpy array with one-hot encoding and output the label"""
    output_label = y.argmax(axis=-1)
    for pose, label in  labels.items():
            if label == output_label:
                return pose


def create_model():
    """Creates the model"""
    global model
    model = Sequential()

    # Creating the hidden layers
    # Flattening the output of the internal activation
    model.add(Flatten(input_shape=[7, 7, 256]))

    # Dense layer
    model.add(Dense(units=100,
                    activation='relu',
                    kernel_initializer='VarianceScaling',
                    use_bias=True))

    # Output layer
    model.add(Dense(units=NUM_CLASSES,
                    activation='softmax',
                    kernel_initializer='VarianceScaling',
                    use_bias=False))

    # Compiling the model
    adam = keras.optimizers.adam(lr=0.1)
    model.compile(optimizer=adam,
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])


def train(train_xs, train_ys, test_xs, test_ys):
    """Trains the model"""
    print("Training the model...")
    model.fit(train_xs, train_ys,
              batch_size=BATCH_SIZE,
              validation_data=(test_xs, test_ys),
              epochs=10,
              #shuffle=True,
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
    print(predicted_y, actual_y)


mobilenet = load_mobilenet()
pickle_path = 'data/Pickle Objects/'

file_name = 'test_xs'
test_xs = load_pickle_object(file_name, pickle_path)
file_name = 'train_activations'
train_activations = load_pickle_object(file_name, pickle_path)
file_name = 'test_activations'
test_activations = load_pickle_object(file_name, pickle_path)
file_name = 'train_ys'
train_ys = load_pickle_object(file_name, pickle_path)
file_name = 'test_ys'
test_ys = load_pickle_object(file_name, pickle_path)

# Creating and training the model
create_model()
train(train_activations, train_ys, test_activations, test_ys)
evaluate(test_activations, test_ys)
predict_random(test_xs, test_ys, image=True)

# Saving the model and it's weights
tfjs.converters.save_keras_model(model, 'Model')
model.save_weights('Model/model.h5')
