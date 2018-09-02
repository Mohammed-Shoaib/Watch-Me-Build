import json
import keras
from keras.models import Sequential
from keras.layers import Flatten
from keras.layers import Dense

print("Done importing")

NUM_CLASSES = 2


# Function to get the data and split it into training and test sets
def create_data():
    print("Loading the data...")
    file_path = 'data/data.json'
    with open(file_path, 'r') as f:
        data = json.load(f)
    print("Data Loaded.")


# Function to create the model
def create_model():
    global model

    # Creating a sequential model
    model = Sequential()

    # Creating the hidden layers
    # Flattening the output of the internal activation
    model.add(Flatten(input_shape=[7, 7, 256]))

    # Dense layer
    model.add(Dense(units=100,
                    activation='relu',
                    kernel_initializer='varianceScaling',
                    use_bias=True))

    # Output layer
    model.add(Dense(units=NUM_CLASSES,
                    activation='softmax',
                    kernel_initializer='VarianceScaling',
                    use_bias=False))

    # Compiling the model
    adam = keras.optimizers.adam(lr=0.1)
    model.compile(optimizer=adam,
                  loss='categorical_crossentropy')


create_data()
