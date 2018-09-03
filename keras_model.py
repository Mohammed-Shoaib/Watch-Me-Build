import json
import pickle
import numpy as np
import keras
from keras.models import Sequential
from keras.layers import Conv2D
from keras.layers import MaxPooling2D
from keras.layers import Flatten
from keras.layers import Dense
from keras.applications import MobileNet
import tensorflowjs as tfjs

print("Done importing")

NUM_CLASSES = 2
BATCH_SIZE = 64
labels = {'A': 0, 'Y': 1}


def load_mobilenet():
    """Loads the MobileNet model"""
    print("Loading the MobileNet model...")
    mobilenet = MobileNet(weights='imagenet')
    print("Model Loaded.")
    layer = mobilenet.get_layer('conv_pw_13_relu')
    return keras.Model(inputs=mobilenet.inputs, outputs=layer.output)


def load_data(file_path):
    """Loads the data file"""
    print("Loading the json data...")
    with open(file_path, 'r') as f:
        data = json.load(f)
    data = preprocess_data(data)
    print("Data Loaded.")
    return data


def preprocess_data(data):
    """Pre-Processes the data"""
    print("Pre-processing the data...")
    data = np.array(data['entries'])
    # Shuffling the data
    np.random.shuffle(data)
    for entry in data:
        # Converting from GRAYSCALE to RGB by duplication of values
        for i in range(len(entry['pixels'])):
            pixel = entry['pixels'][i]
            entry['pixels'][i] = np.full(3, pixel)
        # Shaping the pixels to a 224×224×3 numpy array
        entry['pixels'] = np.array(entry['pixels'])
        entry['pixels'] = np.reshape(entry['pixels'],(224,224,3))
        # Converting letters to numbers from 0-26
        entry['label'] = labels[entry['label']]
    print("Data pre-processed.")
    return data


def create_data(data):
    """Gets the data and split it into training and test sets"""
    print("Creating the training and test sets...")

    data_pixels = []
    data_labels = []
    for entry in data:
        data_pixels.append(entry['pixels'])
        data_labels.append(entry['label'])

    # Splitting the data
    offset = int(len(data)*0.7)
    train_xs = np.array(data_pixels[:offset])
    train_ys = np.array(data_labels[:offset])
    test_xs = np.array(data_pixels[offset:])
    test_ys = np.array(data_labels[offset:])

    # One-Hot encoding for the labels
    train_ys = keras.utils.to_categorical(train_ys, NUM_CLASSES)
    test_ys = keras.utils.to_categorical(test_ys, NUM_CLASSES)
    print("Data created.")
    return [(train_xs, train_ys), (test_xs, test_ys)]


def create_pickle(file_path, pickle_path):
    """Creates pickle object of the loaded data file"""
    data = load_data(file_path)
    pickle_out = open(pickle_path, 'wb')
    pickle.dump(data, pickle_out)
    pickle_out.close()


def load_pickle(file_path, pickle_path):
    """Loads the pickle object"""
    print("Loading the pickle object...")
    pickle_in = open('data_object.pickle', 'rb')
    data = pickle.load(pickle_in)
    pickle_in.close()
    print("Object Loaded.")
    return data


def create_model():
    """Creates the model"""
    global model

    model = Sequential()

    # Creating the hidden layers
    # Conv Layer
    model.add(Conv2D(input_shape=(7, 7, 1024),
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
    sgd = keras.optimizers.SGD(lr=0.1)
    model.compile(optimizer=sgd,
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])


def train(train_xs, train_ys, test_xs, test_ys):
    """Trains the model"""
    print("Training the model...")
    model.fit(train_xs, train_ys,
              batch_size=BATCH_SIZE,
              validation_data=(test_xs, test_ys),
              epochs=10000,
              shuffle=True,
              verbose=1)

    # Checking how well the model performed
    score = model.evaluate(test_xs, test_ys, verbose=0)
    print('Test Loss:', score[0])
    print('Test Accuracy: ', score[1])


mobilenet = load_mobilenet()

# Create pickle object of activations
# print("Getting activations")
# xs = mobilenet.predict(train_xs)
# pickle_out = open('train_xs.pickle', 'wb')
# pickle.dump(xs, pickle_out)
# pickle_out.close()
# xs = mobilenet.predict(test_xs)
# pickle_out = open('test_xs.pickle', 'wb')
# pickle.dump(xs, pickle_out)
# pickle_out.close()

file_path = 'data/data_100Examples.json'
pickle_path = 'data_object.pickle'
data = load_pickle(file_path, pickle_path)
(train_xs, train_ys), (test_xs, test_ys) = create_data(data)
pickle_in = open('train_xs.pickle','rb')
train_xs = pickle.load(pickle_in)
pickle_in.close()
pickle_in = open('test_xs.pickle','rb')
test_xs = pickle.load(pickle_in)
pickle_in.close()

# Creating and training the model
create_model()
train(train_xs,train_ys,test_xs,test_ys)

# Saving the model and it's weights
model.save_weights('model.h5')
tfjs.converters.save_keras_model(model, 'Model')