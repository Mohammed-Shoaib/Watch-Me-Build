function Pipe()
{
	this.height = random(400) + 50;		//Height of a pipe
	this.width = 100;					//Width of a pipe
	this.gap = 150;						//Gap between 2 pipes
	this.x  = width  - this.width/2;						//Making the pipes start from the edge of the screen
	this.y1 = height - this.height;
	this.y2 = height - this.height-this.gap;
	this.show = function(){
		fill("green");
		rect(this.x,this.y1,this.width,this.height);
		rect(this.x,this.y2,this.width,-(height-this.height));
		this.x -= 2;
		if(this.x < -80)
		{
			this.x = width;
			this.height = random(400) + 50;
			this.y1 = height-this.height;
			this.y2 = height-this.height-this.gap;
		}
	}
}