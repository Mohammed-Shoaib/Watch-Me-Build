function Ball()
{
	this.r = 10;
	this.x = width/2;
	this.y = this.r;
	this.ydir = 3;
	this.ballColor;
	this.code = 0;
	this.prevCode = -1;
	this.isFirstLaunch = true;

	this.show = function(){
		if(this.isFirstLaunch)
		{
			this.selectColor();
			this.isFirstLaunch = false;
		}
		fill(this.ballColor);
		noStroke();
		ellipseMode(CENTER);
		ellipse(this.x,this.y,this.r*2,this.r*2);
	}

	this.update = function(){
		this.y += this.ydir;
		if(this.y > height - this.r)
			this.reset();
	}

	this.reset = function(){
		this.y = this.r;
		this.selectColor();
	}

	this.selectColor = function(){
		do
		{
			this.code = floor(random(4)) + 1;
		} while(this.code === this.prevCode);
		this.prevCode = this.code;
		switch(this.code)
		{
			case 1:
				this.ballColor = color("red");
				break;
			case 2:
				this.ballColor = color('rgb(0,0,255)');
				break;
			case 3:
				this.ballColor = color("yellow");
				break;
			case 4:
				this.ballColor = color('#0f0');
				break;
		}
	}

}