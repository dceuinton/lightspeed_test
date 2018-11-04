class Shape {
	x:number 
	y:number
	rotation:number 

	color:string 
	selectionColor:string 
	hoverColor:string 

	beingHovered:boolean 

	_type:string

	constructor(x:number, y:number, rotation:number) {
		this.x = x 
		this.y = y 
		this.rotation = rotation 

		this.color          = "#000000"
		this.selectionColor = "#000000"
		this.hoverColor     = "#000000"

		this.beingHovered = false 

		this._type = "SHAPE"
	}

	draw(context:CanvasRenderingContext2D):void {
		console.log(context)
	}

	contains(x:number, y:number):boolean {
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
	scalingFactor:number
	scalingRatio:number	
	// _type:string

	constructor(x:number, y:number, width:number, height:number, rotation:number) {
		
		super(x, y, rotation)
		this.width = width
		this.height = height 
		
		this.color = "#32FAFA"
		this.selectionColor = "#105151"
		this.hoverColor = "#2EE6E6"

		this.scalingRatio = this.height/this.width
		this.scalingFactor = 0.1
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

// class Circle

export {Rectangle}
export{Shape}

