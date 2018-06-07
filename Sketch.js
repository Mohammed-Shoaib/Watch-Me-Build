let cnv;
let playerChance;
let player1;
let player2 ;
let player1Win, player2Win,playerTie;
let player1Score,player2Score;
let pauseScreen;
let game;
let startTime;

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
	playerChance = 1;
	player1 = [];
	player2 = [];
	player1Win = false;
	player2Win = false;
	playerTie = false;
	pauseScreen = false;
	player1Score = 0;
	player2Score = 0;
	game = 1;
	cnv = createCanvas(500,500);
	centerCanvas();
}
	
function nextGame()
{
	player1 = [];
	player2 = [];
	player1Win = false;
	player2Win = false;
	playerTie = false;
	pauseScreen = false;
	game++;
	if(game %2 === 0)
		playerChance = 2;
	else 
		playerChance = 1;
	createCanvas(500,500);
}

function draw()
{
	if(!pauseScreen)
	{
		background(51);
		stroke(255);
		strokeWeight(5);
		line(200,100,200,400);
		line(300,100,300,400);
		line(100,200,400,200);
		line(100,300,400,300);
	}
	if(pauseScreen && Date.now() - startTime < 2000)
	{
		//Do nothing just pause the screen
	}
	else if(player1Win && (Date.now() - startTime >= 2000) )
	{
		push();
		stroke(255);
		strokeWeight(1);
		fill(255);
		background(51);
		textSize(32);
		text("Player 1 Wins!",140,100);
		text("Score now:",170,160);
		text("Player 1: " + player1Score,10,220);
		text("Player 2: " + player2Score,330,220);
		text("Games Played: " + game,120,280);
		text("Tap or Press SpaceBar",90,350);
		text("to go to the next Game!",90,400);
		pop();
	}
	else if(player2Win  && (Date.now() - startTime >= 2000) )
	{
		push();
		stroke(255);
		strokeWeight(1);
		fill(255);
		background(51);
		textSize(32);
		text("Player 2 Wins!",140,100);
		text("Score now:",170,160);
		text("Player 1: " + player1Score,10,220);
		text("Player 2: " + player2Score,330,220);
		text("Games Played: " + game,120,280);
		text("Tap or Press SpaceBar",90,350);
		text("to go to the next Game!",90,400);
		pop();
	}
	else if(playerTie  && (Date.now() - startTime >= 2000) )
	{
		push();
		stroke(255);
		strokeWeight(1);
		fill(255);
		background(51);
		textSize(32);
		text("It's a Tie!",190,100);
		text("Score now:",170,160);
		text("Player 1: " + player1Score,10,220);
		text("Player 2: " + player2Score,330,220);
		text("Games Played: " + game,120,280);
		text("Tap or Press SpaceBar",90,350);
		text("to go to the next Game!",90,400);
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
	push();
	stroke(255);
	strokeWeight(1);
	fill(255);
	textSize(25);
	text("Player Chance: " + playerChance,160,480);
	text("Player 1",10,40);
	text("Player 2",380,40);
	text("Game",220,40);
	text(game,245,80);
	text(player1Score,40,80);
	text(player2Score,420,80);
	pop();
	}//End of else
}

function mousePressed()
{
	if(player1Win || player2Win || playerTie)
		nextGame();
	else if(mouseX >= 100 && mouseX <= 400)
	{
		if(mouseY >= 100 && mouseY <= 400)
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
	let i = floor(Y/100);
	let j = floor(X/100);

	for(let k=0 ; k < player1.length ; k++)
	{
		if( ( (j*100 + 50) === player1[k].x) && ( ( i*100 + 50) === player1[k].y) )
			return true;
	}
	for(let k=0 ; k < player2.length ; k++)
	{
		if( ( (j*100 + 50) === player2[k].x) && ( ( i*100 + 50) === player2[k].y) )
			return true;
	}
	return false;
}

function checkWin(player1,player2)
{
	startTime = Date.now();
	let count = 0;
	stroke("red");
	//Checking for all horizontal lines for player1
	for(let i=1 ; i <= 3 ; i++)
	{
		for(let j=1 ; j <= 3 ; j++)
			for(let k=0 ; k < player1.length ; k++)
				if( ( (100*j + 50 ) === player1[k].x ) && ( (100*i + 50 ) === player1[k].y) )
					count++;

		if(count === 3)
		{
			line(100 , 100*i + 50 , 400 , 100*i + 50);
			player1Score++;
			player1Win = true;
			pauseScreen = true;
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
				if( ( (100*j + 50 ) === player2[k].x ) && ( (100*i + 50 ) === player2[k].y) )
					count++;

		if(count === 3)
		{
			line(100 , 100*i + 50 , 400 , 100*i + 50);
			player2Score++;
			player2Win = true;
			pauseScreen = true;
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
				if( ( (100*j + 50) === player1[k].x) && ( (100*i + 50) === player1[k].y ) )
					count++;

		if(count === 3)
		{
			line(100*j + 50 , 100 , 100*j + 50 , 400);
			player1Score++;
			player1Win = true;
			pauseScreen = true;
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
				if( ( (100*j + 50) === player2[k].x) && ( (100*i + 50) === player2[k].y ) )
					count++;
				
		if(count === 3)
		{
			line(100*j + 50 , 100 , 100*j + 50 , 400);
			player2Score++;
			player2Win = true;
			pauseScreen = true;
			return;
		}
			else
				count = 0;
	}

	//Checking for top left diagonal to bottom left for player1
	for(let i=1,j=1 ; i <= 3 ; i++,j++)
	{
		for(let k=0 ; k < player1.length ; k++)
			if( ( (100*j + 50) === player1[k].x) && ( (100*i + 50) === player1[k].y ) )
				count++;
	}

	if(count === 3)
	{
		line(100 , 100 , 400 , 400);
		player1Score++;
		player1Win = true;
		pauseScreen = true;
		return;
	}
	else
		count = 0;

	//Checking for top left diagonal to bottom right for player2
	for(let i=1,j=1 ; i <= 3 ; i++,j++)
		for(let k=0 ; k < player2.length ; k++)
			if( ( (100*j + 50) === player2[k].x) && ( (100*i + 50) === player2[k].y ) )
				count++;

	if(count === 3)
	{
		line(100 , 100 , 400 , 400);
		player2Score++;
		player2Win = true;
		pauseScreen = true;
		return;
	}
	else
		count = 0;

	//Checking for top right diagonal to bottom left for player1
	for(let i=1,j=3 ; i <= 3 ; i++,j--)
		for(let k=0 ; k < player1.length ; k++)
			if( ( (100*j + 50) === player1[k].x ) && ( (100*i + 50) === player1[k].y ) )
				count++;

	if(count === 3)
	{
		line(400 , 100 , 100 , 400);
		player1Score++;
		player1Win = true;
		pauseScreen = true;
		return;
	}
	else
		count = 0;

	//Checking for top right diagonal to bottom left for player2
	for(let i=1,j=3 ; i <= 3 ; i++,j--)
		for(let k=0 ; k < player2.length ; k++)
			if( ( (100*j + 50) === player2[k].x ) && ( (100*i + 50) === player2[k].y ) )
				count++;

	if(count === 3)
	{
		line(400 , 100 , 100 , 400);
		player2Score++;
		player2Win = true;
		pauseScreen = true;
		return;
	}
	else
		count = 0;
}

function checkIfTie()
{
	if(player1.length + player2.length === 9)				//9 being the number of boxes or spaces
		if(player1Win === false && player2Win === false)
		{

			playerTie = true;
			pauseScreen = true;
		}
}
