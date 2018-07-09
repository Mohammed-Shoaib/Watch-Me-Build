function Pipe(x)
{
	this.width = Math.ceil(height/5.5);											//Width of a pipe
	this.gap = height/3.78;														//Gap between 2 pipes
	this.height = random(sizeH/100,height/1.089 - this.gap - height/6.62);		//Height of a pipe
	this.x  = x;																//Making the pipes start from the edge of the screen
	this.y2 = this.height;
	this.y1 = this.height + this.gap;
	this.decreaseX = sizeH/331;													//The value of x that gets decremented each time
	this.isFinished = false;													//To avoid increasing the score more than once for the same pipe

	this.show = function(){
		fill("green");
		rect(this.x,this.y1,this.width,height/1.087 - this.y1);
		rect(this.x,this.y2,this.width,-this.height);
		this.x -= this.decreaseX;
	}
}