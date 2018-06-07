function Gun()
{
	this.x = width/2;
	this.y = height - 70;
	this.xdir = 0;

	this.x4a = width/4;			//For double Gun PowerUp
	this.x4b = width - width/4;

	this.moveLeft = function(){
		gun.xdir = -5;
	}

	this.moveRight = function(){
		gun.xdir = 5;
	}

	this.show = function(){
		this.x += this.xdir;			
		this.x = constrain(this.x,7.5,width-7.5);
		fill(255);
		rectMode(CENTER);
		rect(this.x,this.y,15,40);
	}

	this.show1 = function(){
		this.x += this.xdir;			
		this.x = constrain(this.x,15,width-15);
		fill(255);
		rectMode(CENTER);
		rect(this.x,this.y,30,40);
		stroke(255);
		strokeWeight(1);
		fill(255);
		line(this.x-15,this.y+20,this.x-30,this.y-20);
		line(this.x+15,this.y+20,this.x+30,this.y-20);
		line(this.x-30,this.y-20,this.x-15,this.y-20);
		line(this.x+30,this.y-20,this.x+15,this.y-20);
	}

	this.show2 = function(){
		this.x += this.xdir;			
		this.x = constrain(this.x,35,width-35);
		fill(255);
		arc(this.x,this.y+20,70,70,-PI,PI);
		rectMode(CENTER);
		rect(this.x,this.y,30,40);
	}

	this.show3 = function(){
		this.x += this.xdir;			
		this.x = constrain(this.x,7.5,width-7.5);
		stroke("green");
		strokeWeight(8);
		noFill();
		arc(this.x,this.y-10,80,80,-PI,PI);
		fill(255);
		rectMode(CENTER);
		rect(this.x,this.y,15,40);
		noStroke();
	}

	this.show4 = function(){
		this.x = width/2;     		//Doesn't matter
		this.x4a += this.xdir;	
		this.x4b += this.xdir;		
		this.x4a = constrain(this.x4a,7.5,width/2-7.5);
		this.x4b = constrain(this.x4b,width/2,width-7.5);
		fill(255);
		rectMode(CENTER);
		rect(this.x4a,this.y,15,40);
		rect(this.x4b,this.y,15,40);

	}
}
