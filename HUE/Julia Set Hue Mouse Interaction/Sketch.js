let size,z,zSquared,c;
let n,maxIterations,angle;
let bright,pix,mid;

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
	size = 300;
	cnv = createCanvas(size,size);
	centerCanvas();
	pixelDensity(1);
}

function draw(){
	loadPixels();
	for(let x=0 ; x<width ; x++){
		for(let y=0 ; y<height ; y++){

			z = [ map(x,0,width,-2,2) , map(y,0,height,2,-2) ];
			c = [ map(mouseX,0,width,-2,2) , map(mouseY,0,height,-2,2) ];
			zSquared = [];

			maxIterations = 100;
			for(n=0 ; n<maxIterations ; n++){
				applyMandelbrot();
				if( Math.pow(z[0],2) + Math.pow(z[1],2) > 32)
					break;
			}

			if(n === maxIterations)
				bright = {r: 0,g: 0,b: 0};
			else{
				let hu = n/maxIterations;
				hu = map(sqrt(hu),0,1,0,255);
				bright = HSBtoRGB(hu,100,100);
			}
			pix = (x + y*width)*4;
			pixels[pix+0] = bright.r;
			pixels[pix+1] = bright.g;
			pixels[pix+2] = bright.b;
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

function HSBtoRGB(h,s,v) {
    let r,g,b,i,f,p,q,t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}