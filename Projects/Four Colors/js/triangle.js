function Triangle()
{
	this.l = 150;
	this.x = this.l/2;
	this.y = this.l/2;
	this.angle = 0;
	this.nextAngle = this.angle;
	this.code = 1;

	this.show = function(){
		translate(width/2,height/2+this.l);
		if(this.angle < this.nextAngle)
			this.angle += 0.07;
		else if(this.angle >= this.nextAngle)
			this.angle = this.nextAngle;
		rotate(this.angle);
		noStroke();
		fill("red");
		triangle(-this.x, -this.y,this.x,-this.y,0,0);
		fill('rgb(0,0,255)');	//Blue color
		triangle(-this.x,-this.y,-this.x,this.y,0,0);
		fill("yellow");
		triangle(-this.x,this.y,this.x,this.y,0,0);
		fill('#0f0');	//Hex code for green
		triangle(this.x,this.y,this.x,-this.y,0,0);
		rotate(-this.angle);
		translate(-width/2,-(height/2+this.l));
	}

	this.rotate = function(){
		this.nextAngle = this.nextAngle + PI/2;
		this.code++;
		if(this.nextAngle === TWO_PI)
			this.code = 1;
		else if(this.nextAngle > TWO_PI)			//Greater than 270 Degrees, then make it 0 to avoid large values of angle
		{
			this.nextAngle = PI/2;
			this.angle = 0;
		}
	}

	this.hits = function(ball){
		if(dist(width/2,height/2+this.l/2,ball.x,ball.y) < ball.r && this.code === ball.code)
			return true;
		
	}

	this.wrongHits = function(ball){
		if(dist(width/2,height/2+this.l/2,ball.x,ball.y) < ball.r && this.code !== ball.code)
			return true;	
	}

}