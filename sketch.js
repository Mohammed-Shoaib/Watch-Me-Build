let cnv,size;
let data,model,factor;
let invalidInput,trainIterationsInput;
let iterationP,iterationVal,lossP,accuracyP,lossVal,accuracyVal,predictP,predictVal;
let trainBatchSize,trainIterations;
let validationBatchSize,validationIterationFrequency;

function setup(){
	// To use the Pixel array
	pixelDensity(1);

	// Creating the html elements
	createElement('br');
	createP('Train Iterations: ');
	trainIterationsInput = createInput('100').addClass('form-control');
	invalidInput = createP('');
	createElement('br');
	startB = createButton('Train Model').addClass('btn-success');
	// createP('or');
	// load = createButton('Load Model').addClass('btn-success');
	createElement('br');
	createP('Iteration: ');
	iterationP = createP('');
	createP('Loss: ');
	lossP = createP('');
	createP('Accuracy: ');
	accuracyP = createP('');
	createElement('br');

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
	createP('Prediction: ')
	predictP = createP('');

	startB.mousePressed(() => {
		if(isNaN(trainIterationsInput.value()))			//Returns true if it's not a valid number
			invalidInput.html('Please enter valid input!');
		else{
			trainIterations = Number(trainIterationsInput.value());
			// Loading the MNIST dataset & training the model
			data = new MnistData();
			data.load().then(train);
		}
	});

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
}

function draw(){
	if(!iterationVal)
		iterationP.html('No iteration');
	else
		iterationP.html(iterationVal);
	if(!lossVal)
		lossP.html('No Loss');
	else
		lossP.html(lossVal);
	if(!accuracyVal)
		accuracyP.html('No Accuracy');
	else
		accuracyP.html(str(accuracyVal) + '%');
	if(!predictVal)
		predictP.html('No Prediction');
	else
		predictP.html(predictVal);

	// Drawing the number
	if(mouseIsPressed)
		line(pmouseX,pmouseY,mouseX,mouseY);
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

	// Compiling the model
	model.compile({
		optimizer: tf.train.sgd(0.1),
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy']
	});

	// Defining the parameters
	trainBatchSize = 64;
	trainIterations = 1000;
	validationBatchSize = 1000;
	validationIterationFrequency = 5;
}

// Training the model
async function train(){
	for(let i=0 ; i<trainIterations ; i++){
		let validation_xs,validation_ys,validationBatch,validationData;
		let train_xs,train_ys,trainBatch;
		iterationVal = i+1;

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
			callbacks: { onEpochEnd: tf.nextFrame }
		};
		await model.fit(train_xs,train_ys,config).then((response) => {
			lossVal = response.history.loss[0].toFixed(6);
			accuracyVal = (response.history.acc[0]*100).toFixed(2);
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
}

// Function to predict the number given an array of 784 values
function predict(xs){
	let test_xs = tf.tensor(xs,[1,28,28,1]);
	let test_ys = model.predict(test_xs).argMax(1);
	predictVal = test_ys.dataSync()[0];
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
