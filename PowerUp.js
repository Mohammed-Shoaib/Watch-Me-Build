function PowerUp()
{		
	/*power = 1		Triple Bullets
	  power = 2		Cannon
	  power = 3		Shield
	  power = 4		Double Gun
	  power = 5		More Score
	*/

	this.r = 20;
	this.x = floor(random(width));
	this.x = constrain(this.x,this.r,width-this.r);
	this.y = this.r;
	this.ydir = 3;
	this.reveal = 0;
	this.launch = 1;
	this.power = 0;
	this.tempPower = 0;
	this.previousPower = -1; //Saves the value of previous power up so that a power up never repeats
	this.addScore5 = 0;  //PowerUp 5 to have more score
	this.startTime;

	this.show = function()
	{
		if(this.y > height - this.r - 70)
			this.reset();

		if(this.reveal === 1)
		{
			if(this.launch === 1)      //To select a temporary power when it's the first launch
			{	
				this.selectPower();
				this.launch = 0;
			}
			switch(this.tempPower)
			{
				case 5:
				{
					this.y += this.ydir;
					fill(104, 180, 150);
					ellipseMode(CENTER);
					ellipse(this.x,this.y,this.r*2,this.r*2);
					fill(255);
					textSize(20);
					text("+" + this.addScore5,this.x-18,this.y+9);
					break;
				}
				default:
				{
					this.y += this.ydir;
					fill(204, 180, 150);
					ellipseMode(CENTER);
					ellipse(this.x,this.y,this.r*2,this.r*2);
				}
			}
		}
	}

	this.runPowerUp = function(){
		this.power = this.tempPower;
		this.reset();
		this.startTime = Date.now();
	}

	this.selectPower = function(){
		do
		{
			this.tempPower = floor(random(5)) + 1;
		}while(this.tempPower === this.previousPower);
	
		if(this.tempPower === 5)
		{
			this.addScore5 = 0;
			while(this.addScore5 === 0)					//So that PowerUp is never 0
				this.addScore5 = floor(random(6));
			this.addScore5 *= 10;						//If 1, then 10, if 2, then 20 and so on. Maximum value 50;
		}
	}

	this.reset = function(){					//To reset all the values
		this.reveal = 0;
		this.launch = 1;
		this.previousPower = this.tempPower;
		this.tempPower = 0;
		this.x = floor(random(width));						
		this.x = constrain(this.x,this.r,width-this.r);
		this.y = this.r;
	}

	this.hits = function(b){
		if(dist(b.x,b.y,this.x,this.y) < this.r + b.r)	
			return true;
	}

	this.hitsP = function(g){
		if(dist(g.x,g.y,this.x,this.y) < this.r + 7.5)      //7.5 width of gun from center
			return true;
	}

}