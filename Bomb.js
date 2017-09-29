function Bomb()
{
	this.x = floor(random(width));
	this.ydir = 3;
	this.y = 0;
	this.r = 30;
	this.x = constrain(this.x,this.r,width-this.r);
	this.totalW = 12;
	this.wArc = 8;
	this.wLine = this.totalW - this.wArc;
	this.h;
	this.x2,this.y2;
	this.reveal = 1;

	this.show = function(){
		if(this.y > height - 70)
			this.reset();

		if(this.reveal === 1)
		{
			this.y += this.ydir;
			stroke(255,0,100);
			strokeWeight(3);
			fill(0);
			arc(this.x,this.y,this.r*2,this.r*2,-PI/6,PI+PI/6);
			this.x2 = this.x + (this.r * cos(-PI/6) );
			this.y2 = this.y + (this.r * sin(-PI/6) );
			this.h = this.r*sin(-PI/6);
			line(this.x2,this.y2,this.x+this.r-this.totalW,this.y);
			this.x2 = this.x + (this.r * cos(-PI+PI/6) );
			this.y2 = this.y + (this.r * sin(-PI+PI/6) );
			line(this.x2,this.y2,this.x-this.r+this.totalW,this.y);
			arc(this.x+this.r-this.totalW-this.wArc,this.y,this.wArc*2,this.r*2,-PI/2,0);
			arc(this.x-this.r+this.totalW+this.wArc,this.y,this.wArc*2,this.r*2,-PI,-PI/2);
			this.x2 = this.x+this.r-this.totalW-this.wArc;
			this.y2 = this.y + ((this.r*2)/2) * sin(-PI/2);
			line(this.x2,this.y2,this.x+this.r-this.totalW*2,this.y-10);
			this.x2 = this.x-this.r+this.totalW+this.wArc;
			this.y2 = this.y + ((this.r*2)/2) * sin(-PI/2);
			line(this.x2,this.y2,this.x-this.r+this.totalW*2,this.y-10);
			arc(this.x+this.r-this.totalW*2-this.wArc,this.y-10,this.wArc*2,this.r*2+15,-PI/2,0);
			arc(this.x-this.r+this.totalW*2+this.wArc,this.y-10,this.wArc*2,this.r*2+15,-PI,-PI/2);
			noStroke();
			rectMode(CENTER);
			rect(this.x,this.y,this.totalW*2,20);
		}
	}

	this.reset = function(){
		this.reveal = 0;
		this.y = 0;
		this.x = floor(random(width));
		this.x = constrain(this.x,this.r+10,width-this.r-10);
	}

	this.hits = function(g){
		if(dist(g.x,g.y,this.x,this.y) < this.r + 7)
			return true;
	}

	this.hits1 = function(g){
		if(dist(g.x,g.y,this.x,this.y) < this.r + 14)
			return true;
	}

	this.hits2 = function(g){
		if( (dist(g.x,g.y,this.x,this.y) < this.r + 14) || (dist(g.x,g.y+20,this.x,this.y) < this.r + 33) )   //15 width of gun from center
			return true;
	}

	this.hits3 = function(g){
		if(dist(g.x,g.y-10,this.x,this.y) < this.r + 40)    //15 width of gun from center
			return true;
	}

	this.hits4 = function(g){
		if( (dist(g.x4a,g.y,this.x,this.y) < this.r + 7) || (dist(g.x4b,g.y,this.x,this.y) < this.r + 7) )     //7.5 width of gun from center
			return true;
	}

}