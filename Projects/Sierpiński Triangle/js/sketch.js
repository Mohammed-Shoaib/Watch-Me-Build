let cnv,x1,x2,x3,y1,y2,y3,len,size;

function centerCanvas()
{
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x,y);
}

function windowResized()
{
	setup();
}


function setup(){
	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	cnv = createCanvas(size,size);
	centerCanvas();
	background(255);
	noFill();
	stroke(0);
	strokeWeight(1);
	translate(0,size/200);
	len = size/1.001;
	x1 = len/2;
	y1 = 0;
	x2 = len;
	y2 = Math.pow(len,2) - Math.pow(len/2,2);//606.22
	y2 = Math.sqrt(y2);
	x3 = 0;
	y3 = y2;
	triangle(x1,y1,x2,y2,x3,y3);
	drawTriangle(x1,x2,x3,y1,y2,y3);
}

function draw(){
	
}

function drawTriangle(x1,x2,x3,y1,y2,y3){
	let len = x2-x3;
	if(len < 1)
		return;
	let tempX1,tempX2,tempX3,tempY1,tempY2,tempY3;
	let median;
	median = Math.pow(len,2) - Math.pow(len/2,2);
	median = Math.sqrt(median);
	tempX1 = x1;
	tempX2 = x2;
	tempX3 = x3;
	tempY1 = y1;
	tempY2 = y2;
	tempY3 = y3;
	x3 += len/2;
	x1 -= len/4;
	x2 -= len/4;
	y1 = (y1+y3)/2;
	y2 = y1;
	triangle(x1,y1,x2,y2,x3,y3);

	x1 = tempX1;
	x2 = tempX2;
	x3 = tempX3;
	y1 = tempY1;
	y2 = tempY2;
	y3 = tempY3;

	//Left Triangle
	y1 += median/2;
	x2 -= len/2;
	x1 -= len/4;
	drawTriangle(x1,x2,x3,y1,y2,y3);

	x1 = tempX1;
	x2 = tempX2;
	x3 = tempX3;
	y1 = tempY1;
	y2 = tempY2;
	y3 = tempY3;

	//Right Triangle
	x1 += len/4;
	x3 += len/2;
	y1 += median/2;
	drawTriangle(x1,x2,x3,y1,y2,y3);

	x1 = tempX1;
	x2 = tempX2;
	x3 = tempX3;
	y1 = tempY1;
	y2 = tempY2;
	y3 = tempY3;

	//Top Triangle
	x2 -= len/4;
	x3 += len/4;
	y2 -= median/2;
	y3 = y2;
	drawTriangle(x1,x2,x3,y1,y2,y3);
}