# Boxing Classifier

## Introduction
This project aims to classify different boxing punches using data collected from an ESP32. The project consists of two Arduino codes for the ESP32, one for data collection and one for streaming data serially through Bluetooth, a Python notebook for preprocessing, building, training and evaluating the model, and a p5.js application for providing a user interface for interacting with the trained model.

## Hardware Requirements
- ESP32
- Additional equipment for data collection (e.g. accelerometer)

## Software Requirements
- Arduino IDE with ESP32 support
- Required libraries for ESP32 code
- Python 3 with necessary libraries (e.g. TensorFlow, pandas)
- p5.js library for the user interface

## Data Collection
The data was collected using the ESP32 and an accelerometer. The data was collected at a frequency of X Hz and contains Y variables (e.g. acceleration in 3 axes). Data was preprocessed by removing any unnecessary columns and normalizing the values.

## Model Building and Training
The model was built using an LSTM architecture with X hidden units and Y timesteps. The model was trained using a training set of Z samples and evaluated using a validation set of W samples. The model achieved an accuracy of X% on the validation set.

## Deployment
The trained model was exported and integrated into the p5.js application using the p5.ml5 library. Additional code was added to handle input data and display the model's predictions on the user interface.

## User Interface
The user interface allows the user to start and stop data collection, view the model's predictions in real-time, and view a log of past predictions.

## Conclusion
This project demonstrates the use of an ESP32 for data collection, LSTM for time series classification and p5.js for user interface. However, there is still room for improvement by increasing the number of training samples, and trying other architectures.

## Attribution
- [Name of library or code used](link)

## License
This project is licensed under [Name of License](link)
You can modify the template according to your needs, you might also add images, diagrams or flowcharts to help understand the project better.
