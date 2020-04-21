let cnv,size,isDragged;
let points,maxVal;
let degree,coeff,tf_coeff,lossP,functionP;
let input,button,invalidNumber;

// Defining the learning rate and the optimizer
const learningRate = 0.1;
const optimizer = tf.train.adam(learningRate);

function windowResized(){
	resetSketch();
}

function setup(){
	input = document.getElementById('degree');
	lossP = $(document.getElementById('loss'));
	functionP = $(document.getElementById('function'));
	submitB = $(document.getElementById('submit'));
	submitB.click(() => {
		degree = Number($(input).val());
		resetSketch();
	});
	degree = Number($(input).val());

	if(windowWidth > windowHeight){
		size = windowHeight;
		size -= size/8.5;
	}
	else
		size = windowWidth;
	cnv = createCanvas(size,size);
	cnv.style('display','block');

	points = [];
	maxVal = 1;								// The maximum point of the graph, theoretically, infinity.
	isDragged = false;
	tf_coeff = [];
	coeff = [];

	// Creating the slope and the y-intercept as variables which get updated
	for(let i=degree ; i>=0 ; i--)
		tf_coeff.push(tf.variable(tf.scalar(random(1))));
	for(let i=tf_coeff.length-1 ; i>=0 ; i--)
		coeff.push(tf_coeff[i].dataSync());
}

function resetSketch(){
	lossP.html('Loss: No Points');
	if(windowWidth > windowHeight){
		size = windowHeight;
		size -= size/8.5;
	}
	else
		size = windowWidth;
	cnv = createCanvas(size,size);
	cnv.style('display','block');
	stroke(255);

	points = [];
	maxVal = 1;								// The maximum point of the graph, theoretically, infinity.
	isDragged = false;
	tf_coeff = [];
	coeff = [];

	// Creating the slope and the y-intercept as variables which get updated
	for(let i=degree ; i>=0 ; i--)
		tf_coeff.push(tf.variable(tf.scalar(random(1))));
	for(let i=tf_coeff.length-1 ; i>=0 ; i--)
		coeff.push(tf_coeff[i].dataSync());
}

function draw(){
	background(51);
	if(isDragged){
		// Creating the Dataset
		// Normalize the points before pushing
		let x = map(mouseX,0,width,-maxVal,maxVal);
		let y = map(mouseY,0,height,maxVal,-maxVal);
		let hue = (map(mouseX,0,width,0,360) + map(mouseY,0,height,360,0) ) / 2;
		points.push({x,y,hue});
	}

	if(points.length>0){
		let xs = [];
		let ys = [];
		for(p of points){
			xs.push(p.x);
			ys.push(p.y);
		}
		tf.tidy(() => train(xs,ys));
	}

	let functionStr = "Function: ";
	for(let i=tf_coeff.length-1 ; i>=0 ; i--){
		coeff[i] = tf_coeff[i].dataSync()[0];
		functionStr += str(Math.abs(coeff[i]).toFixed(2));
		if(i !== 0){
			functionStr += 'x';
		 	if(i !== 1)
				functionStr += '<sup>' + str(i) + '</sup>';
			functionStr += (coeff[i] >= 0) ? ' + ' : ' - ';
		}
	}
	functionP.html(functionStr);
	drawLine();
	drawPoints();
}

function mousePressed(){
	if( (mouseX >= 0 && mouseX <= width) && (mouseY >= 0 && mouseY <= height) )
		isDragged = true;
}

function mouseReleased(){
	isDragged = false;
}

function predict(xs){
	let tf_xs = tf.tensor1d(xs);
	// The function: y = ax^n + bx^(n-1) + ...
	let tf_ys = tf_coeff[degree].mul(tf_xs.pow(tf.scalar(degree)));
	for(let i=degree-1 ; i>=0 ; i--)
		tf_ys = tf_ys.add(tf_coeff[i].mul(tf_xs.pow(tf.scalar(i))))
	return tf_ys;
}

function train(xs,ys){
	let tf_ys = tf.tensor1d(ys);
	// Optimizing the loss function for the dataset
	optimizer.minimize(() => loss(predict(xs),tf_ys));
}

function loss(pred,labels){
	// Loss function: Mean Squared error
	lossVal = pred.sub(labels).square().mean().dataSync()[0].toFixed(5);
	lossP.html(`Loss: ${lossVal}`);
	return pred.sub(labels).square().mean();
}

function drawLine(){
	// Drawing the line
	let lineX = [];
	for(let i=-maxVal-1 ; i<=maxVal+1 ; i += 0.05)
		lineX.push(i);
	let tf_ys = tf.tidy(() => predict(lineX));
	let lineY = tf_ys.dataSync();
	tf_ys.dispose();

	// Denormalize the points before displaying
	let p = [];
	for(let i=0 ; i<lineX.length ; i++)
		p.push(createVector( map(lineX[i],-maxVal,maxVal,0,width) , map(lineY[i],maxVal,-maxVal,0,height) ));
	stroke(255);
	strokeWeight(2);
	noFill();
	beginShape();
	for(let i=0 ; i<p.length ; i++)
		vertex(p[i].x,p[i].y);
	endShape();
}

function drawPoints(){
	// Drawing the points
	strokeWeight(8);
	for(let i=0 ; i<points.length ; i++){
		// Denormalize the points before displaying
		let px = map(points[i].x,-maxVal,maxVal,0,width);
		let py = map(points[i].y,maxVal,-maxVal,0,height);
		push();
		colorMode(HSB);
		stroke(points[i].hue,255,255);
		point(px,py);
		pop();
	}
}
