let size,z,zSquared,c;
let n,maxIterations;
let bright,pix;

function centerCanvas()
{
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x,y);
}

function windowResized()
{
	setup();
}

function setup(){
	if(windowHeight > windowWidth)
		size = windowWidth;
	else
		size = windowHeight;
	cnv = createCanvas(size,size);
	centerCanvas();
	pixelDensity(1);
}

function draw(){
	loadPixels();
	for(let x=0 ; x<width ; x++){
		for(let y=0 ; y<height ; y++){

			z = [ map(x,0,width,-2.5,1.5) , map(y,0,height,2,-2) ];
			c = [z[0],z[1]];
			zSquared = [];

			maxIterations = 100;
			for(n=0 ; n<maxIterations ; n++){
				applyMandelbrot();
				if( Math.pow(z[0],2) + Math.pow(z[1],2) > 32)
					break;
			}

			if(n === maxIterations)
				bright = 0;
			else{
				bright = map(n,0,maxIterations,0,1);
				bright = map(sqrt(bright),0,1,0,255);
			}
			pix = (x + y*width)*4;
			pixels[pix+0] = bright;
			pixels[pix+1] = bright;
			pixels[pix+2] = bright;
			pixels[pix+3] = 255;
		}
	}
	updatePixels();
}

function applyMandelbrot(){
	zSquared[0] = Math.pow(z[0],2) - Math.pow(z[1],2);
	zSquared[1] = 2*z[0]*z[1];

	z[0] = zSquared[0] + c[0];
	z[1] = zSquared[1] + c[1];
}