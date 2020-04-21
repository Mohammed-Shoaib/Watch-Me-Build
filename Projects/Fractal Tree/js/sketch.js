let cnv,angle,drop,slider,rootLen,rootStroke,size;
let isSlider = false;

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
	if(!isSlider)
		slider = createSlider(0,TWO_PI,PI/6,0.01);
	isSlider = true;
	drop = 0.67;
	rootLen = size*0.275;
	rootStroke = 8;
	stroke(0);
}

function draw(){
	background(255);
	translate(width/2,height);
	angle = slider.value();
	branch(rootLen,rootStroke);
}

function branch(len,weight){
	strokeWeight(weight);
	line(0,0,0,-len);
	translate(0,-len);
	if(len > 4){
		push()
		rotate(angle);
		branch(len*drop,weight*drop);
		pop();
		push();
		rotate(-angle);
		branch(len*drop,weight*drop);
		pop();
	}
}