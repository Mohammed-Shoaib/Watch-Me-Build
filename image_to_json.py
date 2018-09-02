import os
import json
from PIL import Image

root_path = 'data/'

# Loading the json file
data_file = 'data.json'
with open(root_path + data_file) as f:
    data = json.load(f)

# Getting the pixels for each image for each label in the data folder
labels = os.listdir(root_path)
for label in labels:
    label_dir = label
    label_dir = root_path + label_dir
    if os.path.isfile(label_dir):
        continue
    else:
        label_dir += '/'
    label_images = os.listdir(label_dir)
    for i in range(len(label_images)):
        im = Image.open(label_dir + label_images[i])
        pixels = list(im.getdata())
        for j in range(len(pixels)):
            pixels[j] = list(pixels[j])
        pixels = str(pixels)
        new_data = {"pixels": pixels, "label": label}
        data['entries'].append(new_data)
        print("Finished {} of {} from {}".format((i+1),(len(label_images)),label))

# Writing the data back to the json file
print("Started writing the data to the json file...")
with open(root_path + data_file, 'w') as f:
    json.dump(data, f, indent=2)
print("Finished writing the data to the json file.")

# Removing the quotation marks before/after brackets
print("Started formatting the content of the json file...")
with open(root_path + data_file, 'r') as f:
    content = f.read()
    content = content.replace('"[[','[[')
    content = content.replace(']]"',']]')
print("Finished formatting the content of the json file.")

print("Started writing the formatted data to the json file...")
with open(root_path + data_file, 'w') as f:
    f.write(content)
print("Finished writing the formatted data to the json file.")