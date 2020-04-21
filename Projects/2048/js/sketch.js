let cnv;
let board;
let blocks;
let isFirstLaunch;
let playerWin,playerDied;
let score,count;
let pause;
let startTime;

function centerCanvas()
{
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x,y);
}

function windowResized()
{
	centerCanvas();
}

function setup()
{
	cnv = createCanvas(410,410);
	centerCanvas();
	rectMode(CENTER);
	isFirstLaunch = true;
	playerWin = false;
	playerDied = false;
	pause = false;
	score = 0;
	startTime = 0;
	board = new Board();
	blocks = [];
	for(let i=0 ; i<4 ; i++)
		blocks[i] = [];
	for(let i=0 ; i<4 ; i++)
		for(let j=0 ; j<4 ; j++)
			blocks[i][j] = undefined;
}

function resetSketch()
{

	cnv = createCanvas(410,410);
	centerCanvas();
	rectMode(CENTER);
	isFirstLaunch = true;
	playerWin = false;
	playerDied = false;
	pause = false;
	score = 0;
	startTime = 0;
	board = new Board();
	blocks = [];
	for(let i=0 ; i<4 ; i++)
		blocks[i] = [];
	for(let i=0 ; i<4 ; i++)
		for(let j=0 ; j<4 ; j++)
			blocks[i][j] = undefined;
}

function draw()
{
	if(!pause)
		background(51);
	translate(5,5);
	if(pause && Date.now()-startTime < 2000);
		//Do nothing, just pause the screen
	else if(playerDied)
	{
		background(51);
		push();
		textSize(32);
		stroke(255);
		fill(255);
		text("You died!",140,100);
		text("Press SpaceBar to",70,250);
		text("play again!",130,310);
	}
	else if(playerWin)
	{
		background(51);
		push();
		textSize(32);
		stroke(255);
		fill(255);
		text("You Win!",140,100);
		text("Press SpaceBar to",70,250);
		text("play again!",130,310)
	}
	else
	{
	board.show();
	for(let i=0 ; i < blocks.length ; i++)
		for(let j=0 ; j < blocks[i].length ; j++)
		{
			if(blocks[i][j] === undefined)
				continue
			else
				blocks[i][j].show();
		}

	count = 0;
	for(let i=0 ; i<4 ; i++)
		for(let j=0 ; j<4 ; j++)
			if(blocks[i][j] !== undefined)
			{
				if(blocks[i][j].value === 2048)
				{
					pause = true;
					startTime = Date.now();
					playerWin = true;
				}
				count++
			}

	if(count === 16)
	{
		pause = true;
		startTime = Date.now();
		playerDied = true;
	}

	if(isFirstLaunch)
	{
		board.findBlockPos(blocks);
		isFirstLaunch = false;
	}

	}//End of else

}

function keyReleased()
{
	if(keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW )
		board.findBlockPos(blocks);
	else if(key === "A" || key === "a" || key === "D" || key === "d" || key === "W" || key === "w" || key === "S" || key === "s")
		board.findBlockPos(blocks);
}

function keyPressed()
{
	if(keyCode === LEFT_ARROW || key === "A" || key === "a")
		board.moveBlocks(-1,0,blocks);
	else if(keyCode === RIGHT_ARROW || key === "D" || key === "d")
		board.moveBlocks(1,0,blocks);
	else if(keyCode === UP_ARROW || key === "W" || key === "w")
		board.moveBlocks(0,-1,blocks);
	else if(keyCode === DOWN_ARROW || key === "S" || key === "s")
		board.moveBlocks(0,1,blocks);
	else if(key === " " && (playerWin || playerDied) )
		resetSketch();
}