function Bird()
{
	this.x = 200;
	this.y = height/2;
	this.r = 16;
	this.gravity = 0.15;
	this.velocity = 0.5;		//Starting velocity
	this.drop = 5;				//Accelaration in velocity each time the bird goes up
	this.lift = false;
	this.startTime = 0;

	this.show = function(){
		fill("yellow");
		ellipse(this.x,this.y,this.r*2,this.r*2);
	}

	this.update = function(){
		this.velocity += this.gravity;
		this.y += this.velocity;
		this.y_eyes += this.velocity;
	}

	this.up = function(){
		this.velocity = -this.drop;
	}

	this.hit = function(pipe){
		if(this.y + this.r > height)		//If it hits the ground
			return true;
		if(this.x + this.r < pipe.x || this.x - this.r > pipe.x + pipe.width)		//If it hasn't reached the pipe yet
				return false;
		if(this.x + this.r >= pipe.x && this.x - this.r <= pipe.x + pipe.width)		//If it's in the middle of the pipes
		{
			if(this.y - this.r <= pipe.y2 - 2 || this.y + this.r >= pipe.y1 + 2){		
				//Above or below a pipe from the middle means it hit the pipe
				//2 is offset to allow some human error
				return true;
			}
			else
				return false;
		}
	}

}