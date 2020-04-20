let cnv,size;
let data,labelMapping,isTrain;
let rSlider,gSlider,bSlider,lossValue,labelPredict;
let model,train_xs,train_ys,test_xs,test_ys;

function windowResized(){
	resetSketch();
}

function preload(){
	data = loadJSON('./colorData.json');
}

function setup(){
	// Setting up the webpage
	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	size /= 2;
	cnv = createCanvas(size,size);
	cnv.style('display','block');

	// Creating the html elements
	createP('Color Predicted: ');
	labelPredict = createP('');
	createElement('br');
	createP('Loss: ');
	lossValue = createP('');
	createElement('br');
	createP('R: ');
	rSlider = createSlider(0,255,255);
	createElement('br');
	createP('G: ');
	gSlider = createSlider(0,255,255);
	createElement('br');
	createP('B: ');
	bSlider = createSlider(0,255,0);

	// The set of labels
	labelMapping = [
	  'red-ish',
	  'green-ish',
	  'blue-ish',
	  'orange-ish',
	  'yellow-ish',
	  'pink-ish',
	  'purple-ish',
	  'brown-ish',
	  'grey-ish'
	];
	isTrain = true;

	// Getting the rgb values and their label index from the data
	let colors = [];
	let labels = [];
	for(let record of data.entries){
		// Normalizing the rgb values between 0 & 1
		let col = [record.r/255,record.g/255,record.b/255];
		colors.push(col);
		let index = labelMapping.indexOf(record.label)
		labels.push(index);
	}

	// Creating the tensors
	train_xs = tf.tensor2d(colors);
	// One Hot Encoding
	let indices = tf.tensor1d(labels,'int32');
	let depth = labelMapping.length;
	train_ys = tf.oneHot(indices,depth).cast('float32');
	indices.dispose();

	// Creating the model
	model = tf.sequential();

	// Creating the hidden layers
	let hidden = tf.layers.dense({
		inputDim: 3,
		units: 16,
		activation: 'relu'
	});
	model.add(hidden);

	// Creating the output layer
	let output = tf.layers.dense({
		units: 9,
		activation: 'softmax'
	});
	model.add(output);

	// Compiling the model with an optimizer and a loss function
	model.compile({
		optimizer: tf.train.adam(0.01),
		loss: tf.metrics.meanSquaredError
	});
}

function resetSketch(){
	// Setting up the webpage
	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	size /= 2;
	cnv = createCanvas(size,size);
	cnv.style('display','block');
}

function draw(){
	let r = rSlider.value();
	let g = gSlider.value();
	let b = bSlider.value();
	background(r,g,b);

	// Predicting the color
	test_xs = tf.tensor2d([[r,g,b]]);
	test_ys = tf.tidy(() => model.predict(test_xs).argMax(1));
	let outputIndex = test_ys.dataSync()[0];
	let outputLabel = labelMapping[outputIndex];
	labelPredict.html(outputLabel);
	test_xs.dispose();
	test_ys.dispose();

	// Training the model
	if(isTrain)
		train(train_xs,train_ys);
}

function train(xs,ys){
	isTrain = false;
	let config = {
		shuffle: true
	};
	model.fit(xs,ys,config).then((response) => {
		let loss = response.history.loss[0]*Math.pow(10,3);
		lossValue.html(loss.toFixed(6));
		isTrain = true;
	});
}
