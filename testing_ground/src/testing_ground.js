function greeter(person) {
    return 'hello ' + person + "!";
}
var mName = 'Dale';
console.log(greeter(mName));
// Drawing 
var DrawableShape = /** @class */ (function () {
    function DrawableShape(x, y, width, height) {
        this.x = x;
        this.y = y;
    }
    return DrawableShape;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height, fill) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.fill = fill || '#AAAAAA';
    }
    Rectangle.prototype.draw = function (context) {
        context.fillStyle = this.fill;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Rectangle;
}());
// Remember to attribute simonsarris
var CanvasState = /** @class */ (function () {
    function CanvasState(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        if (document.defaultView && document.defaultView.getComputedStyle) {
            this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['PaddingLeft'], 10) || 0;
            this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['PaddingTop'], 10) || 0;
            this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['BorderLeftWidth'], 10) || 0;
            this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['BorderTopWidth'], 10) || 0;
        }
        this.html = document.body.parentNode;
    }
    return CanvasState;
}());
var canvas = document.getElementById('canvas'); // When I don't know the type do I just use any?
var context = canvas.getContext('2d');
context.fillStyle = 'blue';
context.fillRect(10, 10, 100, 100);
context.fillStyle = 'green';
context.fillRect(100, 100, 200, 200);
console.log(typeof (context.fillstyle));
console.log("Finished!");
