let rows,cols,board,size,cnv,snake,food,speed;
let score,playerWin,playerDied,startTime,pauseScreen;
let isPause,isFirstLaunch;

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
	speed = 4;		//Either make 2 or 4
	rows = 20;
	cols = 40;
	size = 20;
	snake = [];
	playerWin = false;
	playerDied = false;
	pauseScreen = false;
	isPause = false;
	isFirstLaunch = true;
	startTime = 0;
	score = 0;
	cnv = createCanvas( (size*cols) , (size*rows)+100);
	centerCanvas();

	//Setting up the board
	board = [];
	for(let i=0 ; i<rows ; i++)
		board[i] = [];
	for(let i=0 ; i<rows ; i++)
		for(let j=0 ; j<cols ; j++)
		{
			board[i][j] = new Board(size*j,size*i,size);
			if( (i+j) % 2 === 0)
				board[i][j].c = color(100);
			else
				board[i][j].c = color(100);
		}

	//Setting up the snake
	let xSnake = size*floor(random(cols/2,cols)) + size/2;
	let ySnake = size*floor(random(rows)) + size/2;
	snake.push( new Snake(xSnake,ySnake,size,-speed,0) );	//Starting the snake at a random location on the board

	//Setting up the food
	let xFood = xSnake;
	let yFood = ySnake;
	while(xFood === xSnake)					//To avoid same starting location for snake and food
		xFood = size*floor(random(cols)) + size/2;
	while(yFood === ySnake)
		yFood = size*floor(random(rows)) + size/2;
	food = new Food(xFood,yFood,size);

}

function resetSketch()
{
	rows = 20;
	cols = 40;
	size = 20;
	snake = [];
	playerWin = false;
	playerDied = false;
	pauseScreen = false;
	isPause = false;
	isFirstLaunch = true;
	startTime = 0;
	score = 0;
	speed = 4;
	cnv = createCanvas( (size*cols) , (size*rows)+100);
	centerCanvas();

	//Setting up the board
	board = [];
	for(let i=0 ; i<rows ; i++)
		board[i] = [];
	for(let i=0 ; i<rows ; i++)
		for(let j=0 ; j<cols ; j++)
		{
			board[i][j] = new Board(size*j,size*i,size);
			if( (i+j) % 2 === 0)
				board[i][j].c = color(100);
			else
				board[i][j].c = color(100);
		}

	//Setting up the snake
	let xSnake = size*floor(random(cols/2,cols)) + size/2;
	let ySnake = size*floor(random(rows)) + size/2;
	snake.push( new Snake(xSnake,ySnake,size,-speed,0) );	//Starting the snake at a random location on the board

	//Setting up the food
	let xFood = xSnake;
	let yFood = ySnake;
	while(xFood === xSnake)					//To avoid same starting location for snake and food
		xFood = size*floor(random(cols)) + size/2;
	while(yFood === ySnake)
		yFood = size*floor(random(rows)) + size/2;
	food = new Food(xFood,yFood,size);
}

function draw()
{
	if(!pauseScreen)
		background(51);

	textSize(32);
	text("Score: " + score,size*cols/2 - size*cols/11,size*rows/11)

	translate(0,50);

	if(isFirstLaunch)
	{
		background(51);
		stroke(255);
		fill(255);
		textSize(32);
		text("Welcome to Snake Game!", size*cols/2 - size*cols/4.5 , size*rows/4);
		text("Press the arrows keys to move around", size*cols/2 - size*cols/3,size*rows/2.2);
		text("Press Spacebar to play!",size*cols/2 - size*cols/5,size*rows/1.6);
	}
	else if(isPause)
	{
		background(51);
		stroke(255);
		fill(255);
		textSize(32);
		text("Game Paused ||", size*cols/2 - size*cols/8 , size*rows/3);
		text("Press Spacebar to continue!",size*cols/2 - size*cols/4.5,size*rows/2.2);
	}
	else if(pauseScreen && Date.now() - startTime < 2000);
		//Do nothing, just pause the screen yo
	else if(playerDied)
	{
		background(51);
		stroke(255);
		fill(255);
		textSize(32);
		text("You Died!", size*cols/2 - size*cols/11 , size*rows/7);
		text("Final Score: " + score, size*cols/2 - size*cols/8,size*rows/2.5);
		text("Press Spacebar to play again!",size*cols/2 - size*cols/4,size*rows/1.5);
	}
	else if(playerWin)
	{
		background(51);
		stroke(255);
		fill(255);
		textSize(32);
		text("Congratulations!", size*cols/2 - size*cols/7 , size*rows/7)
		text("You Win!", size*cols/2 - size*cols/11 , size*rows/3.5);
		text("Final Score: " + score, size*cols/2 - size*cols/8,size*rows/2.2);
		text("Press Spacebar to play again!",size*cols/2 - size*cols/4,size*rows/1.5);
	}
	else
	{
	for(let i=0 ; i<rows ; i++)
		for(let j=0 ; j<cols ; j++)
			board[i][j].show();
	food.show();
	for(let i=0 ; i<snake.length ; i++)
	{
		snake[i].show();
		snake[i].update();
	}
	if( snake[0].eats(food) )
	{
		score += 10;
		findFoodPos(food,snake);
		pushSnake(snake);
	}
	for(let i=0 ; i<snake.length-1 ; i++)
	{
		let fillX,fillY;
		if( (snake[i].xdir === 0) && (snake[i].xdir !== snake[i+1].xdir) )
		{
			rect(snake[i].fillX,snake[i].fillY,size,size);
			if(snake[i].ydir === speed)
				snake[i+1].move(0,speed);
			else if(snake[i].ydir === -speed)
				snake[i+1].move(0,-speed);
		}
		else if( (snake[i].ydir === 0) && (snake[i].ydir !== snake[i+1].ydir) )
		{
			rect(snake[i].fillX,snake[i].fillY,size,size);
			if(snake[i].xdir === speed)
			{
				snake[i+1].move(speed,0);
			}
			else if(snake[i].xdir === -speed)
				snake[i+1].move(-speed,0);
		}
	}

	if(snake.length === rows*cols)
	{
		startTime = Date.now();
		pauseScreen = true;
		playerWin = true;
	}

	for(let i=1 ; i<snake.length ; i++)
		if(snake[0].hits(snake[i]))
		{
			startTime = Date.now();
			pauseScreen = true;
			playerDied = true;
		}
	if(snake[0].hitsEdge())
	{
		startTime = Date.now();
		pauseScreen = true;
		playerDied = true;
	}
	}//End of else
}

function keyPressed()
{
	if(keyCode === LEFT_ARROW || key === "A" || key === "a")
	{
		if(snake[0].xdir !== speed)
			snake[0].move(-speed,0);
	}
	if(keyCode === RIGHT_ARROW || key === "D" || key === "d")
	{
		if(snake[0].xdir !== -speed)
			snake[0].move(speed,0);
	}
	if(keyCode === UP_ARROW  || key === "W" || key === "w")
	{
		if(snake[0].ydir !== speed)
			snake[0].move(0,-speed);
	}
	if(keyCode === DOWN_ARROW  || key === "S" || key === "s")
	{
		if(snake[0].ydir !== -speed)
			snake[0].move(0,speed);
	}
	if(key === " ")
	{
		if(isFirstLaunch)
			isFirstLaunch = false;
		else if(isPause)
			isPause = false;
		else if(playerWin || playerDied)
			resetSketch();
	}
	else if(keyCode === ESCAPE)
		isPause = true;
}

function pushSnake(snake)
{
	let s = snake[snake.length-1];
	let x = s.x;
	let y = s.y;
	let w = s.w;
	if(s.xdir === -speed)
		snake.push( new Snake( x+w  , y , w , s.xdir,s.ydir) );
	else if(s.xdir === speed)
		snake.push( new Snake( x-w , y , w ,s.xdir,s.ydir) );
	else if(s.ydir === -speed)
		snake.push( new Snake( x , y+w , w ,s.xdir,s.ydir) );
	else if(s.ydir === speed)
		snake.push( new Snake( x , y-w , w ,s.xdir,s.ydir) );
}

function findFoodPos(food,snake)
{
	let x=0;
	let y=0;

	while(x === 0 && y === 0)
	{
		x = size*floor(random(cols)) + size/2;
		y = size*floor(random(rows)) + size/2;
		for(let i=0 ; i<snake.length ; i++)
			if(  (x === snake[i].x) && (y === snake[i].y) )
			{
				x = 0;
				y = 0;
			}
	}
	food.x = x;
	food.y = y;
}

