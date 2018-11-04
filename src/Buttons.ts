import {LSCanvas} from "./LSCanvas"
import {Rectangle} from "./Shapes"

class LSCanvasButton {
	mBtn:HTMLButtonElement
	mCanvas:LSCanvas
	// me:LSCanvasButton

	constructor(btn:HTMLButtonElement, canvas:LSCanvas) {
		this.mBtn = btn 
		this.mCanvas = canvas
		// this.addMouseDownUpEventListeners()
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

	// mouseDown() {
	// 	if (this.mCanvas.selection) {
	// 		console.log("Canvas is a thing")
	// 	}
	// 	console.log("Clicked button")
	// }

	mouseUp = () => {
		console.log("Released click on button")
	}
	// mouseUp() {
	// 	console.log("Released click on button")
	// }
}

class LSCanvasRotationButton extends LSCanvasButton {
	mClockwise:boolean 
	mIntervalTime:number = 30
	mIntervalID:any											// any type here

	constructor(btn:HTMLButtonElement, canvas:LSCanvas, clockwise:boolean) {
		super(btn, canvas)
		this.mClockwise = clockwise
		// this.addMouseDownUpEventListeners()
	}

	// init():void {
	// 	this.addMouseDownUpEventListeners()
	// }

	// addMouseDownUpEventListeners():void {
	// 	this.mBtn.addEventListener("mousedown", this.mouseDown, true)
	// 	this.mBtn.addEventListener("mouseup", this.mouseUp, true)
	// }

	mouseDown = () => {
		console.log(this.mCanvas)
		if (this.mCanvas.selection) {
			this.mIntervalID = setInterval(this.rotateSelection, this.mIntervalTime)
			// this.mIntervalID = setInterval(p, this.mIntervalTime)
		}
	}

	mouseUp = () => {
		clearInterval(this.mIntervalID)
	}

	rotateSelection = () => {
		console.log("Calling")
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
		this.mCanvas.addShape(new Rectangle(0, 0, 50, 50))
	}

	mouseUp = () => {}

}

export {LSCanvasButton}
export {LSCanvasRotationButton}
export {LSCanvasRectangleButton}