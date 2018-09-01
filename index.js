let cnv, size;
let messageP,trainLossP,trainAccuracyP;
let mobilenet,model,capture,json_data;

const NUM_CLASSES = 2;
const BATCH_SIZE = 64;
const IMG_WIDTH = 224;
const IMG_HEIGHT = 224;

function windowResized(){
	resetSketch();
}

async function setup(){
	// To have uniformity for pixels across multiple devices
	pixelDensity(1);

	// Creating the canvas
	cnv = createCanvas(IMG_WIDTH,IMG_HEIGHT);
	cnv.style('display','block');
	cnv.parent('canvas-container');

	// Creating the webcam element
	let aspectRatio = 640/480;
	capture = createCapture(VIDEO);
	capture.parent('webcam-container');
	capture.size(IMG_WIDTH*aspectRatio,IMG_HEIGHT*aspectRatio);

	// Loading the mobilenet model
	mobilenet = await loadMobileNet();
	console.log("Model Loaded.");

	// Initializing the variables
	messageP = $(document.getElementById('messageP'));
	trainLossP = $(document.getElementById('trainLossP'));
	trainAccuracyP = $(document.getElementById('trainAccuracyP'));
	addExamplesB = $(document.getElementById('addExamplesB'));
	trainB = $(document.getElementById('trainB'));
	predictB = $(document.getElementById('predictB'));

	// Defining the onClick functions for the buttons
	addExamplesB.click(async() => {
		let pose = $(document.getElementById('pose')).val();
		let numOfExamples = $(document.getElementById('numOfExamples')).val();
		if(numOfExamples<0 || numOfExamples.length<=0)
			messageP.html('Please enter a number!');
		else if(pose.length<=0)
			messageP.html('Please enter a Pose!');
		else{
			messageP.html('Adding Examples...');
			for(let i=1 ; i<=numOfExamples ; i++){
				messageP.html(`Example ${i}`);
				let x = await createWebcamTensor().data();
				await tf.nextFrame();
				let y = Number(pose);
				json_data.push({x,y});
			}
			messageP.html('Done adding Examples.');
		}
	});
	trainB.click(() => {
		let trainIterations = Number($(document.getElementById('trainIterations')).val());
		if(trainIterations.length<=0)
			messageP.html('Please enter a number!');
		else
			train();
	});
	predictB.click(() => {});

	json_data = [];
	createModel();
}

function resetSketch(){
}

async function draw(){
	// Drawing the webcam element
	background(0);
	image(capture,0,0);
	filter(THRESHOLD,0.7);
}

// Returns a model that outputs an internal activation.
async function loadMobileNet(){
	const mobilenet = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
  const layer = mobilenet.getLayer('conv_pw_13_relu');
  return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

function createModel(){
	model = tf.sequential();
	model.add(tf.layers.flatten({inputShape: [7,7,256]}));
	model.add(tf.layers.dense({
		units: 100,
		activation: 'relu',
		kernelInitializer: 'varianceScaling',
		useBias: true
	}));
	model.add(tf.layers.dense({
		units: NUM_CLASSES,
		activation: 'softmax',
		kernelInitializer: 'varianceScaling',
		useBias: false
	}));

	model.compile({
		optimizer: tf.train.adam(0.1),
		loss: 'categoricalCrossentropy'
	});
}

async function train(){
	// Creating the Tensors
	let xs = [];
	let ys = [];
	for(let i=0 ; i<json_data.length ; i++){
		for(let j=0 ; j<json_data[i].x.length ; j++)
			xs.push(json_data[i].x[j]);
		ys.push(json_data[i].y);
	}
	let train_xs = tf.tensor4d(xs,[json_data.length,IMG_WIDTH,IMG_HEIGHT,1],'float32');
	let train_ys = tf.oneHot(ys,NUM_CLASSES);

	// Defining config properties
	let config = {
		batchSize: BATCH_SIZE,
		epochs: 1,
		callbacks: {onBatchEnd: tf.nextFrame}
	};

	// Training the model
	// await model.fit(train_xs,train_ys,config).then((response) => {
	// 	let loss = response.history.loss[0].toFixed(6);
	// 	trainLossP.html(`Loss: ${loss}`);
	// 	let accuracy = (response.history.acc[0]*100).toFixed(2);
	// 	trainAccuracyP.html(`Accuracy: ${accuracy}%`);
	// 	let iterations = i+1;
	// 	trainIterationP.html(`Iterations: ${iterations}`);
	// });
}


// Helper functions

function createWebcamTensor(){
	// Get the img from the canvas and normalize the values
	let webcamImg = [];
	loadPixels();
	for(let j=0 ; j<height ; j++){
		for(let i=0 ; i<width ; i++){
			let pix = (i + j*width)*4;
			webcamImg.push(map(pixels[pix],0,255,0,1));
		}
	}
	return tf.tidy(() => {
	const webcamImage = tf.tensor3d(webcamImg,[width,height,1]);
	const croppedImage = cropImage(webcamImage);
	const batchedImage = croppedImage.expandDims(0);
	return batchedImage.toFloat().div(127).sub(1);
	});
}

function cropImage(img) {
  const size = Math.min(img.shape[0], img.shape[1]);
  const centerWidth = img.shape[0] / 2;
  const beginWidth = centerWidth - (size / 2);
  const centerHeight = img.shape[1] / 2;
  const beginHeight = centerHeight - (size / 2);
  return img.slice([beginWidth, beginHeight], [size, size]);
}
