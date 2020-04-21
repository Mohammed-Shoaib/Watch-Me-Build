var blobs = [];
var cnv,level,numBlobs,destroyed;

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
	blobs = [];
	level = 1;
	numBlobs = 20;
	destroyed= 0;
	cnv = createCanvas(600,600);
	centerCanvas();
	for(var i=0 ; i<numBlobs ; i++)
		blobs.push(new Blob());
}

function nextLevel()
{
	blobs = [];
	destroyed = 0;
	numBlobs = 20;
	level++;
	cnv = createCanvas(600,600);
	for(var i=0 ; i<numBlobs ; i++)
		blobs.push(new Blob());
}

function draw()
{
	background(51);
	for(var i=0 ; i<blobs.length ; i++)
	{
		if(blobs[i].isFirstLaunch)
		{
			blobs[i].axis();
			blobs[i].speed();
			blobs[i].isFirstLaunch = false;
		}
		blobs[i].show();
		blobs[i].checkEdge();
	}
	if(blobs.length === 0)
		nextLevel();

	fill(255);
	textSize(25);
	text("Level: " + level,10,height-10);
	text("Destroyed: " + destroyed + "/" + numBlobs,width-200,height-10);
}


function mousePressed()
{
	for(var i = blobs.length-1 ; i >= 0 ; i--)
	{
		if(blobs[i].clicked(mouseX,mouseY))
		{
			destroyed++;
			blobs.splice(i,1);
		}
	}
}