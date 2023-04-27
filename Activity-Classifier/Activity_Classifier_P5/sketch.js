let serialOptions = { baudRate: 115200 };
let acc_read = []; // tracks the new shape fraction off serial
let serial; // the Serial object
let pHtmlMsg; // used for displaying messages via html (optional)
let queue = []

let model; // holds an instance of tensorflow model
let Modelisloaded=false; // Boolean True when model is loaded

let predictionReady = false;

let finalPrediction = -1;
let finalPredAccuracy = null;
let finalPredictionReady = false;

let startRecord = false;

let prediction;

function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
  pHtmlMsg.html(error);
}

function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
  pHtmlMsg.html("Serial connection opened successfully");
}

function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  pHtmlMsg.html("onSerialConnectionClosed");
}

async function preload() { // loades the LSTM Model
    // loads the LSTM model from local server
    model = await tf.loadLayersModel('https://raw.githubusercontent.com/ghadeersawalha/Activity-Recognition/main/Activity-Classifier/Activity_Classifier_P5/model.json?token=GHSAT0AAAAAACB5SXWIZGJR7DPG6SQMH4USZCJZ2CA');
    console.log(model.summary())
    Modelisloaded=true;
}

function onSerialDataReceived(eventSender, newData) {
  pHtmlMsg.html("onSerialDataReceived: " + newData);

  if (newData.startsWith("DATA:")) {
      // Remove the "DATA:" keyword and split the string into an array of substrings using the `split()` function
      let arr = newData.substring(5).split(';');

      // Use the `map()` function to convert each substring into an array of floats
      let xyz = arr.map(function(substr) {
          let coords = substr.split(',').map(parseFloat);
          return coords.slice(0, 3); // Ensure only x, y, and z are used
      });

      if (startRecord) {
          for (let i = 0; i < xyz.length; i++) {
              queue.push(xyz[i]);
          }
      }
  }
}

function setup() {
  createCanvas(400, 400);
  
  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // If we have previously approved ports, attempt to connect with them
  serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

  // Add in a lil <p> element to provide messages. This is optional
  pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");
  createButton("Record").mousePressed(startRecording);
  createButton("Connect to Serial").mousePressed(findASerialPort);
}

function startRecording() {
  startRecord = true;
  console.log(`Start record: ${startRecord}`);
}

function findASerialPort() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}

function draw() {
  background(0);
  textSize(50);
  textAlign(CENTER, CENTER);

  if(startRecord){
    fill(255, 0, 0);
    text('Recording...', width/2, height/2);
  } else if(finalPredictionReady){
    fill(255);
    text(showPrediction(finalPrediction), width/2, height/2);
    textSize(20);
    fill(100, 255, 0);
    text('Accuracy: ' + round(finalPredAccuracy * 100) + '%', width/2, height/1.5);
  } else {
    fill(255);
    text('No Prediction', width/2, height/2);
  }

  if(Modelisloaded && !startRecord){

    if(queue.length >= 25){
      startRecord = false;
      predictionReady = false;
      finalPredictionReady = false;

      // Take the first 25 elements from the queue
      let frame = queue.splice(0, 25);

      // Call the function on the frame
      predict(frame);
    }
  }
}

async function predict(frame) {
  const inputTensor = tf.tensor4d([frame], [1, 25, 3, 1]);
  const outputTensor = model.predict(inputTensor);
  const outputData = await outputTensor.data();

  // Find the index of the max value in the outputData array
  const predictedClass = outputData.indexOf(Math.max(...outputData));
  finalPrediction = predictedClass;
  finalPredAccuracy = outputData[predictedClass];
  finalPredictionReady = true;
}

function showPrediction(prediction) {
  let predictionText;

  // Set the predictionText based on the prediction value
  switch (prediction) {
    case 0:
      predictionText = "Antalgic";
      break;
    case 1:
      predictionText = "Falling";
      break;
    case 2:
      predictionText = "Parkinsons";
      break;
    case 3:
      predictionText = "Walking";
      break;
    default:
      predictionText = "Invalid prediction";
      break;
  }

  // Display the predictionText using the text() function
  return predictionText;
}
