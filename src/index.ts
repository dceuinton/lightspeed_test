import {LSCanvas} from "./LSCanvas"
// import {Rectangle} from "./Shapes"
// import {LSCanvasButton} from "./Buttons"
import {LSCanvasRotationButton} from "./Buttons"
import {LSCanvasRectangleButton} from "./Buttons"
import {LSCanvasCircleButton} from "./Buttons"

let lsCanvas:LSCanvas = new LSCanvas(<HTMLCanvasElement>document.getElementById("canvas"))
lsCanvas.init()
// let rect:Rectangle = new Rectangle(375, 275, 50, 40)
// console.log(rect)
// lsCanvas.addShape(rect)

let btnRotateClockwise:LSCanvasRotationButton = new LSCanvasRotationButton(
	<HTMLButtonElement>document.getElementById("btnRotateClockwise"), lsCanvas, true)
btnRotateClockwise.init()
let btnRotateAntiClockwise:LSCanvasRotationButton = new LSCanvasRotationButton(
	<HTMLButtonElement>document.getElementById("btnRotateAntiClockwise"), lsCanvas, false)
btnRotateAntiClockwise.init()

let btnCreateSquare:LSCanvasRectangleButton = new LSCanvasRectangleButton(
	<HTMLButtonElement>document.getElementById("btnCreateSquare"), lsCanvas)
btnCreateSquare.init()

let btnCreateCircle:LSCanvasCircleButton = new LSCanvasCircleButton(
	<HTMLButtonElement>document.getElementById("btnCreateCircle"), lsCanvas)
btnCreateCircle.init()

setInterval(function() {lsCanvas.draw()}, lsCanvas.timeInterval)

// console.log("Hello, world");

// let product:string = "Dale"
// console.log(typeof(product));