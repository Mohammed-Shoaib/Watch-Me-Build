function Board(x,y,w)
{
	this.w = w;
	this.x = x + w/2;
	this.y = y + w/2;
	this.c;

	this.show = function(){
		noStroke();
		fill(this.c);
		rectMode(CENTER);
		rect(this.x,this.y,this.w,this.w);
	}
}