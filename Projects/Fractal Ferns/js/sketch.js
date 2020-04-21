let cnv,x,y,px,py,r;
let rangeX,rangeY,maxX,maxY;
let a,b,c,d,e,f,p;

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
	cnv = createCanvas(windowWidth,windowHeight);
	centerCanvas();
	background(255);
	x = y = 0;
	a = b = c = d = e = f = [];
	rangeX = rangeY = [];

	//Defining the initial conditions

	//Barnsley Fern
	a = [ 0.00, 0.85, 0.20,-0.15 ];
	b = [ 0.00, 0.04,-0.26, 0.28 ];
	c = [ 0.00,-0.04, 0.23, 0.26 ];
	d = [ 0.16, 0.85, 0.22, 0.24 ];
	e = [ 0.00, 0.00, 0.00, 0.00 ];
	f = [ 0.00, 1.60, 1.60, 0.44 ];
	p = [ 0.01, 0.85, 0.07, 0.07 ];
	
	//Range: −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983
	rangeX = [-2.1820, 2.6558];
	rangeY = [0, 9.9983];

	/*
	//Barnsley's Fern - Modified Pinnae
	a = [ 0.000, 0.845, 0.200,-0.150 ];
	b = [ 0.000, 0.035,-0.310, 0.240 ];
	c = [ 0.000,-0.035, 0.255, 0.250 ];
	d = [ 0.200, 0.820, 0.245, 0.200 ];
	e = [ 0.000, 0.000, 0.000, 0.000 ];
	f = [-0.120, 1.600, 0.290, 0.680 ];
	p = [ 0.010, 0.850, 0.070, 0.070 ];

	//Range: −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983
	rangeX = [-2.3255, 1.9227];
	rangeY = [-0.1433, 8.5294];

	//Thelypteridaceae fern
	a = [ 0.000, 0.950, 0.035,-0.040 ];
	b = [ 0.000, 0.005,-0.200, 0.200 ];
	c = [ 0.000,-0.005, 0.160, 0.160 ];
	d = [ 0.250, 0.930, 0.040, 0.040 ];
	e = [ 0.000,-0.002,-0.090, 0.083 ];
	f = [-0.400, 0.500, 0.020, 0.120 ];
	p = [ 0.020, 0.840, 0.070, 0.070 ];

	//Range: -1.4816 < x < 1.4715 and -0.5213 ≤ y < 7.0702
	rangeX = [-1.4816,1.4715];
	rangeY = [-0.5213,7.0702];
	*/

	stroke("green");
	strokeWeight(4);
}

function draw(){
	for(let i=0 ; i<500 ; i++){
		applyTransformation();
		px = map(x,rangeX[0],rangeX[1],0,width);
		py = map(y,rangeY[0],rangeY[1],height,0);
		point(px,py);
	}
}

function applyTransformation(){
	let i;
	r = random(1);

	//Selecting the Transformation
	if(r < p[0])
		i = 0;
	else if(r < p[0] + p[1])
		i = 1;
	else if(r < p[0] + p[1] + p[2])
		i = 2;
	else
		i = 3;

	//Applying the Transformation
	x =  a[i]*x + b[i]*y + e[i];
	y =  c[i]*x + d[i]*y + f[i];
}

function calculateRange(){
	let i = floor(random(4));

	//Applying the Transformation
	x =  a[i]*x + b[i]*y + e[i];
	y =  c[i]*x + d[i]*y + f[i];

	//Calculate the Max Range
	if(x < rangeX[0])
		rangeX[0] = x;
	else if(x > rangeX[1])
		rangeX[1] = x;
	if(y < rangeY[0])
		rangeY[0] = y;
	else if(y > rangeY[1])
		rangeY[1] = y;
}
