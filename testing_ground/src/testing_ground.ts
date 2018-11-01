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
	constructor(x:number, y:number, width:number, height:number, fill:any) {
		this.x = x || 0
		this.y = y || 0
		this.width = width || 0
		this.height = height || 0
		this.fill = fill || '#AAAAAA'
	}

	draw(context:any) {
		context.fillStyle = this.fill
		context.fillRect(this.x, this.y, this.width, this.height)
	} 
}


// Remember to attribute simonsarris
class CanvasState {
	canvas:any
	width:number
	height:number
	context:any

	stylePaddingLeft:any
	stylePaddingTop:any
	styleBorderLeft:any
	styleBorderTop:any

	html:any
	htmlTop:any
	htmlLeft:any

	valid:boolean
	shapes:Rectangle[]
	dragging:boolean
	selection:object
	dragOffsetX:number
	dragOffsetY:number
	mState:object


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
		this.htmlTop = html.offsetTop
		this.htmlLeft = html.offsetLeft

		this.valid = false 
		this.shapes = []
		this.dragging = false
		this.selection = null
		this.dragOffsetX = 0
		this.dragOffsetY = 0
	}
}

var canvas: any = document.getElementById('canvas')           // When I don't know the type do I just use any?
var context = canvas.getContext('2d')

context.fillStyle = 'blue'
context.fillRect(10, 10, 100, 100);
context.fillStyle = 'green'
context.fillRect(100, 100, 200, 200);

console.log(typeof(context.fillstyle))

console.log("Finished!")