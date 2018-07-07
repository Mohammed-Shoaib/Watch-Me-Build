let cnv,score,bird,pipe,pipeDistance;
let isDied,isFirstLaunch,pauseScreen,startTime;

function centerCanvas()
{
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x,y);
}

function windowResized()
{
	centerCanvas();
}

function setup()
{
	cnv = createCanvas(800,600);
	centerCanvas();
	bird = new Bird();
	score = new Score();
	pipe = [];
	pipeDistance = 300;
	for(let i=0 ; i<3 ; i++)
	{
		pipe.push( new Pipe() );
		pipe[i].x = pipeDistance*(i+3);
	}
	startTime = 0;
	isDied = false;
	isFirstLaunch = true;
	pauseScreen = false;
}

function resetSketch(){
	pipe = [];
	pipeDistance = 300;
	bird = new Bird();
	score = new Score();
	for(let i=0 ; i<3 ; i++)
	{
		pipe.push( new Pipe() );
		pipe[i].x = pipeDistance*(i+3);
	}
	startTime = 0;
	isDied = false;
	isFirstLaunch = false;
	pauseScreen = false;
}

function draw()
{
	if(isFirstLaunch)
	{
		background(51);
		stroke(255);
		fill(255);
		textSize(32);
		text("Welcome to Flappy Bird!",200,275);
		text("Tap or Press Spacebar to play!",165,325);
	}else if(pauseScreen && Date.now() - startTime < 2000)
		;//Do nothing, just pause the screen yo)
	else if(pauseScreen && Date.now() - startTime >= 2000)
		pauseScreen = false;
	else if(isDied){
		background(51);
		stroke(255);
		fill(255)
		textSize(32);
		text("You Died!",300,250);
		text("Score: " + score.count,305,300);
		text("Tap or Press Spacebar to play!",165,350);
	}else{
	background(51);
	noStroke();
	for(let i=0 ; i<3 ; i++)
		pipe[i].show();
	bird.show();
	bird.update();
	fill(255);
	score.show();
	for(let i=0 ; i<pipe.length ; i++)
		if(bird.hit(pipe[i])){
			startTime = Date.now();
			isDied = true;
			pauseScreen = true;
		}
	score.checkScore();
	fill("black");
	textSize(50);
	text(score.count,checkDigits(),50);
	}

}


function Score()
{
	this.count = 0;
	this.checkScore = function(){
		for(let i=0 ; i<3 ; i++)
		{
			if(bird.x === pipe[i].x)
			{
				if(bird.y > height-pipe[i].height-150 && bird.y < height-pipe[i].height)
					this.count++;
			}
		}
	}
	this.show = function(){
		rect(370,0,70,60);
	}
}

function mousePressed(){
	if( (mouseX >= 0 && mouseX <= width) && (mouseY >= 0 && mouseY <= height) ){
		if(isFirstLaunch)
			isFirstLaunch = false;
		else if(!pauseScreen && isDied)
			resetSketch();
		else
			bird.up();
	}
}

function keyPressed()
{
	if(key == " "){
		if(isFirstLaunch)
			isFirstLaunch = false;
		else
			bird.up();
	}
}

function checkDigits()
{
	if(score.count/10 < 1)
		return 390;
	else
		return 375;
}