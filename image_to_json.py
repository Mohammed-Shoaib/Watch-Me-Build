import os
import json
from PIL import Image


def create_json_file(data, file_path):
    """Creates a json file with the data"""
    # Writing the data to the json file
    print("Started writing the data to the json file...")
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    print("Finished writing the data to the json file.")

    # Removing the quotation marks before/after brackets
    print("Started formatting the content of the json file...")
    with open(file_path, 'r') as f:
        content = f.read()
        content = content.replace('"[', '[')
        content = content.replace(']"', ']')
    print("Finished formatting the content of the json file.")

    print("Started writing the formatted data to the json file...")
    with open(file_path, 'w') as f:
        f.write(content)
    print("Finished writing the formatted data to the json file.")


def load_json_s():
    """Creates an empty json object"""
    s = '''
    {
        "entries": []
    }
    '''
    data = json.loads(s)
    return data


# Getting the pixels for each image for each label in the data folder
root_path = 'data/'
labels = os.listdir(root_path + 'Images/')
for label in labels:
    label_dir = root_path + 'Images/' + label
    if os.path.isfile(label_dir):
        continue
    else:
        label_dir += '/'
    label_1000_dir = os.listdir(label_dir)
    for label_1000 in label_1000_dir:
        # File Path
        file_path = root_path + 'JSON Files/' + label + '/'

        # Checking if the directory exists
        if not os.path.isdir(file_path):
            os.makedirs(file_path)
        
        # Checking if this directory has already been completed.
        files = os.listdir(file_path)
        for i in range(len(files)):
            files[i] = files[i][:-5]
        if label_1000 in files:
            continue

        # Getting all the images in the directory and storing in a data object
        label_dir = root_path + 'Images/' + label + '/'
        label_dir = label_dir + label_1000 + '/'
        label_images = os.listdir(label_dir)
        data = load_json_s()
        for i in range(len(label_images)):
            im = Image.open(label_dir + label_images[i])
            pixels = list(im.getdata())
            for j in range(len(pixels)):
                pixels[j] = pixels[j][0]
            pixels = str(pixels)
            new_data = {"pixels": pixels, "label": label}
            data['entries'].append(new_data)
            print("Finished {} of {} from {}".format((i+1), (len(label_images)), label_1000))

        # Saving the data in a json file
        file_path += label_1000 + '.json'
        create_json_file(data, file_path)
