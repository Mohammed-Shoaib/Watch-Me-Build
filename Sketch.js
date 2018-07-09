let cnv,size;
let playerChance,player1,player2 ;
let player1Win, player2Win,playerTie,endGame,player1Score,player2Score;
let pauseScreen,gamesPlayed,startTime;

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

function setup()
{
	//Creating the canvas based on window size
	if(windowWidth > windowHeight)
		size = windowHeight;
	else
		size = windowWidth;
	cnv = createCanvas(size,size);
	centerCanvas();

	//Default values for all the variables
	playerChance = 1;
	player1 = [];
	player2 = [];
	player1Win = false;
	player2Win = false;
	playerTie = false;
	pauseScreen = false;
	endGame = false;
	player1Score = 0;
	player2Score = 0;
	gamesPlayed = 1;
	startTime = 0;
}
	
function nextGame()
{
	//Next game values for all the variables
	player1 = [];
	player2 = [];
	player1Win = false;
	player2Win = false;
	playerTie = false;
	pauseScreen = false;
	endGame = false;
	startTime = 0;
	gamesPlayed++;

	//Checking which player starts
	if(gamesPlayed%2 === 0)
		playerChance = 2;
	else 
		playerChance = 1;
}

function draw()
{
	if(!pauseScreen)
	{
		background(51);
		stroke(255);
		strokeWeight(size/100);
		line(size/2.50,size/5.00,size/2.50,size/1.25);
		line(size/1.67,size/5.00,size/1.67,size/1.25);
		line(size/5.00,size/2.50,size/1.25,size/2.50);
		line(size/5.00,size/1.67,size/1.25,size/1.67);
	}
	if(pauseScreen && Date.now() - startTime < 2000)
	{
		//Do nothing just pause the screen
	}
	else if(endGame && Date.now() - startTime >= 2000)
	{
		push();
		stroke(255);
		strokeWeight(1);
		fill(255);
		background(51);
		textSize(size/15.625);
		if(player1Win)
			text("Player 1 Wins!",size/3.57,size/5);
		else if(player2Win)
			text("Player 2 Wins!",size/3.57,size/5);
		else if(playerTie)
			text("It's a Tie!",size/2.63,size/5);
		text("Score now:",size/2.94,size/3.125);
		text("Player 1: " + player1Score,size/50,size/2.27);
		text("Player 2: " + player2Score,size/1.52,size/2.27);
		text("Games Played: " + gamesPlayed,size/4.17,size/1.79);
		text("Tap or Press SpaceBar",size/5.56,size/1.43);
		text("to go to the next Game!",size/5.56,size/1.25);
		pop();
	}
	else
	{
	for(let i=0 ; i < player1.length ; i++)
		player1[i].show();
	for(let i=0 ; i < player2.length ; i++)
		player2[i].show();
	checkWin(player1,player2);
	checkIfTie();

	//Displaying all the text
	push();
	stroke(255);
	strokeWeight(1);
	fill(255);
	textSize(size/20);
	text("Player Chance: " + playerChance,size/3.125,size/1.11);
	text("Player 1",size/50,size/12.5);
	text("Player 2",size/1.32,size/12.5);
	text("Game",size/2.27,size/12.5);
	text(gamesPlayed,size/2.04,size/6.25);
	text(player1Score,size/12.5,size/6.25);
	text(player2Score,size/1.19,size/6.25);
	pop();
	}//End of else
}

function mousePressed()
{
	if(player1Win || player2Win || playerTie)
		nextGame();
	else if(mouseX >= size/5 && mouseX <= size/1.25)
	{
		if(mouseY >= size/5 && mouseY <= size/1.25)
		{
			if(!checkIfPlayerExists(player1,player2,mouseX,mouseY))
			{
				if(playerChance === 1)
				{
					player1.push(new Player1());
					player1[player1.length - 1].findPos(mouseX,mouseY);
					playerChance = 2;
				}
				else
				{
					player2.push(new Player2());
					player2[player2.length - 1].findPos(mouseX,mouseY);
					playerChance = 1;
				}
			}
		}
	}
}

function keyPressed()
{
	if(player1Win || player2Win || playerTie)
		if(key === " ")
			nextGame();
}

function checkIfPlayerExists(player1,player2,X,Y)
{
	//Returns true if player already exists at a given position

	let i = floor(Y/(size/5));
	let j = floor(X/(size/5));

	for(let k=0 ; k < player1.length ; k++)
	{
		if( ( (j*(size/5) + size/10) === player1[k].x) && ( ( i*(size/5) + size/10) === player1[k].y) )
			return true;
	}
	for(let k=0 ; k < player2.length ; k++)
	{
		if( ( (j*(size/5) + size/10) === player2[k].x) && ( ( i*(size/5) + size/10) === player2[k].y) )
			return true;
	}
	return false;
}

function checkWin(player1,player2)
{
	//Checks if a player won the game

	startTime = Date.now();
	let count = 0;
	stroke("red");

	//Checking for all horizontal lines for player1
	for(let i=1 ; i <= 3 ; i++)
	{
		for(let j=1 ; j <= 3 ; j++)
			for(let k=0 ; k < player1.length ; k++)
				if( ( ( (size/5)*j + size/10 ) === player1[k].x ) && ( ( (size/5)*i + size/10 ) === player1[k].y) )
					count++;

		if(count === 3)
		{
			line( size/5 , (size/5)*i + size/10 , size/1.25 , (size/5)*i + size/10 );
			player1Score++;
			player1Win = true;
			pauseScreen = true;
			endGame = true;
			return;
		}
			else
				count = 0;
	}

	//Checking for all horizontal lines for player2
	for(let i=1 ; i <= 3 ; i++)
	{
		for(let j=1 ; j <= 3 ; j++)
			for(let k=0 ; k < player2.length ; k++)
				if( ( ( (size/5)*j + size/10 ) === player2[k].x ) && ( ( (size/5)*i + size/10 ) === player2[k].y) )
					count++;

		if(count === 3)
		{
			line(size/5 , (size/5)*i + size/10 , size/1.25 , (size/5)*i + size/10);
			player2Score++;
			player2Win = true;
			pauseScreen = true;
			endGame = true;
			return;
		}
			else
				count = 0;
	}

	//Checking for vertical lines for player1
	for(let j=1 ; j <= 3 ; j++)
	{
		for(let i=1 ; i <= 3 ; i++)
			for(let k=0 ; k < player1.length ; k++)
				if( ( ((size/5)*j + size/10) === player1[k].x) && ( ( (size/5)*i + size/10) === player1[k].y ) )
					count++;

		if(count === 3)
		{
			line((size/5)*j + size/10 , size/5 , (size/5)*j + size/10 , size/1.25);
			player1Score++;
			player1Win = true;
			pauseScreen = true;
			endGame = true;
			return;
		}
			else
				count = 0;
	}

	//Checking for vertical lines for player2
	for(let j=1 ; j <= 3 ; j++)
	{
		for(let i=1 ; i <= 3 ; i++)
			for(let k=0 ; k < player2.length ; k++)
				if( ( ( (size/5)*j + size/10) === player2[k].x) && ( ( (size/5)*i + size/10) === player2[k].y ) )
					count++;
				
		if(count === 3)
		{
			line((size/5)*j + size/10 , (size/5) , (size/5)*j + size/10 , size/1.25);
			player2Score++;
			player2Win = true;
			pauseScreen = true;
			endGame = true;
			return;
		}
			else
				count = 0;
	}

	//Checking for top left diagonal to bottom left for player1
	for(let i=1,j=1 ; i <= 3 ; i++,j++)
	{
		for(let k=0 ; k < player1.length ; k++)
			if( ( ( (size/5)*j + size/10) === player1[k].x) && ( ( (size/5)*i + size/10) === player1[k].y ) )
				count++;
	}

	if(count === 3)
	{
		line(size/5 , size/5 , size/1.25 , size/1.25);
		player1Score++;
		player1Win = true;
		pauseScreen = true;
		endGame = true;
		return;
	}
	else
		count = 0;

	//Checking for top left diagonal to bottom right for player2
	for(let i=1,j=1 ; i <= 3 ; i++,j++)
		for(let k=0 ; k < player2.length ; k++)
			if( ( ( (size/5)*j + size/10) === player2[k].x) && ( ( (size/5)*i + size/10) === player2[k].y ) )
				count++;

	if(count === 3)
	{
		line(size/5 , size/5 , size/1.25 , size/1.25);
		player2Score++;
		player2Win = true;
		pauseScreen = true;
		endGame = true;
		return;
	}
	else
		count = 0;

	//Checking for top right diagonal to bottom left for player1
	for(let i=1,j=3 ; i <= 3 ; i++,j--)
		for(let k=0 ; k < player1.length ; k++)
			if( ( ( (size/5)*j + size/10) === player1[k].x ) && ( ( (size/5)*i + size/10) === player1[k].y ) )
				count++;

	if(count === 3)
	{
		line(size/1.25 , size/5 , size/5 , size/1.25);
		player1Score++;
		player1Win = true;
		pauseScreen = true;
		endGame = true;
		return;
	}
	else
		count = 0;

	//Checking for top right diagonal to bottom left for player2
	for(let i=1,j=3 ; i <= 3 ; i++,j--)
		for(let k=0 ; k < player2.length ; k++)
			if( ( ( (size/5)*j + size/10) === player2[k].x ) && ( ( (size/5)*i + size/10) === player2[k].y ) )
				count++;

	if(count === 3)
	{
		line(size/1.25 , size/5 , size/5 , size/1.25);
		player2Score++;
		player2Win = true;
		pauseScreen = true;
		endGame = true;
		return;
	}
	else
		count = 0;
}

function checkIfTie()
{
	//Returns true if it's a tie
	if(player1.length + player2.length === 9)				//9 being the number of boxes or spaces
		if(player1Win === false && player2Win === false)
		{
			playerTie = true;
			pauseScreen = true;
			endGame = true;
		}
}