# Lightspeed Graphics Technical Test

Author::Dale Euinton 

## Getting Started 

This is my implementation of the Light Speed Graphics Technical Test. Which 
involves writing a web application in typescript to display four shapes and 
manipulate them. 

Get started on this application by installing Node.js and NPM, then running 
`npm install` in this directory.

The provided NPM commands are

- `npm run build` - Builds the application and puts the result into `dist/`
- `npm run serve` - Runs a development server on `http://localhost:8080`
- `npm run test` - Runs a small set of unit tests on the Shapes.contains() methods 

In the application, shapes can be added by clicking on the buttons provided. Once a shape is in the field, it can be dragged with the `left click` mouse button, scaled with the `mouse wheel`, deleted with a `double click`, and duplication with a `right click`. Rotation is handled with dedicated buttons. Be sure to select the shape that you want to act upon by clicking on it first. 

## Application Architecture 

My application has 3 main types of class: the LSCanvas, which is its own class, the Shape class and subclasses, and the LSCanvasButton class and subclasses. 

### LSCanvas 

The LSCanvas is the object that handles the drawing and manipulation of objects in the HTMLCanvasElement. It holds an array of Shapes and draws them through its draw() method. 

Add shapes to the LSCanvas through its addShape(shape) method and remove them with deleteShape(shape). 

#### Justification

Building the project around LSCanvas resembles a really basic game engine design (to me at least). I see this as a simple and effective way to handle a bunch object that needs to be drawn many times, in sync, and that need ways to manage input and output to the user. 

This interface has makes it easy to add in new shapes, delete them, and to manipulate them, and this design pattern worked well for me. 

### Shape 

The shape class is the superclass of all the specific shapes: **Rectangle, Star, Circle, and Triangle**. The shape class holds the key data elements that every shape needs, and defines the functions that all shapes need to implement. Some of these important items include:

* **Data Items**:
* x and y position
* width and height
* radius 
* colors
* important flags
* the type of shape it is as a string 

* **Functions**: 
* Draw - How the shape is drawn through the Canvas API 
* DrawOutline - How the outline is drawn for selection
* Contains - Checking whether a point is in the shape
* Scale - Change the size of the shape evenly 
* Rotate - Change the orientation of the shape 

This makes it easier to deal with a bunch of shapes as they now have defined traits and behaviours that can be relied upon. It's also made shapes very modular, easy to swap in and out with different types of shapes, and easy to create new types of shapes.

### LSCanvasButton 

This button class implements listeners for clicks and determines actions to be taken for each type of button. There are two types of button I have implemented: a rotation button, LSCanvasRotationButton and the LSCanvas\*Buttons which create whatever shape they are named after. Again, I have used an inheritence hierachy to define the buttons. To create a new sort of button with a simple `mousedown` and `mouseup` listener, you just have to implement LSCanvasButton and define the mouseDown() and mouseUp() methods. 

Particularly important methods: 

* `init()` - Where all the event listeners are set up
* `draw()` - Where the canvas cycles through shapes and draws them - this method has to be called on repeat to continually draw the class
* `getMouse()` - Returns an (x, y) in class MouseLocation that takes into account hmtl padding and other aspects that throw off mouse accuracy

## Areas to be improved upon

**Now fixed after email from Richard:**One area that I know is not correct is the Star class' contains function. I was attempting to turn the radius into a function of theta and check whether the radius of point(x, y) was less than that, but haven't fully managed to get it working yet. It is working a little, but it's still a bit buggy. 

I also became aware quite far through the project that I could create my own html tags for buttons. This sounds like a more elegant way to create the buttons and done again, I would give this a go. 

Other than that, I know that my testing needs to be developed. I've implemented some basic tests for the contains methods in the Shapes classes but these are all fairly basic and could definitely be improved and further testing can be implemented for other functions and classes. Done again, I would write the tests as I go, not right at the end. 

Any feedback at all is appreciated, on these and anything else around this project. I am very new to typescript and javascript and I'm sure most of the things I don't know, I don't know that I don't know them. So, even a few points in the right direction will help.

## Thanks! 




