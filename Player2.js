function Player2()
{
	this.x;
	this.y;

	this.show = function(){
		push();
		noFill();
		ellipse(this.x,this.y,60,60);
		pop();
	}

	this.findPos = function(mouseX,mouseY){
		for(let i=1 ; i <= 3 ; i++)
		{
			for(let j=1 ; j <= 3 ; j++)
			{
				if(mouseY >= 100*i && mouseY <= 100*(i+1))
					if(mouseX >= 100*j && mouseX <= 100*(j+1))
					{
						this.y = 100*i + 50;
						this.x = 100*j + 50;
					}
			}
		}
	}
}