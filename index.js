let cnv, size;
let mobilenet, model, capture;
let messageP, saveExamplesB, predictB, predictP, predictC, predictFrame;
let count;

const LABELS = {'A': 0, 'Y': 1};
const NUM_CLASSES = 2;
const IMG_WIDTH = 224;
const IMG_HEIGHT = 224;

async function setup(){
	// To have uniformity for pixels across multiple devices
	pixelDensity(1);

	// Creating the canvas
	cnv = createCanvas(IMG_WIDTH,IMG_HEIGHT);
	cnv.style('display','block');
	cnv.parent('canvas-container');

	// Creating the webcam element
	capture = createCapture(VIDEO);
	capture.parent('webcam-container');

	// Initializing the variables
	messageP = $(document.getElementById('messageP'));
	saveExamplesB = $(document.getElementById('saveExamplesB'));
	predictP = $(document.getElementById('predictP'));
	predictB = $(document.getElementById('predictB'));
	predictC = $(document.getElementById('predictC'));
	predictFrame = false;

	// Loading the pretrained models
	messageP.html('Loading the model...');
	mobilenet = await loadMobileNet();
	model = await tf.loadModel('./Model/model.json');
	messageP.html("Model Loaded.");

	// Defining the onClick functions for the buttons
	saveExamplesB.click(async() => {
		let pose = $(document.getElementById('pose')).val();
		let numOfExamples = $(document.getElementById('numOfExamples')).val();
		if(numOfExamples<0 || numOfExamples.length<=0)
			messageP.html('Please enter a number!');
		else if(pose.length<=0)
			messageP.html('Please enter a Pose!');
		else
			saveExamples(pose, numOfExamples);
	});
	predictB.click(predict);
	predictC.click(() => {
		if(predictC.is(':checked')){
			predictFrameD = $(document.getElementById('predictFrame'));
			predictFrameD.hide();
			predictFrame = true;
		}else{
			predictFrameD = $(document.getElementById('predictFrame'));
			predictFrameD.show();
			predictFrame = false;
		}
	});
	count = 0;
}

async function draw(){
	// Drawing the webcam element
	if(capture.loadedmetadata){
		let aspectRatio = capture.width/capture.height;
		let new_width = capture.width;
		let new_height = capture.height;
		if (capture.width >= capture.height)
			new_width = IMG_WIDTH * aspectRatio;
		else if (capture.width < capture.height)
			new_height = IMG_HEIGHT / aspectRatio;
		capture.size(new_width, new_height);
	}
	background(0);
	image(capture,0,0);
	filter(THRESHOLD,0.7);
	filter(INVERT);
	if(predictFrame){
		if(count%60 == 0){
			await predict();
			count = 0;
		}
		count++;
	}
}

async function predict(){
	let x = await createWebcamTensor();
	let activation = await mobilenet.predict(x);
	let y = tf.tidy(() => model.predict(activation).argMax(1));
	let output = await y.data();
	for(key in LABELS)
		if(LABELS[key] == output)
			predictP.html(`Prediction: ${key}`);
	// Memory management
	x.dispose();
	activation.dispose();
	y.dispose();
}



// Helper functions

// Returns a model that outputs an internal activation.
async function loadMobileNet(){
	const mobilenet = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
	const layer = mobilenet.getLayer('conv_pw_13_relu');
	return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

// Function to save the canvas as example for training the model
// The pose label and the number of examples to save is given by the user
async function saveExamples(pose, numOfExamples){
	messageP.html('Adding Examples...');
	let poseCount = 1;
	for(let i=1 ; i<=numOfExamples ; i++){
		messageP.html(`Example ${i}`);
		save(`${pose}(${poseCount}).jpg`)
		for(let i=0 ; i<10 ; i++)
			await tf.nextFrame();
		poseCount++;
	}
	messageP.html('Done adding Examples.');
}

// Function to take the canvas and convert it to a tensor with the format of MobileNet
function createWebcamTensor(){
	// Get the img from the canvas and normalize the values
	let webcamImg = [];
	loadPixels();
	for(let j=0 ; j<height ; j++){
		for(let i=0 ; i<width ; i++){
			let pix = (i + j*width)*4;
			webcamImg.push(map(pixels[pix+0], 0, 255, -1, 1));
			webcamImg.push(map(pixels[pix+1], 0, 255, -1, 1));
			webcamImg.push(map(pixels[pix+2], 0, 255, -1, 1));
		}
	}
	webcamImg = tf.tensor4d(webcamImg, [1, 224, 224, 3]);
	return webcamImg;
}
