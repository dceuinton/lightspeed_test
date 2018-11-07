import {LSCanvas} from "./LSCanvas"
import {LSCanvasRotationButton} from "./Buttons"
import {LSCanvasRectangleButton} from "./Buttons"
import {LSCanvasCircleButton} from "./Buttons"
import {LSCanvasStarButton} from "./Buttons"
import {LSCanvasTriangleButton} from "./Buttons"
// import {Rectangle} from "./Shapes"

let lsCanvas:LSCanvas = new LSCanvas(<HTMLCanvasElement>document.getElementById("canvas"))
lsCanvas.init()

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

let btnCreateStar:LSCanvasStarButton = new LSCanvasStarButton(
	<HTMLButtonElement>document.getElementById("btnCreateStar"), lsCanvas)
btnCreateStar.init()

let btnCreateTriangle:LSCanvasTriangleButton = new LSCanvasTriangleButton(
	<HTMLButtonElement>document.getElementById("btnCreateTriangle"), lsCanvas)
btnCreateTriangle.init()

setInterval(function() {lsCanvas.draw()}, lsCanvas.timeInterval)

// let r:Rectangle = new Rectangle(0, 0, 50, 50, 0)
// console.log("Contains: " + r.contains(25, 25))