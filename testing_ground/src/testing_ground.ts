function greeter(person: string) {
	return 'hello ' + person + "!"
}
let mName: string = 'Dale'
console.log(greeter(mName))



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
	constructor(x:number, y:number, width:number, height:number, fill?:any) {
		this.x = x || 0
		this.y = y || 0
		this.width = width || 0
		this.height = height || 0
		this.fill = fill || "#32FAFA"
		this.selectionColor = "#105151"
		this.beingHovered = false
		this.hoverColor = "#2EE6E6"
	}

	draw(context:any) {
		if (this.beingHovered) {
			context.fillStyle = this.hoverColor	
		} else {
			context.fillStyle = this.fill	
		}		
		context.fillRect(this.x, this.y, this.width, this.height)
	} 

	contains(x:number, y:number) {
		if ((this.x <= x) && (x <= this.x + this.width) && (this.y <= y) && (y <= this.y + this.height)) {
			return true
		} else {
			return false
		}
	}
}


// Remember to attribute simonsarris
class CanvasState {						// Rename it to Canvas -> more OO
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
	mState:CanvasState

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
		this.shapes = []
		this.nShapes = 0
		this.dragging = false
		this.selection = null
		this.dragOffsetX = 0
		this.dragOffsetY = 0

		this.mState = this

		this.selectionWidth = 2
		this.timeInterval = 30
	}

	init() { 
		let mCanvas:CanvasState = this.mState
		this.canvas.addEventListener('selectstart', function(e) {e.preventDefault(); return false})
		
		this.canvas.addEventListener("mousedown", function(e, Canvas:CanvasState) {
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

			if (mCanvas.selection) {
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

		this.canvas.addEventListener('mousemove', function(e) {
			let mouse:any = mCanvas.getMouse(e)
			if (mCanvas.dragging) {				
				mCanvas.selection.x = mouse.x - mCanvas.dragOffsetX
				mCanvas.selection.y = mouse.y - mCanvas.dragOffsetY
				mCanvas.valid = false
				return
			} 

			if (mCanvas.selection === null) {
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
			}

			// console.log("Still reach here")
			
		}, true)

		this.canvas.addEventListener('dblclick', function(e) {
			let mouse:any = mCanvas.getMouse(e)
			mCanvas.addShape(new Rectangle(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0, 255, 0, 0.6)'))			// these hardcoded things are definitely worth changing
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

	addShape(shape:Rectangle) {
		this.shapes.push(shape)
		this.valid = false
		this.nShapes++
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
				this.shapes[i].draw(this.context)
			}

			if (this.selection != null) {
				this.context.strokeStyle = this.selection.selectionColor
				this.context.lineWidth = this.selectionWidth
				this.context.strokeRect(this.selection.x, this.selection.y, this.selection.width, this.selection.height)
			}

			this.valid = true
		}
	}

	getMouse(e) {
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

		return {x:mouseX, y:mouseY}
	}
}

var s:CanvasState = new CanvasState(document.getElementById('canvas'))
s.init();
// s.addShape(new Rectangle(40, 40, 50, 50, 'lightskyblue'))
s.addShape(new Rectangle(40, 40, 50, 50))

setInterval(function() {s.mState.draw();}, s.timeInterval)								// would love to know what this does

// init()
// wtf is jQuery

var canvas: any = document.getElementById('canvas')           // When I don't know the type do I just use any?
var context = canvas.getContext('2d')

// context.fillStyle = 'blue'
// context.fillRect(10, 10, 100, 100);
// context.fillStyle = 'green'
// context.fillRect(100, 100, 200, 200);

console.log(typeof(context.fillstyle))

console.log("Finished!")