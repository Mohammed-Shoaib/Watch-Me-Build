let cnv,axiom,rules,sentence,buttons,angle,len,selectL,drop,name;

function windowResized()
{
	resetSketch();
}

function setup(){
	rules = [];
	buttons = [];
	selectL = 0;

	//Creating buttons for all the L-Systems
	name = "Wavy Seaweed";
	createNameButton(0);

	name = "Arrow Weed";
	createNameButton(1);

	name = "Binary Tree";
	createNameButton(2);

	name = "Fuzzy Weed";
	createNameButton(3);

	name = "Twiggy Weed";
	createNameButton(4);

	name = "Tall Seaweed";
	createNameButton(5);
	createElement('br');

	name = "Sierpinski Triangle";
	createNameButton(6);

	name = "Dragon Curve";
	createNameButton(7);

	name = "Koch Curve";
	createNameButton(8);

	name = "Koch Snowflake";
	createNameButton(9);

	name = "Gosper Curve";
	createNameButton(10);
	createElement('br');

	name = "Hilbert Curve";
	createNameButton(11);

	name = "Moore Curve";
	createNameButton(12);

	name = "L&eacute;vy C Curve";
	createNameButton(13);
	createElement('br');

	name = "Generate";
	buttons[name] = createButton("Generate!").addClass("btn-success");
	buttons[name].mousePressed(generate);

	if(windowWidth > windowHeight){
		size = windowHeight;
		size -= size/3.75;
	}
	else
		size = windowWidth;
	cnv = createCanvas(size,size);
	cnv.style('display','block');

	LSystem();
	sentence = axiom;
	turtle();
}

function createNameButton(value){
	buttons[name] = createButton(name).addClass("btn-primary");
	buttons[name].mousePressed(() => {
		selectL = value;
		resetSketch();
	});
}

function resetSketch(){
	if(windowWidth > windowHeight){
		size = windowHeight;
		size -= size/4.075;
	}
	else
		size = windowWidth;
	cnv = createCanvas(size,size);
	cnv.style('display','block');

	rules = [];
	LSystem();
	sentence = axiom;
	turtle();
}

function generate(){
	len *= drop;
	newSentence = "";
	for(let i=0 ; i<sentence.length ; i++){
		let current = sentence.charAt(i);
		let flag = false;
		for(let j=0 ; j<rules.length ; j++)
			if(rules[j].a == current){
				newSentence += rules[j].b;
				flag = true;
				break;
			}
		if(!flag)
			newSentence += current;
	}
	sentence = newSentence;
	turtle();
}

function turtle(){
	background(255);
	selectTranslate();
	for(let i=0 ; i<sentence.length ; i++){
		let current = sentence.charAt(i);
		if(current == "F" || current == "G"){
			line(0,0,0,-len);
			translate(0,-len);
		}
		else if(current == "A"){
			fill(0);
			rect(0,0,len,size/25);
			translate(len,0);
		}
		else if(current == "B")
			translate(len,0);
		else if(current == "M")
			translate(0,size/50);
		else if(current == "+")
			rotate(angle);
		else if(current == "-")
			rotate(-angle);
		else if(current == "[")
			push();
		else if(current == "]")
			pop();
	}
}

function LSystem(){
	switch(selectL){
		case 0:{
			//Wavy Seaweed
			angle = radians(22.5);
			axiom = "F";
			selectT = 0;
			rules.push({
				a: "F",
				b: "FF-[-F+F+F]+[+F-F-F]"
			});

			//Without Drop
			len = size/115;
			drop = 1;

			//With Drop
			len = size/3.6;
			drop = 0.5;

			break;
		}
		case 1:{
			//Arrow Weed
			angle = radians(30);
			axiom = "X";
			selectT = 0;
			rules.push({
				a: "F",
				b: "FF"
			});
			rules.push({
				a: "X",
				b: "F[+X][-X]FX"
			});

			//Without Drop
			len = size/1030;
			drop = 1;

			//With Drop
			len = size/2;
			drop = 0.5;

			break;
		}
		case 2:{
			//Binary Tree
			angle = radians(45);
			axiom = "X";
			selectT = 0;
			rules.push({
				a: "X",
				b: "F[-X]+X"
			});
			rules.push({
				a: "F",
				b: "FF"
			});

			//Without Drop
			len = size/930;
			drop = 1;

			//With Drop
			len = size*1.09;
			drop = 0.5;

			break;
		}
		case 3:{
			//Fuzzy Weed
			angle = radians(25);
			axiom = "X";
			selectT = 0;
			rules.push({
				a: "X",
				b: "F+[[X]-X]-F[-FX]+X"
			});
			rules.push({
				a: "F",
				b: "FF"
			});

			//Without Drop
			len = size/325;
			drop = 1;

			//With Drop
			len = size/2.6;
			drop = 0.5;

			break;
		}
		case 4:{
			//Twiggy Weed
			angle = radians(25);
			axiom = "X";
			selectT = 0;
			rules.push({
				a: "F",
				b: "FF"
			});
			rules.push({
				a: "X",
				b: "F[-X]F[-X]+X"
			});

			//Without Drop
			len = size/1000;
			drop = 1;

			//With Drop
			len = size/1.95;
			drop = 0.5;

			break;
		}
		case 5:{
			//Tall Seaweed
			angle = radians(25);
			axiom = "F";
			selectT = 0;
			rules.push({
				a: "F",
				b: "F[+F]F[-F]F"
			});

			//Without Drop
			len = size/740;
			drop = 1;

			//With Drop
			len = size/11.5;
			drop = 0.5;

			break;
		}
		case 6:{
			//Sierpinski Triangle
			angle = radians(-120);
			axiom = "F-G-G";
			selectT = 1;
			rules.push({
				a: "F",
				b: "F-G+F+G-F"
			});
			rules.push({
				a: "G",
				b: "GG"
			});

			//Without Drop
			len = size/530;
			drop = 1;

			//With Drop
			len = size*0.975;
			drop = 0.5;

			break;
		}
		case 7:{
			//Dragon Curve
			angle = radians(90);
			axiom = "FX"
			selectT = 2;
			rules.push({
				a: "X",
				b: "X+YF+"
			});
			rules.push({
				a: "Y",
				b: "-FX-Y"
			});

			// Dragon curve works without drop
			len = size/53;
			drop = 1;

			break;
		}
		case 8:{
			//Koch Curve
			angle = radians(90);
			axiom = "F";
			selectT = 1;
			rules.push({
				a: "F",
				b: "F+F-F-F+F"
			});

			//Koch Curve looks better without drop
			len = size/83;
			drop = 1;

			break;
		}
		case 9:{
			//Koch Snowflake
			angle = radians(60);
			axiom = "F++F++F";
			selectT = 3;
			rules.push({
				a: "F",
				b: "F-F++F-F"
			});

			//Without Drop
			len = size/95;
			drop = 1;

			//With Drop
			len = size/13.5;
			drop = 0.5;

			break;
		}
		case 10:{
			//Gosper Curve
			angle = radians(60);
			axiom = "F";
			selectT = 4;
			rules.push({
				a: "F",
				b: "F-G--G+F++FF+G-"
			});
			rules.push({
				a: "G",
				b: "+F-GG--G-F++F+G"
			});

			//Without Drop
			len = size/57.5;
			drop = 1;

			//With Drop
			//len = size/3.6;
			//drop = 0.5;

			break;
		}
		case 11:{
			//Hilbert Curve
			angle = radians(-90);
			axiom = "X";
			selectT = 1;
			rules.push({
				a: "X",
				b: "-YF+XFX+FY-"
			});
			rules.push({
				a: "Y",
				b: "+XF-YFY-FX+"
			});

			//Without Drop
			len = size/130;
			drop = 1;

			//With Drop
			//len = size/1.025;
			//drop = 0.5;

			break;
		}
		case 12:{
			//Moore Curve
			angle = radians(90);
			axiom = "LFL+F+LFL";
			selectT = 0;
			rules.push({
				a: "L",
				b: "-RF+LFL+FR-"
			});
			rules.push({
				a: "R",
				b: "+LF-RFR-FL+"
			});

			//Without Drop
			len = size/130;
			drop = 1;

			//With Drop
			//len = size/2.025;
			//drop = 0.5;

			break;
		}
		case 13:{
			//Lévy C Curve
			angle = radians(45);
			axiom = "F";
			selectT = 5;
			rules.push({
				a: "F",
				b: "+F--F+"
			});

			//Lévy C Curve looks better without drop
			len = size/65;
			drop = 1;

			break;
		}
		/*TODO
		case 4:{
			angle = radians(45);
			axiom = "X";
			selectT = 0;
			rules.push({
				a: "X",
				b: "F[-X][+X]"
			});

			//Without Drop
			//len = 30;
			//drop = 1;

			//With Drop
			len = size*2;
			drop = 0.5;
			
			break;
		}
		case 4:{
			//Cantor Set
			angle = radians(0);		//Angle doesn't matter
			axiom = "A";
			selectT = 6;
			rules.push({
				a: "A",
				b: "ABA"
			});
			rules.push({
				a: "B",
				b: "BBB"
			});

			//With Drop
			len = size/1.025;
			drop = 1/3;

			break;
		}*/
	}
}

function selectTranslate(){
	switch(selectT){
		case 0:{
			translate(width/2,height);
			break;
		}
		case 1:{
			translate(size/75,height - size/75);
			break;
		}
		case 2:{
			translate(width/5,height/2);
			break;
		}
		case 3:{
			translate(width/4,height);
			break;
		}
		case 4:{
			translate(width - width/25,size/2.75);
			break;
		}
		case 5:{
			translate(size/3,height - height/3.8);
			break;
		}
		case 6:{
			translate(size/75,size/75);
		}
	}
}

//Fixing the double tap bug on mobile
function mousePressed(){
	return false;
}
