# Lightspeed Graphics Technical Test


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

### Shape 

The shape class is the superclass of all the specific shapes: Rectangle, Star, Circle, and Triangle. It holds the key data elements that every shape needs, and defines the functions that all shapes need to implement. Some of these important items include:

* Data Items:
* x and y position
* width and height
* radius 
* colors
* important flags
* the type of shape it is as a string 

* Functions: 
* Draw - How the shape is drawn through the Canvas API 
* DrawOutline - How the outline is drawn for selection
* Contains - Checking whether a point is in the shape
* Scale - Change the size of the shape evenly 
* Rotate - Change the orientation of the shape 


