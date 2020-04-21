function Player1(x,y)
{
	this.x;
	this.y;
	this.show = function(){
		line(this.x-(size/16.67),this.y-(size/16.67),this.x+(size/16.67),this.y+(size/16.67));
		line(this.x-(size/16.67),this.y+(size/16.67),this.x+(size/16.67),this.y-(size/16.67));
	}

	this.findPos = function(mouseX,mouseY){
		for(let i=1 ; i <= 3 ; i++)
		{
			for(let j=1 ; j <= 3 ; j++)
			{
				if(mouseY >= (size/5)*i && mouseY <= (size/5)*(i+1))
					if(mouseX >= (size/5)*j && mouseX <= (size/5)*(j+1))
					{
						this.y = (size/5)*i + size/10;
						this.x = (size/5)*j + size/10;
					}
			}
		}
	}
}