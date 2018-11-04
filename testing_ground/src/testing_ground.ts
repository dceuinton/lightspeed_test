function greeter(person: string) {
	return 'hello ' + person + "!"
}
let mName: string = 'Dale'
console.log(greeter(mName))

function prnt(message:string) {
	console.log(message)
}

function p() {
	console.log("woohoo")
}

// Drawing 
class DrawableShape {
	x: number
	y: number
	fill: any // What type is this?
	constructor(x:number, y:number, width:number, height:number) {
		this.x = x
		this.y = y
	}
}

class Rectangle {
	x: number
	y: number
	width: number
	height: number
	fill: any
	selectionColor:string 
	beingHovered:boolean
	hoverColor:string 

	minWidth:number
	minHeight:number
	scalingFactor:number
	scalingRatio:number

	rotation:number

	constructor(x:number, y:number, width:number, height:number, rotation?:number, fill?:any) {
		this.x = x || 0
		this.y = y || 0
		this.width = width || 40
		this.height = height || 30
		this.fill = fill || "#32FAFA"
		this.selectionColor = "#105151"
		this.beingHovered = false
		this.hoverColor = "#2EE6E6"
		// this.hoverColor = "#CC0000"
		this.scalingRatio = this.width/this.height
		this.minWidth = 40
		this.minHeight = this.minWidth * (this.height/this.width)
		this.scalingFactor = 0.1
		// this.rotation = Math.PI/4
		this.rotation = rotation || 0
	}

	draw(context:any) {
		context.translate(this.x + this.width/2, this.y + this.height/2)

		context.rotate(this.rotation)
		if (this.beingHovered) {
			context.fillStyle = this.hoverColor	
		} else {
			context.fillStyle = this.fill	
		}		
		context.fillRect(-this.width/2, -this.height/2, this.width, this.height)
		context.setTransform(1, 0, 0, 1, 0, 0)
	} 

	contains(x:number, y:number) {
		let translatedX:number = x - (this.x + this.width/2)
		let translatedY:number = y - (this.y + this.height/2)
		let currentAngle:number = Math.atan(translatedY/translatedX)
		let radius:number = Math.sqrt(translatedX * translatedX + translatedY * translatedY)
		let translatedRotatedX:number = radius * Math.cos(currentAngle - this.rotation)
		let translatedRotatedY:number = radius * Math.sin(currentAngle - this.rotation)

		if ((translatedRotatedX <= this.width/2) && 
			(-this.width/2 <= translatedRotatedX) &&
			(translatedRotatedY <= this.height/2) && 
			(-this.height/2 <= translatedRotatedY)) {
			return true 
		} else {
			return false
		}
	}

	scale(delta:number) {
		let midX:number = this.x + this.width/2
		let midY:number = this.y + this.height/2
		let newWidth:number = this.width + this.scalingRatio * delta
		let newHeight:number = this.height + delta

		if (newWidth < this.minWidth) {
			newWidth = this.minWidth
		}
		if (newHeight < this.minHeight) {
			newHeight = this.minHeight	
		}

		this.x = midX - newWidth/2
		this.y = midY - newHeight/2
		this.width = newWidth
		this.height = newHeight
	}

	rotate(delta:number) {
		this.rotation += (delta % (2 * Math.PI))
	}
}

// class SerializationHelper {
//     static toInstance<T>(obj: T, jsonObj: any) : T {

//         if (typeof obj["fromJSON"] === "function") {
//             obj["fromJSON"](jsonObj);
//         }
//         else {
//             for (var propName in jsonObj) {
//             	// console.log(propName)
//                 obj[propName] = jsonObj[propName] as Rectangle
//             }
//         }

//         return obj;
//     }
// }

// Remember to attribute simonsarris
class LSCanvas {			
	canvas:any
	width:number
	height:number
	context:any

	stylePaddingLeft:any
	stylePaddingTop:any			// naming convention for class variables???
	styleBorderLeft:any
	styleBorderTop:any

	html:any
	htmlTop:any
	htmlLeft:any

	shapes:Rectangle[]
	nShapes:number
	selection:Rectangle

	valid:boolean
	dragging:boolean
	dragOffsetX:number
	dragOffsetY:number

	SHAPE_KEY:string = "shapedata"

	mState:LSCanvas

	selectionWidth:number
	timeInterval:number

	constructor(canvas:any) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d')
		this.width = canvas.width							
		this.height = canvas.height

		if (document.defaultView && document.defaultView.getComputedStyle) {
			this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['PaddingLeft'], 10)      || 0
			this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['PaddingTop'], 10)        || 0
			this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['BorderLeftWidth'], 10)   || 0
			this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['BorderTopWidth'], 10)     || 0
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
		this.selection = null
		this.dragOffsetX = 0
		this.dragOffsetY = 0

		this.mState = this

		this.selectionWidth = 2
		this.timeInterval = 30
	}

	getShapesFromStorage() : Rectangle[] {
		let jsonArray:Array<Object> = JSON.parse(window.sessionStorage.getItem(this.SHAPE_KEY))
		let shapes:Rectangle[] = []

		// console.log(jsonArray)		

		for (let i = 0; i < jsonArray.length; i++) {
			// console.log(jsonArray[i])
			// console.log(jsonArray[i]["x"])
			// console.log(typeof(jsonArray[i]["x"]))

			let x:number = jsonArray[i]["x"]
			let y:number = jsonArray[i]["y"]
			let width:number = jsonArray[i]["width"]
			let height:number = jsonArray[i]["height"]
			let rotation:number = jsonArray[i]["rotation"]

			shapes.push(new Rectangle(x, y, width, height, rotation))
		}

		return shapes
	}

	init() { 
		let mCanvas:LSCanvas = this.mState
		this.canvas.addEventListener('selectstart', function(e) {e.preventDefault(); return false})
		
		this.canvas.addEventListener("mousedown", function(e, Canvas:LSCanvas) {
			// console.log("MouseDown")
			let mouse:any = mCanvas.getMouse(e)
			let mouseX:number = mouse.x
			let mouseY:number = mouse.y
			// let shapes:Rectangle[] = mCanvas.shapes
			// let nShapes:number = shapes.length

			// for (var i = mCanvas.nShapes - 1; i >= 0; i--) { 
			for (var i = 0; i < mCanvas.nShapes; i++) { 
				if (mCanvas.shapes[i].contains(mouseX, mouseY)) {
					mCanvas.dragOffsetX = mouseX - mCanvas.shapes[i].x
					mCanvas.dragOffsetY = mouseY - mCanvas.shapes[i].y
					mCanvas.shapes[i].beingHovered = false
					mCanvas.dragging = true
					mCanvas.selection = mCanvas.shapes[i]
					mCanvas.moveToFrontOfShapes(mCanvas.shapes, mCanvas.shapes[i], i)
					mCanvas.valid = false
					return
				}
			}

			if (mCanvas.selection && e.button === 0) {
				mCanvas.selection = null
				mCanvas.valid = false
			}
		}, true) 

		this.canvas.addEventListener("mouseup", function(e) {
			// console.log("MouseUp")
			if (mCanvas.selection) {
				// mCanvas.selection = null
				mCanvas.dragging = false
				mCanvas.valid = false 
			}
		}, true)

		this.canvas.addEventListener("wheel", function(e) {
			// prnt("Scrolling baby " + e.deltaY)
			if (mCanvas.selection) {
				mCanvas.selection.scale(e.deltaY * mCanvas.selection.scalingFactor * -1)
			}
			mCanvas.valid = false
		}, true)

		this.canvas.addEventListener('mousemove', function(e) {
			let mouse:any = mCanvas.getMouse(e)
			if (mCanvas.dragging) {				
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
					if (mCanvas.shapes[i].contains(mouse.x, mouse.y)) {
						mCanvas.shapes[i].beingHovered = true
						mCanvas.valid = false
						// console.log("hovered")
						return
					}
				}			
			// }

			// console.log("Still reach here")
			
		}, true)

		this.canvas.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			// console.log("Right Click")
			if (mCanvas.selection) {
				let mouse:any = mCanvas.getMouse(e)
				mCanvas.addShape(new Rectangle(mouse.x - mCanvas.selection.width/2, 
											   mouse.y - mCanvas.selection.height/2, 
											   mCanvas.selection.width, 
											   mCanvas.selection.height))
			}		
			return false
		}, true)

		this.canvas.addEventListener('dblclick', function(e) {
			let mouse:any = mCanvas.getMouse(e) 
			for (let i = 0; i < mCanvas.nShapes; i++)	 {
				if (mCanvas.shapes[i].contains(mouse.x, mouse.y)) {
					mCanvas.selection = null
					mCanvas.deleteShape(mCanvas.shapes[i])
					mCanvas.valid = false
					return
				}
			}
		}, true)
	}

	moveToFrontOfShapes(shapes:Rectangle[], s:Rectangle, index:number) {
		if (index > 0) {
			for (var i = index; i > 0; i--) {
				shapes[i] = shapes[i - 1]
			}	
			shapes[0] = s;
		}		
	}

	drawRotationButton(x:number, y:number) {

	}

	addShape(shape:Rectangle) {
		this.shapes.push(shape)
		this.valid = false
		this.nShapes++
	}

	deleteShape(shape:Rectangle) {
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

			if (this.selection != null) {
				this.context.strokeStyle = this.selection.selectionColor
				this.context.lineWidth = this.selectionWidth

				this.context.save()
				this.context.translate(this.selection.x + this.selection.width/2, this.selection.y + this.selection.height/2)
				this.context.rotate(this.selection.rotation)
				this.context.strokeRect(-this.selection.width/2, -this.selection.height/2, this.selection.width, this.selection.height)
				// context.fillRect(-this.selection.width/2, -this.selection.height/2, this.selection.width, this.selection.height)
				this.context.restore()
			}

			this.valid = true
		}

		window.sessionStorage.setItem(this.SHAPE_KEY, JSON.stringify(this.shapes))
	}

	getMouse(e) {							// need to put a type on this
		var element:any = this.canvas
		var offsetX:number = 0
		var offsetY:number = 0
		var mouseX:number = 0
		var mouseY:number = 0

		if (element.offsetParent !== undefined) {
			do {
				offsetX += element.offsetLeft
				offsetY += element.offsetTop
			} while (element = element.offsetParent)
		}

		offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft
		offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop

		mouseX = e.pageX - offsetX
		mouseY = e.pageY - offsetY

		return {x:mouseX, y:mouseY}				// put this into a custom object?
	}
}





var s:LSCanvas = new LSCanvas(document.getElementById('canvas'))
s.init();
// s.addShape(new Rectangle(375, 275, 100, 50))






class LSCanvasButton {
	mBtn:HTMLButtonElement
	mCanvas:LSCanvas
	me:LSCanvasButton

	constructor(btn:HTMLButtonElement, canvas:LSCanvas) {
		this.mBtn = btn 
		this.mCanvas = canvas
		// this.addMouseDownUpEventListeners()
	}

	addMouseDownUpEventListeners() {
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
		this.addMouseDownUpEventListeners()
	}

	addMouseDownUpEventListeners() {
		this.mBtn.addEventListener("mousedown", this.mouseDown, true)
		this.mBtn.addEventListener("mouseup", this.mouseUp, true)
	}

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
		this.mCanvas.selection.rotate(0.05)
		this.mCanvas.valid = false
	}
}

// var btnRotateClockwise:LSCanvasButton = new LSCanvasButton(
// 	<HTMLButtonElement> document.getElementById("btnRotateClockwise"), s)

var btnRotateClockwise:LSCanvasRotationButton = new LSCanvasRotationButton(
	<HTMLButtonElement> document.getElementById("btnRotateClockwise"), s, true)

function rotateSelectedClockwise():void {
	if (s.selection) {
			s.selection.rotate(0.1)	
			s.valid = false 
		} 
}
// var intervalClockwiseID:any = null
// var btnRotateClockwise:HTMLButtonElement = <HTMLButtonElement> document.getElementById("btnRotateClockwise")
// btnRotateClockwise.addEventListener("mousedown", function(e) {
// 	intervalClockwiseID = setInterval(rotateSelectedClockwise, 30), true
// })
// btnRotateClockwise.addEventListener("mouseup", function(e) {
// 	clearInterval(intervalClockwiseID)
// }, true)

function rotateSelectedAntiClockwise():void {
	if (s.selection) {
			s.selection.rotate(-0.1)	
			s.valid = false 
		} 
}
var intervalAntiClockwiseID:any = null
var btnRotateAntiClockwise:HTMLButtonElement = <HTMLButtonElement> document.getElementById("btnRotateAntiClockwise")
btnRotateAntiClockwise.addEventListener("mousedown", function(e) {
	intervalAntiClockwiseID = setInterval(rotateSelectedAntiClockwise, 30), true
})
btnRotateAntiClockwise.addEventListener("mouseup", function(e) {
	clearInterval(intervalAntiClockwiseID)
}, true)

var btnCreateSquare:HTMLButtonElement = <HTMLButtonElement>document.getElementById("btnCreateSquare")
btnCreateSquare.addEventListener("mousedown", function() {
	s.addShape(new Rectangle(0, 0, 50, 50))
}, true)



setInterval(function() {s.mState.draw();}, s.timeInterval)	



// // init()
// // wtf is jQuery

// var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas') //HTMLCanvas
// var context = canvas.getContext('2d')

// // context.fillStyle = 'blue'
// // context.fillRect(10, 10, 100, 100);
// // context.fillStyle = 'green'
// // context.fillRect(100, 100, 200, 200);

// console.log(typeof(context.fillStyle))

// console.log("Finished!")

/* TODO

- Create default sizes for shape and spawn with those - maybe overload constructor

Rotation
	- Callback function for draw to make things way nicer
	- Draw from center always?
Saving data
Different shapes
Buttons
unit tests
report

- remove all anys from the code



- Rename class variables and local variables to better naming conventions
*/


/*
QUESTIONS:

- When I don't know the type do I just use any? e.g. var canvas: any = document.getElementById('canvas')
- typescript in classes use let or var

PROJECT REQUIREMENTS
- Application architecture
- key design decisions
- Unit testing. What do you want me to test.
- How good do you want it to look?
- General how does the npm structure look
- what development environment do you use


*/