# L-Systems

L-System or Lindenmayer System is a type of formal grammar. Each L-System consists of a set of alphabets that can be used to make string. L-System provides a production rule for a set of symbols that can be used to make the current string an even larger string. To start the string, it provides an axiom or an initial string which can be later expanded using the production rules. Each step of the string can be treated as a generation where the axiom is part of generation 1. L-Systems can also be used to generate fractals. They were first developed in 1968 by Aristid Lindenmayer.

L-Systems can be used to generate many different patterns. By using the string and the alphabets as rules, a huge possibility of doors open. As the generations go on increasing, L-System allows to have more detail in each generation.

We can define each alphabet with a given rule, let’s see the different rules:
* *F* or *G* := Draw forward.
* *A* or *B* := Move forward.
* *+* := Turn left by angle.
* *-* := Turn right by angle.
* *[* := Push position.
* *]* := Pop position.


## Examples Of L-System


### Arrow Weed

Angle: 22.5°

Axiom: *X*

Rules: (*F→FF*),(*X→F[+X][-X]FX*)

<p align="center"><img src="images/Arrow%20Weed.png" height="400" alt="Arrow Weed"></p>


### Binary Tree

Angle: 45°

Axiom: *X*

Rules: (*F→FF*),(*X→F[-X]+X*)

<p align="center"><img src="images/Binary%20Tree.png" height="400" alt="Binary Tree"></p>


### Fuzzy Weed

Angle: 25°

Axiom: *X*

Rules: (*F→FF*),(*X→F+[[X]-X]-F[-FX]+X*)

<p align="center"><img src="images/Fuzzy%20Weed.png" height="400" alt="Fuzzy Weed"></p>


### Twiggy Weed

Angle: 25°

Axiom: *X*

Rules: (*F→FF*),(*X→F[-X]F[-X]+X*)

<p align="center"><img src="images/Twiggy%20Weed.png" height="400" alt="Twiggy Weed"></p>


### Tall Seaweed

Angle: 25°

Axiom: *F*

Rules: (*F→F[+F]F[-F]F*)

<p align="center"><img src="images/Tall%20Seaweed.png" height="400" alt="Tall Seaweed"></p>


### Sierpinski Triangle

Angle: -120°

Axiom: *F-G-G*

Rules: (*F→F-G+F+G-F*),(*G→GG*)

<p align="center"><img src="images/Sierpinski%20Triangle.png" height="400" alt="Sierpinski Triangle"></p>


### Dragon Curve

Angle: 90°

Axiom: *FX*

Rules: (*X→X+YF+*),(*Y→-FX-Y*)

<p align="center"><img src="images/Dragon%20Curve.png" height="400" alt="Dragon Curve"></p>


### Koch Curve

Angle: 90°

Axiom: *F*

Rules: (*F→F+F-F-F+F*)

<p align="center"><img src="images/Koch%20Curve.png" height="400" alt="Koch Curve"></p>


### Koch Snowflake

Angle: 60°

Axiom: *F++F++F*

Rules: (*F→F-F++F-F*)

<p align="center"><img src="images/Koch%20Snowflake.png" height="400" alt="Koch Snowflake"></p>


### Gosper Curve

Angle: 60°

Axiom: *F*

Rules: (*F→F-G--G+F++FF+G-*),(*G→+F-GG--G-F++F+G*)

<p align="center"><img src="images/Gosper%20Curve.png" height="400" alt="Gosper Curve"></p>


### Hilbert Curve

Angle: -90°

Axiom: *X*

Rules: (*X→-YF+XFX+FY-*),(*Y→+XF-YFY-FX+*)

<p align="center"><img src="images/Hilbert%20Curve.png" height="400" alt="Hilbert Curve"></p>


### Moore Curve

Angle: 90°

Axiom: *LFL+F+LFL*

Rules: (*L→-RF+LFL+FR-*),(*R→+LF-RFR-FL+*)

<p align="center"><img src="images/Moore%20Curve.png" height="400" alt="Moore Curve"></p>


### Lévy C Curve

Angle: 45°

Axiom: *F*

Rules: (*F→+F--F+*)

<p align="center"><img src="images/Lévy%20C%20Curve.png" height="400" alt="Lévy C Curve"></p>