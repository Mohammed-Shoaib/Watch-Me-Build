function Food(x,y,w)
{
	this.w = w;
	this.x = x;
	this.y = y;

	this.show = function(){
		fill(255,0,100);
		rectMode(CENTER);
		rect(this.x,this.y,this.w,this.w);
	}
}