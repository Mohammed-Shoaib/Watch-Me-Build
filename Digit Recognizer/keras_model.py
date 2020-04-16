import keras
from keras.models import Sequential
from keras.layers import Conv2D
from keras.layers import MaxPooling2D
from keras.layers import Flatten
from keras.layers import Dense
from keras.datasets import mnist
import tensorflowjs as tfjs

print('Done importing')


# Function to get the mnist data and split it into train and test sets
def create_data():
    global train_xs, train_ys, test_xs, test_ys

    # Loading the data
    (train_xs, train_ys), (test_xs, test_ys) = mnist.load_data()

    # Shaping the train and test batch
    train_xs = train_xs.reshape(train_xs.shape[0], 28, 28, 1)
    test_xs = test_xs.reshape(test_xs.shape[0], 28, 28, 1)

    # Casting from int to float values
    train_xs = train_xs.astype('float32')
    test_xs = test_xs.astype('float32')

    # Normalizing the values between 0 and 1
    train_xs /= 255
    test_xs /= 255

    # One-Hot Encoding for the labels
    train_ys = keras.utils.to_categorical(train_ys, 10)
    test_ys = keras.utils.to_categorical(test_ys, 10)


# Function to create the model
def create_model():
    global model
    model = Sequential()

    # Creating the hidden layers
    # Conv Layer
    model.add(Conv2D(input_shape=(28, 28, 1),
                     kernel_size=5,
                     filters=8,
                     strides=1,
                     activation='relu',
                     kernel_initializer='VarianceScaling'))

    # Pooling layer to halve the output from previous layer
    model.add(MaxPooling2D(pool_size=(2, 2), strides=2))

    # Conv layer
    model.add(Conv2D(kernel_size=5,
                     filters=16,
                     strides=1,
                     activation='relu',
                     kernel_initializer='VarianceScaling'))

    # Pooling layer to halve the output from previous layer
    model.add(MaxPooling2D(pool_size=(2, 2), strides=2))

    # Flatten layer to flatten to output of the previous layer to a vector
    model.add(Flatten())

    # Output layer
    model.add(Dense(units=10,
                    activation='softmax',
                    kernel_initializer='VarianceScaling'))

    # Compiling the model
    sgd = keras.optimizers.SGD(lr=0.1)
    model.compile(optimizer=sgd,
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    # Defining the parameters
    global train_batch_size
    global train_iterations
    global validation_batch_size
    global validation_iteration_frequency
    train_batch_size = 64


# Training the model
def train():
    print('Training the Model...')
    model.fit(train_xs, train_ys,
              batch_size=train_batch_size,
              validation_data=(test_xs, test_ys),
              epochs=5,
              shuffle=True,
              verbose=1)

    # Checking how well the model performed
    score = model.evaluate(test_xs, test_ys, verbose=0)
    print('Test loss:', score[0])
    print('Test accuracy:', score[1])


create_data()
create_model()
train()
tfjs.converters.save_keras_model(model, 'Model')
