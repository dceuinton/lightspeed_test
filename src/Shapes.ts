class Rectangle {
	// [value:string]: number | string | boolean
	x:number
	y: number
	width: number
	height: number
	rotation:number
	fill: string

	selectionColor:string 
	beingHovered:boolean
	hoverColor:string 
	minWidth:number
	minHeight:number
	scalingFactor:number
	scalingRatio:number	

	constructor(x:number, y:number, width:number, height:number, rotation?:number, fill?:string) {
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

export {Rectangle}