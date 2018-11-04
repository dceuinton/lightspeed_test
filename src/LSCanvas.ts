import {Shape} from "./Shapes"
import {Rectangle} from "./Shapes"
import {Circle} from "./Shapes"
// import {Star} from "./Shapes"

/*
Borrowed a skeleton of LSCanvas from https://simonsarris.com/making-html5-canvas-useful/ 
This particularly influenced the getMouse and draw methods however I have made changes to these as well
*/

const CSS_STYLE_PADDING_LEFT:number = 102
const CSS_STYLE_PADDING_TOP:number = 104
const CSS_STYLE_BORDER_LEFT:number = 30
const CSS_STYLE_BORDER_TOP:number = 38

const SHAPE_DATA_KEY:string = "shapedata"

class LSCanvas {			
	canvas:HTMLCanvasElement
	width:number
	height:number
	context:CanvasRenderingContext2D

	stylePaddingLeft:number
	stylePaddingTop:number			// naming convention for class variables???
	styleBorderLeft:number
	styleBorderTop:number

	html:any					// figure out what to class this as
	htmlTop:number
	htmlLeft:number

	shapes:Shape[]
	nShapes:number

	selected:boolean
	selection:Shape

	valid:boolean
	dragging:boolean
	dragOffsetX:number
	dragOffsetY:number

	SHAPE_KEY:string = "shapedata"

	mState:LSCanvas

	selectionWidth:number
	timeInterval:number

	constructor(canvas:HTMLCanvasElement) {
		this.canvas = canvas;
		this.context = <CanvasRenderingContext2D> canvas.getContext('2d')
		this.width = canvas.width							
		this.height = canvas.height

		this.stylePaddingLeft = 0
		this.stylePaddingTop = 0
		this.styleBorderLeft = 0
		this.styleBorderTop = 0

		if (document.defaultView && document.defaultView.getComputedStyle) {
			this.stylePaddingLeft = parseInt(<string>document.defaultView.getComputedStyle(canvas, null)[CSS_STYLE_PADDING_LEFT], 10) || 0
			this.stylePaddingTop = parseInt(<string> document.defaultView.getComputedStyle(canvas, null)[CSS_STYLE_PADDING_TOP], 10) || 0
			this.styleBorderLeft = parseInt(<string> document.defaultView.getComputedStyle(canvas, null)[CSS_STYLE_BORDER_LEFT], 10) || 0
			this.styleBorderTop = parseInt(<string> document.defaultView.getComputedStyle(canvas, null)[CSS_STYLE_BORDER_TOP], 10) || 0

			// console.log()
			// console.log(this.stylePaddingLeft)
			// console.log(this.stylePaddingTop)
			// console.log(this.styleBorderLeft)
			// console.log(this.styleBorderTop)
		}

		this.html = document.body.parentNode
		this.htmlTop = this.html.offsetTop
		this.htmlLeft = this.html.offsetLeft

		this.valid = false 

		// if (window.sessionStorage.length > 0) {
		// 	// this.shapes = JSON.parse(window.sessionStorage.getItem(this.SHAPE_KEY))
		// 	this.shapes = this.getShapesFromStorage()
		// } else {
		// 	this.shapes = []	
		// }		

		this.shapes = this.getShapesFromStorage()

		// this.getShapesFromStorage()

		// console.log("Hello")
		// console.log(this.shapes)
		// console.log(typeof(this.shapes))
		// console.log("Bye")


		// this.shapes = []
		this.nShapes = this.shapes.length
		this.dragging = false
		this.selected = false
		this.selection = new Rectangle(0, 0, 0, 0, 0)
		this.dragOffsetX = 0
		this.dragOffsetY = 0

		this.mState = this

		this.selectionWidth = 2
		this.timeInterval = 30
	}

	getShapesFromStorage() : Shape[] {

		let shapes:Shape[] = []
		if (window.sessionStorage.getItem(SHAPE_DATA_KEY)) {
			let jsonString:string = window.sessionStorage.getItem(SHAPE_DATA_KEY) || ""
			let jsonArray:Array<Shape> = JSON.parse(jsonString)
			
			// console.log(jsonArray)		

			for (let i = 0; i < jsonArray.length; i++) {
				let x:number = jsonArray[i]["x"]
				let y:number = jsonArray[i]["y"]
				let rotation:number = jsonArray[i]["rotation"]

				switch(jsonArray[i]._type) {
					case "RECTANGLE":
					let width:number = jsonArray[i]["width"]
					let height:number = jsonArray[i]["height"]
					shapes.push(new Rectangle(x, y, width, height, rotation))
					break;
					case "CIRCLE":
					let radius:number = jsonArray[i]["radius"]
					shapes.push(new Circle(x, y, radius))
					break;
					case "STAR":
					// let radius:number = jsonArray[i]["radius"]
					// let points:number = jsonArray[i]["points"]
					break;
					case "TRIANGLE":
					// let radius:number = jsonArray[i]["radius"]
					// let points:number = jsonArray[i]["points"]
					break;
					default:
					console.log("Type of shape has not been set")
					break;
				}
			}	
		}		

		return shapes
	}

	init() { 
		let mCanvas:LSCanvas = this.mState
		let mContext:CanvasRenderingContext2D = this.context
		this.canvas.addEventListener('selectstart', function(e:Event) {e.preventDefault(); return false})
		
		this.canvas.addEventListener("mousedown", function(e:MouseEvent) {
			// console.log("MouseDown")
			let mouse:MouseLocation = mCanvas.getMouse(e)
			// console.log(mouse)
			let mouseX:number = mouse.x
			let mouseY:number = mouse.y

			// console.log(mouseX)
			// let shapes:Rectangle[] = mCanvas.shapes
			// let nShapes:number = shapes.length

			// for (var i = mCanvas.nShapes - 1; i >= 0; i--) { 
			for (var i = 0; i < mCanvas.nShapes; i++) { 
				if (mCanvas.shapes[i].contains(mouseX, mouseY, mContext)) {
					mCanvas.dragOffsetX = mouseX - mCanvas.shapes[i].x
					mCanvas.dragOffsetY = mouseY - mCanvas.shapes[i].y
					mCanvas.shapes[i].beingHovered = false
					mCanvas.dragging = true
					mCanvas.select(mCanvas.shapes[i]) 
					mCanvas.moveToFrontOfShapes(mCanvas.shapes, mCanvas.shapes[i], i)
					mCanvas.valid = false
					return
				}
			}

			if (mCanvas.liveSelection() && e.button === 0) {
				// mCanvas.selection = null
				mCanvas.deselect()
				mCanvas.valid = false
			}
		}, true) 

		this.canvas.addEventListener("mouseup", function() {
			// console.log("MouseUp")
			if (mCanvas.liveSelection()) {
				// mCanvas.selection = null
				mCanvas.dragging = false
				mCanvas.valid = false 
			}
		}, true)

		this.canvas.addEventListener("wheel", function(e:MouseWheelEvent) {
			// prnt("Scrolling baby " + e.deltaY)
			if (mCanvas.liveSelection()) {
				mCanvas.selection.scale(e.deltaY * mCanvas.selection.scalingFactor * -1)
			}
			mCanvas.valid = false
		}, true)

		this.canvas.addEventListener('mousemove', function(e:MouseEvent) {
			let mouse:MouseLocation = mCanvas.getMouse(e)
			if (mCanvas.dragging && mCanvas.liveSelection()) {				
				mCanvas.selection.x = mouse.x - mCanvas.dragOffsetX
				mCanvas.selection.y = mouse.y - mCanvas.dragOffsetY
				mCanvas.valid = false
				return
			} 

			// if (mCanvas.selection === null) {
				for (let i = 0; i < mCanvas.nShapes; i++) {
					if (mCanvas.shapes[i].beingHovered) {
						mCanvas.shapes[i].beingHovered = false	
						mCanvas.valid = false
					}					
					if (mCanvas.shapes[i].contains(mouse.x, mouse.y, mContext)) {
						mCanvas.shapes[i].beingHovered = true
						mCanvas.valid = false
						// console.log("hovered")
						return
					}
				}			
			// }

			// console.log("Still reach here")
			
		}, true)

		this.canvas.addEventListener('contextmenu', function(e:MouseEvent) {
			e.preventDefault();
			// console.log("Right Click")
			if (mCanvas.liveSelection()) {
				let mouse:MouseLocation = mCanvas.getMouse(e)

				switch(mCanvas.selection._type) {
					case "RECTANGLE":
					mCanvas.addShape(new Rectangle(mouse.x - mCanvas.selection.width/2, 
											   mouse.y - mCanvas.selection.height/2, 
											   mCanvas.selection.width, 
											   mCanvas.selection.height, 
											   0))
					break;
					case "CIRCLE":
					mCanvas.addShape(new Circle(mouse.x, mouse.y, mCanvas.selection.radius))


					break;
					case "STAR":
					
					break;
					case "TRIANGLE":
					
					break;
					default:
					console.log("Type of shape has not been set")
					break;
				}
				
			}		
			return false
		}, true)

		this.canvas.addEventListener('dblclick', function(e:MouseEvent) {
			let mouse:MouseLocation = mCanvas.getMouse(e) 
			for (let i = 0; i < mCanvas.nShapes; i++)	 {
				if (mCanvas.shapes[i].contains(mouse.x, mouse.y, mContext)) {
					// mCanvas.selection = null
					mCanvas.deselect()
					mCanvas.deleteShape(mCanvas.shapes[i])
					mCanvas.valid = false
					return
				}
			}
		}, true)
	}

	moveToFrontOfShapes(shapes:Shape[], s:Shape, index:number) {
		if (index > 0) {
			for (var i = index; i > 0; i--) {
				shapes[i] = shapes[i - 1]
			}	
			shapes[0] = s;
		}		
	}

	addShape(shape:Shape) {
		this.shapes.push(shape)
		this.valid = false
		this.nShapes++
	}

	deleteShape(shape:Shape) {
		let index:number = this.shapes.indexOf(shape)
		if (index > -1) {
			this.shapes.splice(index, 1)
		}
		this.nShapes--
	}

	clear() {
		this.context.clearRect(0, 0, this.width, this.height)
	}

	draw() {
		if (!this.valid) {
			this.clear()

			let nShapes = this.shapes.length
			for (var i = nShapes - 1; i >= 0; i--) {
				if (this.shapes[i].x > this.width || this.shapes[i].y > this.height || 
					this.shapes[i].x + this.shapes[i].width < 0 || this.shapes[i].y + this.shapes[i].height < 0) {
					continue
				}
				// console.log(this.shapes)
				// console.log(i)
				this.shapes[i].draw(this.context)
			}

			if (this.liveSelection()) {
				this.selection.drawOutline(this.context)
			}

			this.valid = true
		}

		window.sessionStorage.setItem(this.SHAPE_KEY, JSON.stringify(this.shapes))
	}

	getMouse(e:MouseEvent):MouseLocation {							// method borrowed from simon sarris 
		let element:any = this.canvas
		let offsetX:number = 0
		let offsetY:number = 0
		let mouseX:number = 0
		let mouseY:number = 0
		// let carryOn:boolean = true

		// console.log(element.offsetParent)

		if (element.offsetParent !== undefined) {
			do {
				offsetX += element.offsetLeft
				offsetY += element.offsetTop
				// console.log(offsetX)
			} while (element = element.offsetParent)
		}

		offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft
		offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop

		// console.log(this.stylePaddingLeft)
		// console.log(this.styleBorderLeft)
		// console.log(this.htmlLeft)

		mouseX = e.pageX - offsetX
		mouseY = e.pageY - offsetY

		// console.log(e.pageX)
		// console.log(mouseX)



		return new MouseLocation(mouseX, mouseY)// {x:mouseX, y:mouseY}				// put this into a custom object?
	}

	select(shape:Shape):void {
		this.selection = shape
		this.selected = true
	}

	deselect():void {
		this.selected = false
	} 

	liveSelection():boolean {
		return this.selected
	}
}

class MouseLocation {
	[coordinate:string]:number
	x:number 
	y:number

	constructor(x:number, y:number) {
		this.x = x
		this.y = y
	}
}

export {LSCanvas}