let cnv,size,factor;
let data,isDataLoaded,model;
let totalPoints,maxPoints,isMousePressed;
let messageP;
let trainP,trainLossP,trainAccuracyP,trainIterationP;
let testP,testLossP,testAccuracyP;
let predictP;
let trainBatchSize,testBatchSize,validationBatchSize;
let trainIterations,validationIterationFrequency;

function windowResized(){
	let contentInnerWidth,update;
	let contentInnerHeight = 500;

	// Resizing all the plots
	contentInnerWidth = $('#lossChart').innerWidth()*0.9;
	update = {width: contentInnerWidth, height: contentInnerHeight};
	Plotly.relayout('lossChart', update);

	contentInnerWidth = $('#accuracyChart').innerWidth()*0.9;
	update = {width: contentInnerWidth, height: contentInnerHeight};
	Plotly.relayout('accuracyChart', update);

	contentInnerWidth = $('#predictChart').innerWidth()*0.9;
	update = {width: contentInnerWidth, height: contentInnerHeight};
	Plotly.relayout('predictChart', update);
}

async function setup(){
	// To use the Pixel array
	pixelDensity(1);

	// Initializing the variables
	totalPoints = 0;
	maxPoints = 500;
	isMousePressed = false;
	messageP = $(document.getElementById('message'));
	loadB = $(document.getElementById('loadB'));
	trainB = $(document.getElementById('trainB'));
	testB = $(document.getElementById('testB'));
	predictB = $(document.getElementById('predictB'));
	clearB = $(document.getElementById('clearB'));

	// Defining the parameters
	trainBatchSize = testBatchSize = 64;
	trainIterations = 100;
	validationBatchSize = 1000;
	validationIterationFrequency = 5;

	// Initializing the size of the canvas
	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	size /= 2;
	// A factor to convert the 28×28 MNIST image to canvas size
	factor = floor(size/28);
	size = factor*28;

	// Creating the Train Results elements
	trainP = createP('Train Results: No Results').parent('train');
	trainLossP = createP('Loss: ').hide().parent('train');
	trainAccuracyP = createP('Accuracy: ').hide().parent('train');
	trainIterationP = createP('Iteration: ').hide().parent('train');

	// Creating the Test Results elements
	testP = createP('Test Results: No Results ').parent('test');
	testLossP = createP('Loss: ').hide().parent('test');
	testAccuracyP = createP('Accuracy: ').hide().parent('test');

	// Creating the predict element
	predictP = createP().hide().parent('predict');

	// Creating the canvas
	cnv = createCanvas(size,size);
	cnv.parent('canvas');
	background(0);
	stroke(255);
	strokeWeight(factor*2);

	// Defining the onClick functions for the buttons
	loadB.click(async() => {
		$(messageP).html('Loading the Model...');
		model = await tf.loadModel('./Model/model.json');
		compileModel();
		$(messageP).html('Model Loaded.');
	});
	trainB.click(() => {
		trainIterations = document.getElementById('trainIterations');
		trainIterations = $(trainIterations).val();
		if(isDataLoaded)
			train();
		else
			messageP.html('Data is still being loaded! Please wait...');
	});
	testB.click(() => {
		messageP.html('');
		if(isDataLoaded)
			test();
		else
			messageP.html('Data is still being loaded! Please wait...');
	});
	predictB.click(() => {
		let xs = canvasToMnistData();
		predict(xs);
	});
	clearB.click(() => {
		clear();
		background(0);
		stroke(255);
		strokeWeight(factor*2);
	});

	createPlot();
	createModel();

	// Loading the MNIST dataset
	messageP.html('Loading the Data...');
	data = new MnistData();
	await data.load();
	isDataLoaded = true;
	messageP.html('Data Loaded.');
}

function draw(){
	// Checking if points cross a certain amount to have relayout
	if(totalPoints > maxPoints){
		Plotly.relayout('lossChart',{
			xaxis: {range: [totalPoints-maxPoints,totalPoints]}
		});
		Plotly.relayout('accuracyChart',{
			xaxis: {range: [totalPoints-maxPoints,totalPoints]}
		});
	}

	// Drawing the number
	if(isMousePressed)
		line(pmouseX,pmouseY,mouseX,mouseY);
}

// Function to create all the plots
function createPlot(){
	let contentInnerWidth;
	let contentInnerHeight = 500;

	//Creating the loss plot
	contentInnerWidth = $('#lossChart').innerWidth()*0.9;
	let plotData = [{
		y: [],
		type: 'line',
		name: 'Loss',
		connectgaps: true
	}];
	let layout = {
		title: 'Loss Results',
		autosize: true,
		showlegend: true,
		margin: {l: 0, r: 0, p: 0},
		width: contentInnerWidth,
		height: contentInnerHeight,
		yaxis: {title: 'Loss'},
		xaxis: {title: 'Epoch'}
	};
	Plotly.newPlot('lossChart',plotData,layout);

	// Creating the accuracy plot
	contentInnerWidth = $('#accuracyChart').innerWidth()*0.9;
	plotData = [{
		y: [],
		type: 'line',
		name: 'Accuracy',
		line: {color: 'rgb(243, 156, 18)'},
		connectgaps: true
	}];
	layout = {
		title: 'Accuracy Results',
		autosize: true,
		showlegend: true,
		margin: {l: 0, r: 0, p: 0},
		width: contentInnerWidth,
		height: contentInnerHeight,
		xaxis: {title: 'Epoch'},
		yaxis: {title: 'Accuracy'}
	};
	Plotly.newPlot('accuracyChart',plotData,layout);

	// Creating the prediction plot
	contentInnerWidth = $('#predictChart').innerWidth()*0.9;
	plotData = [{
		x: [0,1,2,3,4,5,6,7,8,9],
		y: [],
		type: 'bar',
		marker:{
			color: [
				'rgba(192, 57, 43,0.75)',
				'rgba(155, 89, 182,0.75)',
				'rgb(41, 128, 185,0.75)',
				'rgba(26, 188, 156,0.75)',
				'rgba(39, 174, 96,0.75)',
				'rgba(241, 196, 15,0.75)',
				'rgba(230, 126, 34,0.75)',
				'rgba(52, 152, 219,0.75)',
				'rgba(142, 68, 173,0.75)',
				'rgba(231, 76, 60,0.75)'
		]},
	}];
	layout = {
		title: 'Prediction Results',
		autosize: true,
		showlegend: false,
		width: contentInnerWidth,
		height: contentInnerHeight,
		yaxis: {title: 'Score'},
		xaxis: {title: 'Number',dtick: 1},
	};
	Plotly.newPlot('predictChart',plotData,layout);
}

// Creating the model
function createModel(){
	model = tf.sequential();

	// Creating the hidden layers
	// Conv Layer
	model.add(tf.layers.conv2d({
		inputShape: [28,28,1],
		kernelSize: 5,
		filters: 8,
		strides: 1,
		activation: 'relu',
		kernelInitializer: 'VarianceScaling'
	}));

	// Pooling layer to halve the output from previous layer
	model.add(tf.layers.maxPooling2d({
		poolSize: 2,
		strides: 2
	}));

	// Conv layer
	model.add(tf.layers.conv2d({
		kernelSize: 5,
		filters: 16,
		strides: 1,
		activation: 'relu',
		kernelInitializer: 'VarianceScaling'
	}));

	// Pooling layer to halve the output from previous layer
	model.add(tf.layers.maxPooling2d({
		poolSize: 2,
		strides: 2
	}));

	// Flatten layer to flatten to output of the previous layer to a vector
	model.add(tf.layers.flatten());

	// Output layer
	model.add(tf.layers.dense({
		units: 10,
		activation: 'softmax',
		kernelInitializer: 'VarianceScaling'
	}));

	compileModel();
}

// Compiling the model before it gets used
function compileModel(){
	model.compile({
		optimizer: tf.train.sgd(0.1),
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy']
	});
}

// Function to train the model
async function train(){
	messageP.html('Training the Model...');
	trainP.html('Train Results');
	trainP.show();
	trainLossP.show();
	trainAccuracyP.show();
	trainIterationP.show();

	for(let i=0 ; i<trainIterations ; i++){
		let validation_xs,validation_ys,validationBatch,validationData;
		let train_xs,train_ys,trainBatch;

		// Creating the training batch
		trainBatch = data.nextTrainBatch(trainBatchSize);
		train_xs = trainBatch.xs.reshape([trainBatchSize,28,28,1]);
		train_ys = trainBatch.labels;

		if(i % validationIterationFrequency === 0){
			// Creating the validation data
			validationBatch = data.nextTestBatch(validationBatchSize);
			validation_xs = validationBatch.xs.reshape([validationBatchSize,28,28,1]);
			validation_ys = validationBatch.labels;
			validationData = [validation_xs,validation_ys];
		}

		// Defining config properties
		let config = {
			batchSize: trainBatchSize,
			validationData,
			epochs: 1,
			callbacks: {onBatchEnd: tf.nextFrame}
		};

		// Training the model
		await model.fit(train_xs,train_ys,config).then((response) => {
			let loss = response.history.loss[0].toFixed(6);
			trainLossP.html(`Loss: ${loss}`);
			let accuracy = (response.history.acc[0]*100).toFixed(2);
			trainAccuracyP.html(`Accuracy: ${accuracy}%`);
			let iterations = i+1;
			trainIterationP.html(`Iterations: ${iterations}`);
			addPoint(loss,accuracy);
		});

		// Memory management
		if(i % validationIterationFrequency === 0){
			validationBatch.xs.dispose();
			validationBatch.labels.dispose();
			validation_xs.dispose();
			validation_ys.dispose();
		}
		trainBatch.xs.dispose();
		trainBatch.labels.dispose();
		train_xs.dispose();
		train_ys.dispose();
	}

	messageP.html('Training Completed.');
}

// Function to test the accuracy of the model
async function test(){
	messageP.html('Testing the Model...');
	for(let i=0 ; i<60 ; i++)
		await tf.nextFrame();
	testP.html('Test Results');
	testP.show();
	testLossP.show();
	testAccuracyP.show();

	// Creating the test data
	let testBatch = data.nextTestBatch(10000);
	let test_xs = testBatch.xs.reshape([10000,28,28,1]);
	let test_ys = testBatch.labels;

	// Evaluates and returns an array with 2 values, the loss and the accuracy.
	let results = tf.tidy(() => model.evaluate(test_xs,test_ys));
	let loss = results[0].dataSync()[0].toFixed(6);
	let accuracy = (results[1].dataSync()*100).toFixed(2);
	testLossP.html(`Loss: ${loss}`);
	testAccuracyP.html(`Accuracy: ${accuracy}%`);

	// Memory management
	testBatch.xs.dispose();
	testBatch.labels.dispose();
	test_xs.dispose();
	test_ys.dispose();
	results[0].dispose();
	results[1].dispose();

	messageP.html('Testing Completed.');
}

// Function to predict the number given the pixel array of an image with 784 values
function predict(predict_x){
	predictP.style('display','inline');
	let test_xs = tf.tensor(predict_x,[1,28,28,1]);
	let test_ys = tf.tidy(() => model.predict(test_xs));
	let scores = test_ys.dataSync();
	let prediction = test_ys.argMax(1).dataSync()[0];
	test_xs.dispose();
	test_ys.dispose();

	plotPrediction(scores);
	predictP.html(`Prediction: ${prediction}`);
}

// Function to covert the canvas data to the size of mnist data
function canvasToMnistData(){
	let x,y,col,ys;
	x = y = 0;
	xs = [];

	// Taking the canvas pixels as input
	loadPixels();
	for(let index=0 ; index<784 ; index++){
		let colors = [];
		x = (index*factor)%width;
		for(let i=x,p=0 ; p<factor ; i++,p++)
			for(let j=y,k=0 ; k<factor ; j++,k++){
				let pix = (i + j*width)*4;
				let col = {};
				col.r = pixels[pix+0];
				col.g = pixels[pix+1];
				col.b = pixels[pix+2];
				// Getting the Grayscale value of the pixel
				colors.push(RGB2GRAY(col));
			}
		// Normalizing the colors between from 0-255 to 0-1
		for(let i=0 ; i<colors.length ; i++)
			colors[i] = map(colors[i],0,255,0,1);
		// Max Pooling
		xs.push(Math.max.apply(Math,colors));

		// Incrementing y when index cross 28 pixels
		if((index+1)%28===0)
			y += factor;
	}
	updatePixels();

	return xs;
}

// Function to take in an mnist data and draw it on the canvas
function mnistDataToCanvas(imgPixels){
	// Converting the pixel values from 0-1 to 0-255
	for(let i=0 ; i<imgPixels.length ; i++)
		imgPixels[i] = map(imgPixels[i],0,1,0,255);

	let x,y;
	x = y = 0;
	loadPixels();
	for(let index=0 ; index<imgPixels.length ; index++){
		x = (index*factor)%width;
		if((index+1)%28===0)
			y += factor;
		let col = imgPixels[index];
		for(let i=x ; (i+1)%factor !== 0 ; i++)
			for(let j=y ; (j+1)%factor !== 0 ; j++){
				let pix = (i + j*width)*4;
				pixels[pix+0] = col;
				pixels[pix+1] = col;
				pixels[pix+2] = col;
			}
	}
	updatePixels();
}

// Function covert an RGB color to Grayscale value
function RGB2GRAY(col){
	let rWeight,gWeight,bWeight;
	// Values from Wikipedia page 'Relative Luminance'
	rWeight = 0.2126;
	gWeight = 0.7152;
	bWeight = 0.0722;
	return rWeight*col.r + gWeight*col.g + bWeight*col.b;
}

function addPoint(lossY,accuracyY){
	Plotly.extendTraces('lossChart',{y:[[lossY]]}, [0]);
	Plotly.extendTraces('accuracyChart',{y:[[accuracyY]]}, [0]);
	totalPoints++;
}

function plotPrediction(scores){
	Plotly.restyle('predictChart','y',[scores]);
}

function mousePressed(){
	isMousePressed = true;
	pmouseX = mouseX;
	pmouseY = mouseY;
	return false;
}

function mouseReleased(){
	isMousePressed = false;
	return false;
}
