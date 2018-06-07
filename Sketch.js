var gun;
var bullets = [];
var flowers = [];
var powerUp;
var bomb;
var randNum,flag,selectFlower;
var numFlowers;
var score,destroyed,level = 1;
var displayAddScore5;
var bulletTime,addBullets;
var bulletsFirstLaunch0, bulletsFirstLaunch2, bulletsFirstLaunch1;
var isFirstLaunch = true,isLastLevel = false,isDied = false,isPause = false;
var pauseScreen,finishTime;

//For starting the program
function setup()
{
	numFlowers = 0;
	score = 0;
	destroyed = 0;
	level = 1;
	bulletTime = 0;
	addBullets = 0;
	bulletsFirstLaunch0 = 1;
	bulletsFirstLaunch2 = 1;
	bulletsFirstLaunch1 = 1;
	pauseScreen = false;
	finishTime = 0;
	createCanvas(1300,600);
	gun = new Gun();
	var size = width - 300;
	for(var rows=8 ; rows>=0 ; rows-=2)
	{
		for(i=0 ; i<10 ; i++)
		{
			flowers[numFlowers] = new Flower((size/9)*i+15,-50*rows+15,level);
			numFlowers++;
		}
	}

	powerUp = new PowerUp();
	bomb = new Bomb();

	var playAgain = createButton("Play Again!");
	var levelNext = createButton("Next Level");
	playAgain.mousePressed(resetSketch);
	levelNext.mousePressed(nextLevel);
}


function resetSketch()
{
	isFirstLaunch = false;
	destroyed = 0;
	level = 1;
	numFlowers = 0;
	bulletTime = 0;
	addBullets = 0;
	pauseScreen = false;
	finishTime = 0;
	gun = new Gun();
	var size = width - 300;
	for(var rows=8 ; rows>=0 ; rows-=2)
	{
		for(i=0 ; i<10 ; i++)
		{
			flowers[numFlowers] = new Flower((size/9)*i+15,-50*rows+15,level);
			numFlowers++;
		}
	}

	powerUp = new PowerUp();
	powerUp.reveal = 0;

	bomb = new Bomb();
}

function nextLevel()
{
	isFirstLaunch = false;
	destroyed = 0;
	if(level === 10)
		isLastLevel = true;
	numFlowers = 0;
	level++;
	bulletTime = 0;
	addBullets = 0;
	pauseScreen = false;
	finishTime = 0;
	bulletsFirstLaunch0 = 1;
	bulletsFirstLaunch2 = 1;
	bulletsFirstLaunch1 = 1;
	gun = new Gun();
	var size = width - 300;
	for(var rows=8 ; rows>=0 ; rows-=2)
	{
		for(i=0 ; i<10 ; i++)
		{
			flowers[numFlowers] = new Flower((size/9)*i+15,-50*rows+15,level);
			numFlowers++;
		}
	}

	powerUp = new PowerUp();
	powerUp.reveal = 0;

	bomb = new Bomb();
}

function draw()
{
	if(isFirstLaunch)
	{
		background(51);
		fill(255);
		textSize(32);
		text("Welcome to Space Invaders Clone!",width/2 - 200,30);
		textSize(25);
		text("Controls:",10,100);
		text("1.Use the arrow keys left and right to move the gun",10,150);
		text("2.Press or Hold the SpaceBar to shoot bullets from the gun",10,200);
		text("3.Press Esc to Pause the game",10,250);
		text("Keep in mind:",10,350)
		text("1.Dodge the falling purple circles and fire! Those will kill you.",10,400);
		text("2.The falling white-ish circle has a PowerUps! Shoot those to get awesome powers xD",10,450);
		text("And that's it!",10,500);
		textSize(32);
		text("Tap or Press SpaceBar to get started! :)",width/2 - 180,550);  
	}
	else if(isDied)
	{
		if(!pauseScreen)
		{
			finishTime = Date.now();
			pauseScreen = true;
		}
		else if(pauseScreen && Date.now() - finishTime < 2000);
		//Do nothing just pause the screen
		else{
		background(51);
		fill(255);
		textSize(32);
		text("Game Over.",width/2-50,200);
		textSize(25);
		text("You died with a score of " + score,10,250);
		text("That was just AWESOME.",10,300)
		text("Thank you so much for playing!",10,350);
		textSize(32);
		text("Tap or Press Esc to play again! :)",width/2 - 180,400);
		}
	}
	else if(isLastLevel)
	{
		if(!pauseScreen)
		{
			finishTime = Date.now();
			pauseScreen = true;
		}
		else if(pauseScreen && Date.now() - finishTime < 2000);
		//Do nothing just pause the screen
		else{
		background(51);
		fill(255);
		textSize(32);
		text("Congratulations u have completed the game!",width/2 - 300,200);
		textSize(25);
		text("You completed with a score of " + score,10,250);
		text("That was just AWESOME.",10,300)
		text("Thank you so much for playing!",10,350);
		textSize(32);
		text("Press SpaceBar to play again! :)",width/2 - 180,400);
		}
	}
	else if(isPause)
	{
		background(51);
		fill(255);
		textSize(32);
		text("Game Paused",width/2-60,height/2-50);
		text("Press SpaceBar to continue...",width/2 - 160,height/2+50);
	}
	else
	{
	background(51);
	if(addBullets === 1)
	{
		if(bulletTime === 0)
			bulletTime = Date.now();

		if(Date.now() - bulletTime > 200)
		{
			var b = new Bullet(gun.x);
			bullets.push(b);
			bulletTime = 0;
		}
	}

	//Checking if user has Died
	if(flowers.length === 0)
	{
		background(51);
	//	fill(255);
	//	textSize(32);
	//	text(message();,600,300);
		nextLevel();
	}

	if(flowers[flowers.length-1].y>500)
		isDied = true;

	//Drawing the PowerUp
	if(powerUp.reveal === 0 && powerUp.power === 0)
	{
		randNum = floor(random(200));
		if(randNum === 0)
			powerUp.reveal = 1;
	}

	if(powerUp.reveal === 1)
	{	
		powerUp.show();
		if(powerUp.tempPower === 5)
			displayAddScore5 = powerUp.addScore5;
	}

	if(powerUp.power !== 5)
	{
		if((Date.now()-powerUp.startTime) > 7000)
			powerUp.power = 0;
	}
	else
	{
		if((Date.now()-powerUp.startTime) > 100)
			powerUp.power = 0;
	}

	//Selecting a random flower to shoot a flower bullet
	randNum = floor(random(50/level));       //Chance of flower bullet depends on the level
	if(randNum === 0)
	{
		selectFlower = floor(random(flowers.length));
		flowers[selectFlower].showB();
	}

	//To drop the bomb after some random time
	if(bomb.reveal === 0)
	{
		randNum = floor(random(200));
		if(randNum === 0)
			bomb.reveal = 1;
	}

	//Showing Bullets
	switch(powerUp.power)
	{

		case 0:
		{
			bulletsFirstLaunch1 = 1;
			bulletsFirstLaunch2 = 1;
			if(bulletsFirstLaunch0 === 1)
			{
				for(var i=bullets.length-1 ; i>=0 ; i--)
					bullets.splice(i,1);
				bulletsFirstLaunch0 = 0;
			}

			gun.show();

			if(powerUp.reveal === 1)
			{
				if(powerUp.hitsP(gun))						//If PowerUp hits the bullet
					powerUp.runPowerUp();

				for(var j=bullets.length-1 ; j >= 0 ; j--)
				{	
					if(powerUp.hits(bullets[j]))			//If the Bullet hits the PowerUp
					{
						powerUp.runPowerUp();
						bullets.splice(j,1);
					}
				}
			}

			for(var i=0 ; i < bullets.length ; i++)
			{
				bullets[i].show();
			}

			//Showing Flower Bullets
			for(var i=0 ; i<flowers.length ; i++)
			{
				flowers[i].show();

				if(flowers[i].hitsB(gun))			//Bullet coming from the randomly selected flower
					isDied = true;

				if(flowers[i].launch === 0)         //To draw only those bullets which have been released from the flowers array
					flowers[i].showB();
			}

			//Splicing bullets if it hits a flower
			for(var i=flowers.length-1 ; i >= 0 ; i--)
			{
				for(var j=bullets.length-1 ; j >= 0 ; j--)
				{	
					if(flowers[i].hits(bullets[j]))
					{
						bullets.splice(j,1);
						score++;
						destroyed++;
					}
				}
			}

			if(bomb.reveal === 1)
			{	
				bomb.show();
				if(bomb.hits(gun))
					isDied = true;
			}

			break;
		
		} //End of case 0

		case 1:
		{
			bulletsFirstLaunch0 = 1;
			bulletsFirstLaunch2 = 1;

			if(bulletsFirstLaunch1 === 1)
			{
				for(var i=bullets.length-1 ; i>=0 ; i--)
					bullets.splice(i,1);
				bulletsFirstLaunch1 = 0;
			}
			gun.show1();

			for(var i=0 ; i < bullets.length ; i++)
				bullets[i].show1();

			//Showing flower & flower Bullets
			for(var i=0 ; i<flowers.length ; i++)
			{
				flowers[i].show();

				if(flowers[i].hitsB1(gun))			//Bullet coming from the randomly selected flower
					isDied = true;

				if(flowers[i].launch === 0)         //To draw only those bullets which have been released from the flowers array
					flowers[i].showB();
			}

			//Splicing bullets if it hits a flower
			for(var i=flowers.length-1 ; i >= 0 ; i--)
			{
				for(var j=bullets.length-1 ; j >= 0 ; j--)
				{	
					for(var k=bullets[j].pos1.length-1 ; k>=0 ; k--)
					{
						if(flowers[i].hits1(bullets[j].pos1[k]))
						{
							bullets[j].pos1[k].y = -10;
							score++;
							destroyed++;
						}
					}

					if( (bullets[j].pos1[0].y < 0) && (bullets[j].pos1[1].y < 0) && (bullets[j].pos1[2].y < 0) )
						bullets.splice(j,1);
				}
			}

			if(bomb.reveal === 1)
			{	
				bomb.show();
				if(bomb.hits1(gun))
					isDied = true;
			}

			break;
		}

		case 2:
		{
			bulletsFirstLaunch0 = 1;						//To avoid any errors
			bulletsFirstLaunch1 = 1;
			if(bulletsFirstLaunch2 === 1)
			{
				for(var i=bullets.length-1 ; i>=0 ; i--)
					bullets.splice(i,1);
				bulletsFirstLaunch2 = 0;
			}

			gun.show2();

			for(var i=0 ; i < bullets.length ; i++)
				bullets[i].show2();

			//Showing Flower Bullets
			for(var i=0 ; i<flowers.length ; i++)
			{
				flowers[i].show();

				if(flowers[i].hitsB2(gun))			//Bullet coming from the randomly selected flower
					isDied = true;

				if(flowers[i].launch === 0)         //To draw only those bullets which have been released from the flowers array
					flowers[i].showB();
			}

			//Splicing bullets if it hits a flower
			for(var i=flowers.length-1 ; i >= 0 ; i--)
			{
				for(var j=bullets.length-1 ; j >= 0 ; j--)
				{	
					if(flowers[i].hits2(bullets[j]))
					{
						bullets.splice(j,1);
						score++;
						destroyed++;
					}
				}
			}

			if(bomb.reveal === 1)
			{	
				bomb.show();
				if(bomb.hits2(gun))
					isDied = true;
			}

			break;
		}

		case 3:
		{
			gun.show3();

			for(var i=0 ; i < bullets.length ; i++)
				bullets[i].show();

			//Showing Flower Bullets
			for(var i=0 ; i<flowers.length ; i++)
			{
				flowers[i].show();

				if(flowers[i].hitsB3(gun))			//Bullet coming from the randomly selected flower
				{
					flowers[i].by = 0;					//To stop Errors of flower Bullet hitting the gun when really it didn't since it thinks like a circle
					flowers[i].launch = 1;
				}

				if(flowers[i].launch === 0)         //To draw only those bullets which have been released from the flowers array
					flowers[i].showB();
			}

			//Splicing bullets if it hits a flower
			for(var i=flowers.length-1 ; i >= 0 ; i--)
			{
				for(var j=bullets.length-1 ; j >= 0 ; j--)
				{	
					if(flowers[i].hits(bullets[j]))
					{
						bullets.splice(j,1);
						score++;
						destroyed++;
					}
				}
			}

			if(bomb.reveal === 1)
			{	
				bomb.show();
				if(bomb.hits3(gun))
					bomb.reset();
			}

			break;
		}

		case 4:
		{
			gun.show4();

			for(var i=0 ; i < bullets.length ; i++)
				bullets[i].show4(gun);

			//Showing Flower Bullets
			for(var i=0 ; i<flowers.length ; i++)
			{
				flowers[i].show();

				if(flowers[i].hitsB4(gun))			//Bullet coming from the randomly selected flower
					isDied = true;

				if(flowers[i].launch === 0)         //To draw only those bullets which have been released from the flowers array
					flowers[i].showB();
			}

			//Splicing bullets if it hits a flower
			for(var i=flowers.length-1 ; i >= 0 ; i--)
			{
				for(var j=bullets.length-1 ; j >= 0 ; j--)
				{	
					switch(flowers[i].hits4(bullets[j]))
					{
						case 1:
						{	
							this.y4a = -10;
							score++;
							destroyed++;
							break;
						}
						case 2:
						{
							this.y4b = -10;
							score++;
							destroyed++;
							break;
						}
					}
				}
			}

			for(var i = bullets.length-1 ; i>=0 ; i--)
			{
				if(bullets[i].y4a < 0 && bullets[i].y4b < 0)
					bullets.splice(i,1);
			}

			if(bomb.reveal === 1)
			{	
				bomb.show();
				if(bomb.hits4(gun))
					isDied = true;
			}

			break;
		}//End of case 4

		case 5:
		{
			if(powerUp.addScore5 !== 0)   	//To add just once and not infinite times
			{
				score += powerUp.addScore5;
				powerUp.addScore5 = 0;
			}

			gun.show();

			for(var i=0 ; i < bullets.length ; i++)
				bullets[i].show();

			//Showing Flower Bullets
			for(var i=0 ; i<flowers.length ; i++)
			{
				flowers[i].show();

				if(flowers[i].hitsB(gun))			//Bullet coming from the randomly selected flower
					isDied = true;

				if(flowers[i].launch === 0)         //To draw only those bullets which have been released from the flowers array
					flowers[i].showB();
			}

			//Splicing bullets if it hits a flower
			for(var i=flowers.length-1 ; i >= 0 ; i--)
			{
				for(var j=bullets.length-1 ; j >= 0 ; j--)
				{	
					if(flowers[i].hits(bullets[j]))
					{
						bullets.splice(j,1);
						score++;
						destroyed++;
					}
				}
			}

			if(bomb.reveal === 1)
			{	
				bomb.show();
				if(bomb.hits(gun))
					isDied = true;
			}

			break;

		}//End of case 5
	}

	for(var i=0 ; i<flowers.length ; i++)
	{
		if(flowers[i].by > height - 80)			//To stop the bullets if they have crossed
		{	
			flowers[i].by = 0;					//To stop Errors of flower Bullet hitting the gun when really it didn't since it thinks like a circle
			flowers[i].launch = 1;
		}
	}

	//Splicing bullets if they cross the top
	for(var i=bullets.length-1 ; i >= 0 ; i--)	
	{
		if(bullets[i].pos1[0].y < 0 && bullets[i].pos1[1].y < 0 && bullets[i].pos1[2].y < 0)
					bullets.splice(i,1);

		else if(bullets[i].y < 0)
			bullets.splice(i,1);
	}

	//Splicing flowers if they get hit by a bullet, i.e, r>15
	for(var i=flowers.length-1 ; i >= 0 ; i--)
		if(flowers[i].r > 15)		
			flowers.splice(i,1);

	//Displaying score,level and number of flowers destroyed
	fill(255);
	textSize(32);
	text("Level: " + level,20,580);
	text("Destroyed: " + destroyed + "/" + numFlowers,200,580);
	text("PowerUp: " + findPowerUp(),750,580);
	text("Score: " + score,1130,580);
	}
}

//To display a message after a level gets completed
function message()
{
	var m = ["Great Job!","Amazing","Keep Going!","Wow.","Astonishing."];
	var l = floor(random(m.length));
	return m[l];
}

function findPowerUp()
{
	switch(powerUp.tempPower)
	{
		case 0:
			return "None";
		case 1:
			return "Triple Bullets";
		case 2:
			return "Cannon";
		case 3: 
			return "Shield";
		case 4:
			return "Double Gun";
		case 5:
			return "+" + displayAddScore5 + " Score";
	}
}

function mousePressed(){
	if( isFirstLaunch && (mouseX>=0 && mouseX<=width) && (mouseY>=0 && mouseY<=height) )
		isFirstLaunch = false;
	else if(isDied)
	{
		isDied = false;
		resetSketch();
	}
	if(mouseX>=0 && mouseX<gun.x)
		gun.moveLeft();
	if(mouseX<= width && mouseX>gun.x)
		gun.moveRight();
}

function mouseReleased(){
	if(gun.xdir != 0)
		gun.xdir = 0;
}

//For moving the gun till the user does not release the arrow key
function keyReleased()
{
	if(keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)
			gun.xdir = 0;
	if(key === " ")
		addBullets = 0;
}


//For moving the gun and creating bullets depending on the key
function keyPressed()
{
	if(keyCode === LEFT_ARROW)
		gun.moveLeft();
	else if(keyCode === RIGHT_ARROW)
		gun.moveRight();
	if(key === " ")
	{
		if(isFirstLaunch)
			isFirstLaunch = false;
		if(isLastLevel)
		{
			isLastLevel = false;
			resetSketch();
		}
		if(isPause)
			isPause = false;
		else
			addBullets = 1;
	}
	if(keyCode === ESCAPE)
	{
		if(isDied)
		{
			isDied = false;
			resetSketch();
		}
		else if(!isDied)
			isPause = true;
	}
}
