let cnv,size;
let data,isDataLoaded,model,factor;
let modelP,errorP,trainIterationsInput;
let trainP,testP;
let trainIterationP,trainIterationVal;
let trainLossP,trainAccuracyP;
let testLossP,testAccuracyP;
let predictP;
let trainBatchSize,testBatchSize,validationBatchSize;
let trainIterations,validationIterationFrequency;
let totalPoints,maxPoints;

function windowResized(){
	let update = {width: windowWidth, height: windowHeight/1.5};
	Plotly.relayout('chart', update);
}

function preload(){
	// Loading the MNIST dataset
	data = new MnistData();
	data.load().then(() => isDataLoaded = true);
}

function addPoint(lossY,accuracyY){
	Plotly.extendTraces('chart',{ y:[[lossY],[accuracyY]]}, [0,1]);
	totalPoints++;
}

function setup(){
	// To use the Pixel array
	pixelDensity(1);

	// Creating the plotly elements
	totalPoints = 0;
	maxPoints = 100;
	createPlot();

	// Creating the html elements
	modelP = createP('');
	errorP = createP('');
	createElement('br');
	createP('Train Iterations: ');
	trainIterationsInput = createInput('100').addClass('form-control');
	createElement('br');
	loadB = createButton('Load Model').addClass('btn-success');
	trainB = createButton('Train Model').addClass('btn-success');
	testB = createButton('Test Model').addClass('btn-success');
	createElement('br');

	let results = createDiv();
	results.id('results');
	// Creating the Train Results elements
	let trainDiv = createDiv().parent(results);
	trainDiv.id('train');
	trainP = createP('Train Results: No Results').parent(trainDiv);
	trainLossP = createP('Loss: ').hide().parent(trainDiv);
	trainAccuracyP = createP('Accuracy: ').hide().parent(trainDiv);
	trainIterationP = createP('Iteration: ').hide().parent(trainDiv);

	// Creating the Test Results elements
	let testDiv = createDiv().parent(results);
	testDiv.id('test');
	testP = createP('Test Results: No Results ').parent(testDiv);
	testLossP = createP('Loss: ').hide().parent(testDiv);
	testAccuracyP = createP('Accuracy: ').hide().parent(testDiv);

	// Creating the canvas
	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	size /= 2;
	// A factor to convert the 28×28 MNIST image to canvas size
	factor = floor(size/28);
	size = factor*28;
	cnv = createCanvas(size,size);
	cnv.style('display','block');
	background(0);
	stroke(255);
	strokeWeight(factor*2);

	// Creating the html elements
	createElement('br');
	predictB = createButton('Predict').addClass('btn-primary');
	clearB = createButton('Clear').addClass('btn-primary');
	createElement('br');
	predictP = createP('Prediction: ').hide();

	loadB.mousePressed(async() => {
		modelP.html('Model Loading...');
		model = await tf.loadModel('./Model/model.json');
		compileModel();
		modelP.html('Model Loaded.');
	});

	trainB.mousePressed(() => {
		if(isNaN(trainIterationsInput.value()))			//Returns true if it's not a valid number
			errorP.html('Please enter valid input!');
		else{
			errorP.html('');
			trainIterations = Number(trainIterationsInput.value());
			if(isDataLoaded)
				train();
			else
				errorP.html('Data is still being loaded! Please wait...');
		}
	});

	testB.mousePressed(() => {
		errorP.html('');
		if(isDataLoaded)
			test();
		else
			errorP.html('Data is still being loaded! Please wait...');
	})

	predictB.mousePressed(() => {
		let xs = canvasToMnistData();
		predict(xs);
	});

	clearB.mousePressed(() => {
		clear();
		background(0);
		stroke(255);
		strokeWeight(factor*2);
	});

	createModel();

	// Defining the parameters
	trainBatchSize = testBatchSize = 64;
	trainIterations = 1000;
	validationBatchSize = 1000;
	validationIterationFrequency = 5;
}

function draw(){
	// Checking for relayout
	// if(totalPoints > maxPoints){
	// 	let x = totalPoints - maxPoints;
	// 	let y = totalPoints;
	// 	let x1 = map(x,x,y,0,0.45);
	// 	let x2 = map(x,x,y,0.55,1);
	// 	Plotly.relayout('chart',{
	// 		xaxis1: {range: [totalPoints-maxPoints,totalPoints]},
	// 		xaxis2: {range: [totalPoints-maxPoints,totalPoints]}
	// 	});
	// }
	// addPoint(Math.random(),Math.random());

	// Drawing the number
	if(mouseIsPressed)
		line(pmouseX,pmouseY,mouseX,mouseY);
}

// Creating the plot
function createPlot(){
	let lossTrace = {
		y: [],
		xaxis: 'x1',
		yaxis: 'y1',
		type: 'line',
		name: 'Loss',
		connectgaps: true
	};
	let accuracyTrace = {
		y: [],
		xaxis: 'x2',
		yaxis: 'y2',
		type: 'line',
		name: 'Accuracy',
		connectgaps: true
	};
	let plotData = [lossTrace, accuracyTrace];
	let layout = {
		title: 'Train Results',
		autosize: true,
		width: windowWidth,
		height: windowHeight/1.5,
		showlegend: true,
		yaxis1: {title: 'Loss'},
		xaxis1: {
			title: 'Epoch',
			domain: [0, 0.45]
		},
		xaxis2: {
			title: 'Epoch',
			domain: [0.55, 1]
		},
		yaxis2: {
			title: 'Accuracy',
			anchor: 'x2'
		}
	};
	Plotly.newPlot('chart',plotData,layout);
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

// Training the model
async function train(){
	modelP.html('Training the Model...');
	trainP.html('Train Results');
	trainP.style('display','inline');
	trainLossP.style('display','inline');
	trainAccuracyP.style('display','inline');
	trainIterationP.style('display','inline');

	for(let i=0 ; i<trainIterations ; i++){
		let validation_xs,validation_ys,validationBatch,validationData;
		let train_xs,train_ys,trainBatch;
		trainIterationVal = i+1;

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

		let config = {
			batchSize: trainBatchSize,
			validationData,
			epochs: 1,
			callbacks: {onBatchEnd: tf.nextFrame}
		};
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
	modelP.html('Training Completed.');
}

// Function to test the accuracy of the model
async function test(){
	modelP.html('Testing the Model...');
	for(let i=0 ; i<60 ; i++)
		await tf.nextFrame();
	testP.html('Test Results');
	testP.style('display','inline');
	testLossP.style('display','inline');
	testAccuracyP.style('display','inline');
	// Creating the test data
	let testBatch = data.nextTestBatch(10000);
	let test_xs = testBatch.xs.reshape([10000,28,28,1]);
	let test_ys = testBatch.labels;

	// Evaluates and returns an array with 2 values, the loss and the accuracy.
	let config = {
		callbacks: {
			onBatchEnd: tf.nextFrame
		}
	}
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

	modelP.html('Testing Completed.');
}

// Function to predict the number given the pixel array of an image with 784 values
function predict(predict_x){
	predict.style('display','inline');
	let test_xs = tf.tensor(predict_x,[1,28,28,1]);
	let test_ys = tf.tidy(() => model.predict(test_xs).argMax(1));
	let prediction = test_ys.dataSync()[0];
	predictP.html(`Prediction: ${prediction}`);
	test_xs.dispose();
	test_ys.dispose();
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
