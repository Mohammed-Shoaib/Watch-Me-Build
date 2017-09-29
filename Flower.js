function Flower(x,y,l)          //l means level
{
	this.r = 15;
	this.l = l;
	this.x = x;
	this.xdir = 2 + this.l;
	this.y = y;
	this.bx,this.by;
	this.bydir = 5;
	this.br = 10;
	this.launch = 1;

	this.show = function(){
		this.x += this.xdir;
		if(this.x+this.r > width)
		{
			this.xdir = -2 - this.l;
			this.y += 50;
		}
		else if(this.x-this.r < 0)
		{
			this.xdir = 2 + this.l;
			this.y += 50; 
		}
		fill(255,200,200);
		ellipseMode(CENTER);
		ellipse(this.x,this.y,this.r*2,this.r*2);
	}

	this.showB = function(){
		if(this.launch === 1)
		{
			this.bx = this.x;
			this.by = this.y;
		}
		this.launch = 0;
		this.by += this.bydir;
		fill(138,43,226);
		noStroke();
		ellipseMode(CENTER);
		ellipse(this.bx,this.by,this.br*2,this.br*2);
	}

	this.hits = function(b){
		if(dist(b.x,b.y,this.x,this.y) < this.r + b.r)
		{	
			this.r++;
			return true;
		}
	}

	this.hits1 = function(pos){
		if(dist(pos.x,pos.y,this.x,this.y) < this.r + 5)     //Radius of bullet is 5 
		{	
			this.r++;
			return true;
		}
	}

	this.hits2 = function(b){
		if(dist(b.x,b.y,this.x,this.y) < this.r + b.r*3)
		{	
			this.r++;
			return true;
		}
	}

	this.hits4 = function(b){
		if(dist(b.x4a,b.y4a,this.x,this.y) < this.r + b.r)
		{	
			this.r++;
			return 1;
		}
		else if(dist(b.x4b,b.y4b,this.x,this.y) < this.r + b.r)
		{	
			this.r++;
			return 2;
		}
	}

	this.hitsB = function(g){
		if(dist(g.x,g.y,this.bx,this.by) < this.br + 7)      //7.5 width of gun from center
			return true;
	}

	this.hitsB1 = function(g){
		if(dist(g.x,g.y,this.bx,this.by) < this.br + 14)      //15 width of gun from center
			return true;
	}

	this.hitsB2 = function(g){
		if( (dist(g.x,g.y,this.bx,this.by) < this.br + 14) || (dist(g.x,g.y+20,this.bx,this.by) < this.br + 33) )   //15 width of gun from center
			return true;
	}

	this.hitsB3 = function(g){
		if(dist(g.x,g.y-10,this.bx,this.by) < this.br + 40)    //15 width of gun from center
			return true;
	}

	this.hitsB4 = function(g){
		if( (dist(g.x4a,g.y,this.bx,this.by) < this.br + 7) || (dist(g.x4b,g.y,this.bx,this.by) < this.br + 7) )     //7.5 width of gun from center
			return true;
	}
}