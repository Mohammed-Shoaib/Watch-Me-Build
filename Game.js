let cnv,sizeW,sizeH;
let bird,pipe,pipeDistance,bg,count;
let isDied,isFirstLaunch,pauseScreen,startTime,tapDelay;

function centerCanvas()
{
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x,y);
}

function windowResized()
{
	//Anytime the Window is resized, create a new canvas with those values
	setup();
}

function preload(){
	//Loading the background
	bg = loadImage("https://i.imgur.com/JhllwsV.png");
}

function setup()
{
	//Calculating the size of the canvas
	if(windowWidth >= windowHeight*1.5){
		sizeH = windowHeight;
		sizeW = Math.ceil(sizeH * 1.5);
	}
	else{
		sizeW = Math.ceil(windowWidth);
		sizeH = sizeW/1.5;
	}
	if(sizeW%2 !== 0)
		sizeW += 1;
	cnv = createCanvas(sizeW,sizeH);
	centerCanvas();

	pipe = [];
	startTime = 0;
	count = 0;
	tapDelay = 0;
	isDied = false;
	isFirstLaunch = true;
	pauseScreen = false;

	//Creating the objects
	pipeDistance = Math.ceil(sizeH/2.2)%2 ? Math.ceil(sizeH/2.2)+1 : Math.ceil(sizeH/2.2);
	pipe.push(new Pipe(sizeW+pipeDistance));
	bird = new Bird();
}

function resetSketch(){
	pipe = [];
	startTime = 0;
	count = 0;
	tapDelay = 0;
	isDied = false;
	isFirstLaunch = false;
	pauseScreen = false;

	//Creating the objects
	pipeDistance = Math.ceil(sizeH/2.2)%2 ? Math.ceil(sizeH/2.2)+1 : Math.ceil(sizeH/2.2);
	pipe.push(new Pipe(sizeW+pipeDistance));
	bird = new Bird();
}

function draw()
{
	if(isFirstLaunch)
	{
		background(255);
		fill(0);
		stroke(0);
		textSize(sizeH/15);
		text("Welcome to Flappy Bird!",sizeH/2.4,sizeH/2.2);
		text("Tap or Press Spacebar to play!",sizeH/3,sizeH/1.75);
	}else if(pauseScreen && Date.now() - startTime < 2000)
		;//Do nothing, just pause the screen yo)
	else if(pauseScreen && Date.now() - startTime >= 2000)
		pauseScreen = false;
	else if(isDied){
		background(255);
		stroke(0);
		fill(0)
		textSize(sizeH/15);
		text("You Died!",sizeH/1.65,sizeH/2.2);
		text("Score: " + count,sizeH/1.6,sizeH/1.76);
		text("Tap or Press Spacebar to play!",sizeH/3.1,sizeH/1.47);
	}else{
	background(255);	//Not required as there is a background in the assets
	noStroke();

	//Displaying the bird
	image(bg,0,0,sizeW,sizeH);
	bird.show();
	bird.update();

	//Pushing a new pipe if the last pipe crosses a certain limit
	let index = pipe.length-1;
	if(pipe[index].x < sizeW)
		pipe.push(new Pipe(sizeW+pipeDistance));

	//Checking for pipes
	for(let i=pipe.length-1 ; i>=0 ; i--){
		pipe[i].show();

		//Incrementing the score if the bird crosses a pipe
		if(!pipe[i].isFinished && bird.x > pipe[i].x){
			count++;
			pipe[i].isFinished = true;
		}
		//Checking if the bird hit the pipe
		if(bird.hit(pipe[i])){
			startTime = Date.now();
			isDied = true;
			pauseScreen = true;
		}

		//Splicing the pipe if it crosses the screen
		if(pipe[i].x + pipe[i].width < 0)
			pipe.splice(i,1);
	}

	//Displaying the score
	fill(255);
	textSize(sizeH/12.5);
	text(count,checkDigits(),sizeH/10);
	}
}

function mousePressed(){
	//Checking if the mouse is pressed within the canvas
	if( (mouseX >= 0 && mouseX <= sizeW) && (mouseY >= 0 && mouseY <= sizeH) ){
		if(isFirstLaunch)
			isFirstLaunch = false;
		else if(!pauseScreen && isDied)
			resetSketch();
		else if(Date.now() - tapDelay > 100){
			bird.up();
			tapDelay = Date.now();
		}
	}
	//Fixing the double tap bug issue on mobile
	return false;
}

function keyPressed()
{
	if(key == " "){
		if(isFirstLaunch)
			isFirstLaunch = false;
		else if(Date.now() - tapDelay > 100){
			bird.up();
			tapDelay = Date.now();
		}
	}
}

function checkDigits()
{
	if(count/10 < 1)
		return sizeW/2;
	else
		return sizeW/2.05;
}
