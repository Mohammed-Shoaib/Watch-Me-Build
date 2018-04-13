function Blob()
{
	this.r = floor(random(7,53));
	this.c = color(random(100,255),100,random(100,255));
	this.x;
	this.y;
	this.xdir = 0;
	this.ydir = 0;
	this.isFirstLaunch = true;

	this.show = function(){
		this.x += this.xdir;
		this.y -= this.ydir;
		fill(this.c);
		ellipseMode(CENTER);
		ellipse(this.x,this.y,this.r*2,this.r*2);
	}

	this.axis = function(){
		do
		{
			this.x = floor(random(width));
		}while(this.x <= this.r || this.x >= width-this.r);
		do
		{
			this.y = floor(random(height)); 
		}while(this.y <= this.r || this.y >= height-this.r);
	}

	this.speed = function(){
		while(this.xdir === 0)
			this.xdir = floor(random(-1-level,1+level));
		while(this.ydir === 0)
			this.ydir = floor(random(-1-level,1+level));
	}

	this.checkEdge = function(){
		if(this.y < this.r || this.y > height - this.r)
			this.ydir *= -1;

		if(this.x < this.r || this.x > width - this.r)
			this.xdir *= -1;
	}

	this.clicked = function(mouseX,mouseY){
		if(dist(mouseX,mouseY,this.x,this.y) < this.r)
			return true;
	}
}