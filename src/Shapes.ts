class Shape {
	x:number 
	y:number
	rotation:number 

	width:number
	height:number
	radius:number
	points:number

	color:string 
	selectionColor:string 
	hoverColor:string 
	strokeWidth:number

	beingHovered:boolean 

	scalingFactor:number

	_type:string

	constructor(x:number, y:number, rotation?:number) {
		this.x = x 
		this.y = y 
		this.rotation = rotation || 0

		this.color          = "#000000"
		this.selectionColor = "#000000"
		this.hoverColor     = "#000000"
		this.strokeWidth = 3

		this.beingHovered = false 

		this.scalingFactor = 0.1

		this._type = "SHAPE"

		this.width = 0
		this.height = 0
		this.radius = 0
		this.points = 0
	}

	draw(context:CanvasRenderingContext2D):void {
		console.log(context)
	}

	drawOutline(context:CanvasRenderingContext2D):void {
		console.log(context)
	}

	contains(x:number, y:number, context?:CanvasRenderingContext2D):boolean {
		if (this.x == x && this.y == y) {
			return true
		} 
		return false 
	} 

	rotate(radians:number) {
		this.rotation += (radians % (2 * Math.PI))
	}

	scale(delta:number) {
		console.log(delta)
	}

}

class Rectangle extends Shape { 
	width:number 
	height:number
	minWidth:number
	minHeight:number
	scalingRatio:number	

	constructor(x:number, y:number, width:number, height:number, rotation:number) {
		
		super(x, y, rotation)
		this.width = width
		this.height = height 
		
		this.color = "#00CCFF"
		this.selectionColor = "#006680"
		this.hoverColor = "#00A3CC"

		this.scalingRatio = this.height/this.width
		this.minWidth = 40
		this.minHeight = this.scalingRatio * this.minWidth

		this._type = "RECTANGLE"

		// this.x = x || 0
		// this.y = y || 0
		// this.width = width || 40
		// this.height = height || 30
		// this.fill = fill || "#32FAFA"
		// this.selectionColor = "#105151"
		// this.beingHovered = false
		// this.hoverColor = "#2EE6E6"
		// // this.hoverColor = "#CC0000"
		// this.scalingRatio = this.width/this.height
		// this.minWidth = 40
		// this.minHeight = this.minWidth * (this.height/this.width)
		// this.scalingFactor = 0.1
		// // this.rotation = Math.PI/4
		// this.rotation = rotation || 0
	}

	draw(context:CanvasRenderingContext2D):void {
		context.translate(this.x + this.width/2, this.y + this.height/2)

		context.rotate(this.rotation)
		if (this.beingHovered) {
			context.fillStyle = this.hoverColor	
		} else {
			context.fillStyle = this.color	
		}		
		context.fillRect(-this.width/2, -this.height/2, this.width, this.height)
		context.setTransform(1, 0, 0, 1, 0, 0)
	} 

	drawOutline(context:CanvasRenderingContext2D) {
		context.translate(this.x + this.width/2, this.y + this.height/2)

		context.rotate(this.rotation)
		context.strokeStyle = this.selectionColor	
		context.lineWidth = this.strokeWidth
		context.strokeRect(-this.width/2, -this.height/2, this.width, this.height)
		context.setTransform(1, 0, 0, 1, 0, 0)
	}

	contains(x:number, y:number):boolean {
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

	scale(delta:number):void {
		let midX:number = this.x + this.width/2
		let midY:number = this.y + this.height/2
		let newWidth:number = this.width + delta
		let newHeight:number = this.height + this.scalingRatio * delta

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
}

class Circle extends Shape {

	minRadius:number

	constructor(x:number, y:number, radius:number) {
		super(x, y)
		this.radius = radius

		this.minRadius = 40

		this.color = "#FF0066"
		this.selectionColor = "#800033"
		this.hoverColor = "#CC0052"

		this._type = "CIRCLE"
	}

	draw(context:CanvasRenderingContext2D):void {
		if (this.beingHovered) {
			context.fillStyle = this.hoverColor	
			context.strokeStyle = this.hoverColor	
		} else {
			context.fillStyle = this.color	
			context.strokeStyle = this.color	
		}		

		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
		context.stroke()
		context.fill()
	}

	drawOutline(context:CanvasRenderingContext2D) {
		context.strokeStyle = this.selectionColor
		context.lineWidth = this.strokeWidth

		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
		context.stroke()
	}

	contains(x:number, y:number):boolean {
		let translatedX:number = x - this.x 
		let translatedY:number = y - this.y

		if (translatedX*translatedX + translatedY*translatedY < this.radius * this. radius) {
			return true 
		} else {
			return false 
		}
	}

	scale(delta:number):void {
		this.radius += delta;
		if (this.radius < this.minRadius) {
			this.radius = this.minRadius
		}
	}

}


export{Shape}
export {Rectangle}
export {Circle}

