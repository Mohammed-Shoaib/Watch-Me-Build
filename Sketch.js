let tri,ball,score,cnv;
let isDead = false;

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
	cnv = createCanvas(600,600);
	centerCanvas();
	score = 0;
	tri = new Triangle();
	ball = new Ball();
}

function draw()
{
	background(240);
	if(isDead)
	{
		fill(51);
		textSize(32);
		text("You died!",width/2-50,height/2-50);
		text("Score: " + score,width/2-50,height/2);
	}
	else
	{
	tri.show();	
	ball.show();
	ball.update();

	if(tri.hits(ball))
	{
		score++;
		ball.reset();
	}

	if(tri.wrongHits(ball))
		isDead = true;

	fill(51);
	textSize(32);
	text("Score: " + score,10,40);
	}
}

function mousePressed()
{
	tri.rotate();
}

