function Snake(x,y,w,xdir,ydir)
{
	this.w = w;
	this.x = x;
	this.y = y;
	this.xdir = xdir;
	this.ydir = ydir;
	this.newXDir = 0;
	this.newYDir = 0;
	this.fillX = 0;
	this.fillY = 0;

	this.show = function(){
		fill(255);
		rectMode(CENTER);
		rect(this.x,this.y,this.w,this.w);
	}

	this.update = function(xdir,ydir){
		this.x += this.xdir;
		this.y += this.ydir;

		if( (this.xdir !== 0) && (this.newYDir !== 0) )			//This means it's moving left or right at the moment
		{
			if(this.x % this.w === 0);
			else if(this.x % (this.w/2) !== 0);			//Do nothing in either of the cases and let it just move
			else
			{
				this.fillX = this.x;
				this.fillY = this.y;
				this.xdir = this.newXDir;
				this.ydir = this.newYDir;
			}
		}

		else if( (this.ydir !== 0) && (this.newXDir !== 0) )			//This means it's moving up or down at the moment
		{
			if(this.y % this.w === 0);
			else if(this.y % (this.w/2) !== 0);			//Do nothing in either of the cases and let it just move
			else
			{
				this.fillX = this.x;
				this.fillY = this.y;
				this.xdir = this.newXDir;
				this.ydir = this.newYDir;
			}
		}

	}

	this.move = function(xdir,ydir){
		this.newXDir = xdir;
		this.newYDir = ydir;
	}

	this.eats = function(food){
		let d = dist(this.x,this.y,food.x,food.y);
		if(d < 1)
			return true;
	}

	this.hits = function(s){
		let d = dist(this.x,this.y,s.x,s.y);
		if(d < 1)
			return true;
	}

	this.hitsEdge = function(){

		if(this.xdir === -speed)
		{
			if(this.x <= this.w/2 )
				return true;
		}

		else if(this.xdir === speed)
		{
			if(this.x >= cols*this.w - this.w/2)
				return true;
		}

		else if(this.ydir === -speed)
		{
			if(this.y <= this.w/2)
				return true;
		}

		else if(this.ydir === speed)
		{
			if(this.y >= rows*this.w - this.w/2)
				return true;
		}
	}

}