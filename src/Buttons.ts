import {LSCanvas} from "./LSCanvas"
import {Rectangle} from "./Shapes"
import {Circle} from "./Shapes"
import {Star} from "./Shapes"
import {Triangle} from "./Shapes"

// Classes: LSCanvasButton, LSCanvasRotationButton, LSCanvasRectangleButton, LSCanvasCircleButton, LSCanvasStarButton, LSCanvasTriangleButton
// Purpose: To create the data structures to implement buttons for rotating and creating shapes in the LSCanvas 
// LSCavnasButton is the super class that all specific buttons should implement 

class LSCanvasButton {
	mBtn:HTMLButtonElement
	mCanvas:LSCanvas

	constructor(btn:HTMLButtonElement, canvas:LSCanvas) {
		this.mBtn = btn 
		this.mCanvas = canvas
	}

	init():void {
		this.addMouseDownUpEventListeners()
	}

	addMouseDownUpEventListeners():void {
		this.mBtn.addEventListener("mousedown", this.mouseDown, true)
		this.mBtn.addEventListener("mouseup", this.mouseUp, true)
	}

	mouseDown = () => {
		if (this.mCanvas.selection) {
			console.log("Canvas is a thing")
		}
		console.log("Clicked button")
	}

	mouseUp = () => {
		console.log("Released click on button")
	}
}

class LSCanvasRotationButton extends LSCanvasButton {
	mClockwise:boolean 
	mIntervalTime:number = 30
	mIntervalID:any											// any type here

	constructor(btn:HTMLButtonElement, canvas:LSCanvas, clockwise:boolean) {
		super(btn, canvas)
		this.mClockwise = clockwise
	}

	mouseDown = () => {
		if (this.mCanvas.selection) {
			this.mIntervalID = setInterval(this.rotateSelection, this.mIntervalTime)
		}
	}

	mouseUp = () => {
		clearInterval(this.mIntervalID)
	}

	rotateSelection = () => {
		if (this.mClockwise) {
			this.mCanvas.selection.rotate(0.05)	
		} else {
			this.mCanvas.selection.rotate(-0.05)
		}
		
		this.mCanvas.valid = false
	}
}

class LSCanvasRectangleButton extends LSCanvasButton {

	constructor(btn:HTMLButtonElement, canvas:LSCanvas) {
		super(btn, canvas)
	}

	mouseDown = () => {
		this.mCanvas.addShape(new Rectangle(0, 0, 50, 50, 0))
	}

	mouseUp = () => {}

}

class LSCanvasCircleButton extends LSCanvasButton {

	constructor(btn:HTMLButtonElement, canvas:LSCanvas) {
		super(btn, canvas)
	}

	mouseDown = () => {
		this.mCanvas.addShape(new Circle(100, 100, 50))
	}

	mouseUp = () => {}

}

class LSCanvasStarButton extends LSCanvasButton {

	constructor(btn:HTMLButtonElement, canvas:LSCanvas) {
		super(btn, canvas)
	}

	mouseDown = () => {
		this.mCanvas.addShape(new Star(100, 100, 50, 5, 0))
	}

	mouseUp = () => {}
}

class LSCanvasTriangleButton extends LSCanvasButton {

	constructor(btn:HTMLButtonElement, canvas:LSCanvas) {
		super(btn, canvas)
	}

	mouseDown = () => {
		this.mCanvas.addShape(new Triangle(100, 100, 50, 0))
	}

	mouseUp = () => {}
}

export {LSCanvasButton}
export {LSCanvasRotationButton}
export {LSCanvasRectangleButton}
export {LSCanvasCircleButton}
export {LSCanvasStarButton}
export {LSCanvasTriangleButton}