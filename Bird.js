function Bird()
{
	this.x = Math.ceil(width/3)%2 ? Math.ceil(width/3)+1 : Math.ceil(width/3);
	this.y = height/2;
	this.r = sizeH/24.5;
	this.gravity = sizeH/1324;
	this.velocity = sizeH/662;		//Starting velocity
	this.drop = sizeH/66.2;		//Accelaration in velocity each time the bird goes up
	this.angle = 0;				//The bird's turning angle, initially 0
	this.lift = false;
	this.birdImg = loadImage("https://i.imgur.com/luB9Opo.png");	//Loading the bird image

	this.show = function(){
		//Drawing the bird on the canvas
		fill("yellow");
		push();
		translate(this.x,this.y);
		rotate(this.angle);
		image(this.birdImg,-this.r*1.3,-this.r*1.3,this.r*2.6,this.r*2.6);
		pop();
	}

	this.update = function(){
		//Updating the parameters when the bird goes up
		this.velocity += this.gravity;
		this.y += this.velocity;
		this.angle += 0.025;
		if(this.angle >= PI/2)
			this.angle = PI/2;
	}

	this.up = function(){
		//Resetting the values when the bird goes up
		this.velocity = -this.drop;
		this.angle = -PI/4;
	}

	this.hit = function(pipe){
		//Calculating if the bird hits a pipe
		if(this.y + this.r > height/1.089)		//If it hits the ground
			return true;
		if(this.x + this.r < pipe.x || this.x - this.r > pipe.x + pipe.width)		//If it hasn't reached the pipe yet
				return false;
		if(this.x + this.r >= pipe.x && this.x - this.r <= pipe.x + pipe.width)		//If it's in the middle of the pipes
		{
			if(this.y - this.r <= pipe.y2 - sizeH/125 || this.y + this.r >= pipe.y1 + sizeH/125){		
				//Above or below a pipe from the middle means it hit the pipe
				//sizeH/125 is the offset to allow some human error
				return true;
			}
			else
				return false;
		}
	}

}