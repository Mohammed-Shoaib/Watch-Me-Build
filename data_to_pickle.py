import os
import json
import pickle
import numpy as np
from math import ceil
import keras
from keras.applications import MobileNet

print("Done importing")
NUM_CLASSES = 2
mapping = {'A': 0, 'Y': 1}


def load_mobilenet():
    """Loads the MobileNet model"""
    print("Loading the MobileNet model...")
    mobilenet = MobileNet(alpha=0.25)
    print("Model Loaded.")
    layer = mobilenet.get_layer('conv_pw_13_relu')
    return keras.Model(inputs=mobilenet.inputs, outputs=layer.output)


def load_json_file(file_path):
    """Loads the data file"""
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data


def load_json_s():
    s = '''
    {
        "entries": []
    }
    '''
    data = json.loads(s)
    return data


def preprocess_data(data):
    """Pre-Processes the data"""
    print("Pre-processing the data...")
    data = np.array(data['entries'])
    # Shuffling the data
    np.random.shuffle(data)
    for i in range(len(data)):
        # Converting from GRAYSCALE to RGB by duplication of values
        for j in range(len(data[i]['pixels'])):
            # Normalizing the values from 0 to 255 to -1 to 1
            pixel = data[i]['pixels'][j]
            pixel = pixel/127 - 1
            pixel = int(pixel)
            data[i]['pixels'][j] = np.full(3, pixel)
        # Shaping the pixels to a 224×224×3 numpy array
        data[i]['pixels'] = np.array(data[i]['pixels'])
        data[i]['pixels'] = np.reshape(data[i]['pixels'], (224, 224, 3))
        # Converting letters to numbers from 0-26
        data[i]['label'] = mapping[data[i]['label']]
        print("Finished Pre-processing {} of {}".format((i+1), len(data)))
    print("Data pre-processed.")
    return data


def load_data():
    data = load_json_s()
    for label in labels:
        label_dir = data_path + label + '/'
        label_1000_dir = os.listdir(label_dir)
        for label_1000 in label_1000_dir:
            file_path = label_dir + label_1000
            print("Loading " + label_1000)
            data_1000 = load_json_file(file_path)
            data['entries'].extend(data_1000['entries'])
    return data


def split_data(data):
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


def create_pickle(data, pickle_path):
    """Creates pickle object for a given data"""
    pickle_out = open(pickle_path, 'wb')
    pickle.dump(data, pickle_out)
    pickle_out.close()


def get_activations(xs):
    """Get the activations from internal layer for a set of images using mobilenet"""
    print("Getting activations")
    xs_activations = []
    for i in range(len(xs)):
        x = np.expand_dims(xs[i], axis=0)
        x = mobilenet.predict(x)
        x = np.squeeze(x, axis=0)
        xs_activations.append(x)
        print("Finished activation {} of {}".format((i+1), len(xs)))
    xs_activations = np.array(xs_activations)
    return xs_activations


def chunk_data(data):
    """Splits the given data into chunks of 1000 values and creates their pickle objects"""
    total = ceil(len(data)/1000)
    data = np.array_split(data, total)
    return data


mobilenet = load_mobilenet()
data_path = 'data/JSON Files/'
pickle_path = 'data/Pickle Objects/'
labels = os.listdir(data_path)
data = load_data()
data = preprocess_data(data)
(train_xs, train_ys), (test_xs, test_ys) = split_data(data)
train_activations = get_activations(train_xs)
test_activations = get_activations(test_xs)


# Chuncking the data
data = chunk_data(data)
train_xs = chunk_data(train_xs)
train_ys = chunk_data(train_ys)
test_xs = chunk_data(test_xs)
test_ys = chunk_data(test_ys)
train_activations = chunk_data(train_activations)
test_activations = chunk_data(test_activations)


# Creating Pickle Objects
print("Creating Pickle Objects...")

print('Creating data file')
for i in range(len(data)):
    file_path = pickle_path + 'data/' + 'data' + str(i+1) + '.pickle'
    create_pickle(data[i], file_path)

print('Creating train_xs file')
for i in range(len(train_xs)):
    file_path = pickle_path + 'train_xs/' + 'train_xs' + str(i+1) + '.pickle'
    create_pickle(train_xs[i], file_path)

print('Creating train_ys file')
for i in range(len(train_ys)):
    file_path = pickle_path + 'train_ys/' + 'train_ys' + str(i+1) + '.pickle'
    create_pickle(train_ys[i], file_path)

print('Creating test_xs file')
for i in range(len(test_xs)):
    file_path = pickle_path + 'test_xs/' + 'test_xs' + str(i+1) + '.pickle'
    create_pickle(test_xs[i], file_path)

print('Creating test_ys file')
for i in range(len(test_ys)):
    file_path = pickle_path + 'test_ys/' + 'test_ys' + str(i+1) + '.pickle'
    create_pickle(test_ys[i], file_path)

print('Creating train_activations file')
for i in range(len(train_activations)):
    file_path = pickle_path + 'train_activations/' + 'train_activations' + str(i+1) + '.pickle'
    create_pickle(train_activations[i], file_path)

print('Creating test_activations file')
for i in range(len(test_activations)):
    file_path = pickle_path + 'test_activations/' + 'test_activations' + str(i+1) + '.pickle'
    create_pickle(test_activations[i], file_path)

print("Created Objects.")