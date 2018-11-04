import {LSCanvas} from "./LSCanvas"
import {Rectangle} from "./Shapes"

let lsCanvas:LSCanvas = new LSCanvas(<HTMLCanvasElement>document.getElementById("canvas"))
lsCanvas.init()
let rect:Rectangle = new Rectangle(375, 275, 50, 40)
console.log(rect)
lsCanvas.addShape(rect)

setInterval(function() {lsCanvas.draw()}, lsCanvas.timeInterval)

console.log("Hello, world");

let product:string = "Dale"
console.log(typeof(product));