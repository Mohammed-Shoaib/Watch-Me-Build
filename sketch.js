let cnv,size;
let model,learningRate, optimizer,hidden,output;
let train_xs,train_ys,test_xs,test_ys;
let rows,cols,resolution,isTrain;
let loss,noRound,round,isRound;

function windowResized(){
	resetSketch();
}

function setup(){
	// Creating the elements
	createElement('p','Loss: ');
	loss = createElement('p','');
	createElement('br');
	noRound = createButton('No Round').addClass('btn-primary');
	round = createButton('Round').addClass('btn-primary');
	createElement('br');
	noRound.mousePressed(() => {
		isRound = false;
		resetSketch();
	});
	round.mousePressed(() => {
		isRound = true;
		resetSketch();
	});

	// Setting up the variables
	isRound = false;
	isTrain = true;
	resolution = 25;
	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	size -= size/10;
	size = floor(size/resolution)*resolution;
	cnv = createCanvas(size,size);
	cnv.style('display','block');

	// Creating the model
	model = tf.sequential();

	// Creating the hidden layer
	hidden = tf.layers.dense({
		inputShape: [2],
		units: 4,
		activation: 'sigmoid'
	});

	// Creating the output layer
	output = tf.layers.dense({
		units: 1,
		activation: 'sigmoid'
	});

	// Adding the layers to the model
	model.add(hidden);
	model.add(output);

	// Compiling the model with an optimizer and a loss function
	model.compile({
		optimizer: tf.train.adam(0.1),
		loss: tf.losses.meanSquaredError
	});

	// Defining the training inputs
	train_xs = tf.tensor2d([
		[0,0],
		[0,1],
		[1,0],
		[1,1]
	]);

	// Defining the training outputs
	train_ys = tf.tensor2d([
		[0],
		[1],
		[1],
		[0]
	]);

	rows = height/resolution;
	cols = width/resolution;

	// Creating the test inputs
	let inputs = [];
	for(let i=rows-1 ; i>-1 ; i--)
		for(let j=0 ; j<cols ; j++){
			let x,y;
			if(isRound){
				x = Math.round(j/cols);
				y = Math.round(i/rows);
			}else{
				x = j/cols;
				y = i/rows;
			}
			inputs.push([x,y]);
		}
	test_xs = tf.tensor2d(inputs);
}

function resetSketch(){
	// Disposing all the previous variables
	tf.disposeVariables();

	// Setting up the variables
	isTrain = true;
	resolution = 25;
	loss.html('');

	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	size -= size/10;
	size = floor(size/resolution)*resolution;
	cnv = createCanvas(size,size);
	cnv.style('display','block');

	// Creating the model
	model = tf.sequential();

	// Creating the hidden layer
	hidden = tf.layers.dense({
		inputShape: [2],
		units: 4,
		activation: 'sigmoid'
	});

	// Creating the output layer
	output = tf.layers.dense({
		units: 1,
		activation: 'sigmoid'
	});

	// Adding the layers to the model
	model.add(hidden);
	model.add(output);

	// Compiling the model with an optimizer and a loss function
	model.compile({
		optimizer: tf.train.adam(0.1),
		loss: tf.losses.meanSquaredError
	});

	// Defining the training inputs
	train_xs = tf.tensor2d([
		[0,0],
		[0,1],
		[1,0],
		[1,1]
	]);

	// Defining the training outputs
	train_ys = tf.tensor2d([
		[0],
		[1],
		[1],
		[0]
	]);

	rows = height/resolution;
	cols = width/resolution;

	// Creating the test inputs
	let inputs = [];
	for(let i=rows-1 ; i>-1 ; i--)
		for(let j=0 ; j<cols ; j++){
			let x,y;
			if(isRound){
				x = Math.round(j/cols);
				y = Math.round(i/rows);
			}else{
				x = j/cols;
				y = i/rows;
			}
			inputs.push([x,y]);
		}
	test_xs = tf.tensor2d(inputs);
}

function draw(){
	// Training the model
	if(isTrain)
		train(train_xs,train_ys);

	// Getting the predictions for the test inputs
	test_ys = tf.tidy(() => model.predict(test_xs));
	let outputs = test_ys.dataSync();
	test_ys.dispose();

	// Displaying the values
	for(let i=0,index=0 ; i<rows ; i++)
		for(let j=0 ; j<cols ; j++,index++){
			let brightness = outputs[index]*255;
			stroke(brightness);
			fill(brightness);
			rect(j*resolution,i*resolution,resolution,resolution);
			stroke(255-brightness);
			fill(255-brightness);
			textSize(9);
			textAlign(CENTER,CENTER);
			text(outputs[index].toFixed(2),j*resolution + resolution/2,i*resolution + resolution/2);
		}
}

function train(xs,ys){
	isTrain = false;
	let config = {
		shuffle: true,
		epochs: 10
	};
	model.fit(xs,ys,config).then((response) => {
			loss.html(response.history.loss[0].toFixed(6));
			isTrain = true;
	});
}
