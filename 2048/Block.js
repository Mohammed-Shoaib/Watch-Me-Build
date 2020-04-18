function Block(x,y,value)
{
	this.x = x;
	this.y = y;
	this.value = value;
	this.c,this.t;

	this.show = function(){
		push();
		this.x = constrain(this.x,50,350);
		this.y = constrain(this.y,50,350)
		this.findColor();
		fill(this.c);
		rect(this.x,this.y,90,90);
		pop();
		push();
		stroke(this.t);
		fill(this.t);
		textSize(40);
		textAlign(CENTER,CENTER);
		strokeWeight(3);
		text(this.value,this.x,this.y);
		pop();
	}

	this.findColor = function(){
		switch(this.value)
		{
			case 2:
				this.c = color(255);
				this.t = 10;
				break;
			case 4:
				this.c = color(255);
				this.t = 10;
				break;
			case 8:
				colorMode(HSB);
				this.c = color(50, 55, 100);
				this.t = 10;
				break;
			case 16:
				this.c = color('hsb(160, 100%, 50%)');
				this.t = 220;
				break;
			case 32:
				this.c = color(255, 204, 0);
				this.t = 10;
				break;
			case 64:
				this.c = color('hsba(160, 100%, 50%, 0.5)');
				this.t = 220;
				break;
			case 128:
				this.c = color(50, 55, 100);
				this.t = 220;
				break;
			case 256:
				this.c = color("red");
				this.t = 220;
				break;
			case 512:
				this.c = color("orange");
				this.t = 220;
				break;
			case 1024:
				this.c = color("magenta");
				this.t = 220;
				break;
			case 2048:
				this.c = color('#0f0');
				this.t = 10;
				break;
		}
	}

}