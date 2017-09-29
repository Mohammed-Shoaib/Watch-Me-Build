function Bullet(x)
{
	this.x = x;
	this.y = height - 50 - 5;          
	this.ydir = -10;
	this.r = 5;

	this.x4a = x - width/4;			//For double Gun PowerUp
	this.x4b = x + width/4;
	this.y4a = height - 50 - 5;			//For double Gun PowerUp
	this.y4b = height - 50 - 5;

	this.pos1 = [createVector(this.x-10,this.y),createVector(this.x,this.y),createVector(this.x+10,this.y)];//Vector for Triple Bullets which will be an array
	this.xdir1 = [-5,0,5];
	
	this.show = function(){
		this.y += this.ydir;
		fill(255,0,100);
		noStroke();
		ellipseMode(CENTER);
		ellipse(this.x,this.y,this.r*2,this.r*2);
	}

	this.show1 = function(){

		for(var i=0 ; i<this.pos1.length ; i++)
		{
			this.pos1[i].y += this.ydir;
			this.pos1[i].x += this.xdir1[i];
		}
		fill(255,0,100);
		noStroke();
		ellipseMode(CENTER);
		for(var i=0 ; i<this.pos1.length ; i++)
			ellipse(this.pos1[i].x,this.pos1[i].y,this.r*2,this.r*2);
	}

	this.show2 = function(){
		this.y += this.ydir;
		fill(255,0,100);
		noStroke();
		ellipseMode(CENTER);
		ellipse(this.x,this.y,this.r*6,this.r*6);
	}

	this.show4 = function(g){
		this.x4a = g.x4a;
		this.x4b = g.x4b;
		this.y4a += this.ydir;
		this.y4b += this.ydir;
		fill(255,0,100);
		noStroke();
		ellipseMode(CENTER);
		ellipse(this.x4a,this.y4a,this.r*2,this.r*2);
		ellipse(this.x4b,this.y4b,this.r*2,this.r*2);
	}
}