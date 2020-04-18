function Board()
{

	this.show = function(){
		noStroke();
		fill(120);
		for(let i=0 ; i < 4 ; i++)
			for(let j=0 ; j < 4 ; j++)
				rect( (100*j + 50 ) , (100*i + 50) , 90 , 90 );
	}

	this.findBlockPos = function(blocks){
		let posFound = false;
		let x,y,value;
		while(!posFound)
		{
			let i = floor(random(4));
			let j = floor(random(4));
			x = 100 * j + 50;
			y = 100 * i + 50;
			posFound = true;		//Temporarily set it to true
			for(let i=0 ; i < blocks.length ; i++)
				for(let j=0 ; j < blocks[i].length ; j++)
				{
					if(blocks[i][j] === undefined)
						continue;
					else if(blocks[i][j].x === x && blocks[i][j].y === y)
						posFound = false;	//If the position was not found this would become false again
				}
		}
		if(random(1) < 0.5)
				value = 2;
			else
				value = 4;
		let i = ( y - 50 ) / 100 ;
		let j = ( x - 50 ) / 100 ;
		blocks[i][j] =  new Block(x,y,value);
	}

	this.moveBlocks = function(xdir,ydir,blocks){

		if(xdir === -1)
		{
			for(let i=0 ; i<4 ; i++)
			{

				for(let j=0 ; j<3 ; j++)
					if(blocks[i][j] !== undefined)
					{
						for(let k=j+1 ; k<4 ; k++)
							if(blocks[i][k] !== undefined)
							{
								if(blocks[i][j].value === blocks[i][k].value)
								{
									blocks[i][j].value *= 2;
									blocks[i][k] = undefined;
									break;
								}
								else
									break;
							}
					}

				for(let j=1 ; j<4 ; j++)
				{
					if(blocks[i][j] === undefined)
						continue;
					for(let k=j-1; k >= 0 ; k--)
					{
						if(blocks[i][k] === undefined)
						{
							let x = 100*k + 50;
							let y = 100*i + 50;
							let value = blocks[i][k+1].value;
							blocks[i][k] = new Block(x,y,value);
							blocks[i][k+1] = undefined;
						}
						else
							break;
					}
				}
			}
		}

		else if(xdir === 1)
		{
			for(let i=0 ; i<4 ; i++)
			{
				for(let j=3 ; j>0 ; j--)
					if(blocks[i][j] !== undefined)
					{
						for(let k=j-1 ; k>=0 ; k--)
							if(blocks[i][k] !== undefined)
							{
								if(blocks[i][j].value === blocks[i][k].value)
								{
									blocks[i][j].value *= 2;
									blocks[i][k] = undefined;
									break;
								}
								else
									break;
							}
					}

				for(let j=2 ; j>=0 ; j--)
				{
					if(blocks[i][j] === undefined)
						continue;
					for(let k=j+1; k<4 ; k++)
					{
						if(blocks[i][k] === undefined)
						{
							let x = 100*k + 50;
							let y = 100*i + 50;
							let value = blocks[i][k-1].value;
							blocks[i][k] = new Block(x,y,value);
							blocks[i][k-1] = undefined;
						}
						else
							break;
					}
				}
			}
		}

		else if(ydir === -1)
		{
			for(let j=0 ; j<4 ; j++)
			{

				for(let i=0 ; i<3 ; i++)
					if(blocks[i][j] !== undefined)
					{
						for(let k=i+1 ; k<4 ; k++)
							if(blocks[k][j] !== undefined)
							{
								if(blocks[i][j].value === blocks[k][j].value)
								{
									blocks[i][j].value *= 2;
									blocks[k][j] = undefined;
									break;
								}
								else
									break;
							}
					}

				for(let i=1 ; i<4 ; i++)
				{
					if(blocks[i][j] === undefined)
						continue;
					for(let k=i-1; k >= 0 ; k--)
					{
						if(blocks[k][j] === undefined)
						{
							let x = 100*j + 50;
							let y = 100*k + 50;
							let value = blocks[k+1][j].value;
							blocks[k][j] = new Block(x,y,value);
							blocks[k+1][j] = undefined;
						}
						else
							break;
					}
				}
			}
		}

		else if(ydir === 1)
		{
			for(let j=0 ; j<4 ; j++)
			{
				for(let i=3 ; i>0 ; i--)
					if(blocks[i][j] !== undefined)
					{
						for(let k=i-1 ; k>=0 ; k--)
							if(blocks[k][j] !== undefined)
							{
								if(blocks[i][j].value === blocks[k][j].value)
								{
									blocks[i][j].value *= 2;
									blocks[k][j] = undefined;
									break;
								}
								else
									break;
							}
					}

				for(let i=2 ; i>=0 ; i--)
				{
					if(blocks[i][j] === undefined)
						continue;
					for(let k=i+1; k<4 ; k++)
					{
						if(blocks[k][j] === undefined)
						{
							let x = 100*j + 50;
							let y = 100*k + 50;
							let value = blocks[k-1][j].value;
							blocks[k][j] = new Block(x,y,value);
							blocks[k-1][j] = undefined;
						}
						else
							break;
					}
				}
			}
		}
	}

}