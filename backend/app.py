from flask import Flask, request, jsonify
import pandas as pd
import os
import json
import tempfile


import pydp as dp
from pydp.algorithms.laplacian import BoundedMean
from pydp.algorithms.laplacian import BoundedSum

app = Flask(__name__)
import pandas as pd

def private_sum(dataset, epsilonValues, checkedValues):
    if len(dataset.columns) == 0:
        return dataset

    print("Epsilon values: " + str(epsilonValues))
    print("Dataset cols = ", str(dataset.columns))

    for column, epsilon, anonymize in zip(dataset.columns[1:], epsilonValues, checkedValues):
        x = BoundedSum(epsilon=epsilon, delta=0, lower_bound=0, upper_bound=100, dtype="float")
        if not anonymize: continue
        # if not dataset[column].dtype == 'float64': continue
        dataset[column] = dataset[column].apply(lambda value: x.quick_result([value]))

    return dataset


@app.route('/dataset', methods=['POST'])
def dataset():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Save the file to a temporary location
    temp_dir = tempfile.TemporaryDirectory()
    file_path = os.path.join(temp_dir.name, file.filename)
    file.save(file_path)

    # Read the content of the file
    with open(file_path, 'r') as csv_file:
        csv_content = csv_file.read()


    # Return the filename, content, and epsilonValues in the response
    return jsonify({
        'filename': file.filename,
        'content': csv_content,
    })


@app.route('/anonymize', methods=['POST'])
def anonymize():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Save the file to a temporary location
    temp_dir = tempfile.TemporaryDirectory()
    file_path = os.path.join(temp_dir.name, file.filename)
    file.save(file_path)

    # Read the content of the file
    with open(file_path, 'r') as csv_file:
        csv_content = csv_file.read()

    # Load the dataset from the file
    dataset = pd.read_csv(file_path)

    # Extract epsilonValues from the request payload
    epsilonValues = request.form.get('epsilonValues')
    epsilonValues = json.loads(epsilonValues)

    # Extract checked Values from the request payload
    checkedValues = request.form.get('checkedValues')
    checkedValues = json.loads(checkedValues)

    # Apply differential privacy (bounded sum) to the dataset
    modified_dataset = private_sum(dataset.copy(), epsilonValues, checkedValues)

    # Save the modified dataset to a temporary file
    modified_file_path = os.path.join(temp_dir.name, 'modified_dataset.csv')
    modified_dataset.to_csv(modified_file_path, index=False)

    # Read the content of the modified file
    with open(modified_file_path, 'r') as modified_file:
        csv_content_anon = modified_file.read()

    # Clean up the temporary directory
    temp_dir.cleanup()

    # Return the filename, content, and epsilonValues in the response
    return jsonify({
        'filename': file.filename,
        'content_anon': csv_content_anon,
        'epsilons': epsilonValues
    })

from flask import send_file

@app.route('/get_file', methods=['GET'])
def get_file():
    filename = request.args.get('filename')

    if not filename:
        return jsonify({'error': 'No filename specified'})

    # Assuming the file is in the same directory as your Flask app
    file_path = os.path.join(os.path.dirname(__file__), filename)

    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'})

    # Return the file to the client
    return send_file(file_path, as_attachment=True)


@app.route('/')
def hello_geek():
    return '<h1>Hello from Flask & Docker</h1>'

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int("5000"), debug=True)
    # app.run(debug=True)