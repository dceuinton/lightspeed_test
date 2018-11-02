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
        this.fill = fill || "#32FAFA";
        this.selectionColor = "#105151";
        this.beingHovered = false;
        this.hoverColor = "#2EE6E6";
    }
    Rectangle.prototype.draw = function (context) {
        if (this.beingHovered) {
            context.fillStyle = this.hoverColor;
        }
        else {
            context.fillStyle = this.fill;
        }
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.contains = function (x, y) {
        if ((this.x <= x) && (x <= this.x + this.width) && (this.y <= y) && (y <= this.y + this.height)) {
            return true;
        }
        else {
            return false;
        }
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
        this.htmlTop = this.html.offsetTop;
        this.htmlLeft = this.html.offsetLeft;
        this.valid = false;
        this.shapes = [];
        this.nShapes = 0;
        this.dragging = false;
        this.selection = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.mState = this;
        this.selectionWidth = 2;
        this.timeInterval = 30;
    }
    CanvasState.prototype.init = function () {
        var mCanvas = this.mState;
        this.canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; });
        this.canvas.addEventListener("mousedown", function (e, Canvas) {
            // console.log("MouseDown")
            var mouse = mCanvas.getMouse(e);
            var mouseX = mouse.x;
            var mouseY = mouse.y;
            // let shapes:Rectangle[] = mCanvas.shapes
            // let nShapes:number = shapes.length
            // for (var i = mCanvas.nShapes - 1; i >= 0; i--) { 
            for (var i = 0; i < mCanvas.nShapes; i++) {
                if (mCanvas.shapes[i].contains(mouseX, mouseY)) {
                    mCanvas.dragOffsetX = mouseX - mCanvas.shapes[i].x;
                    mCanvas.dragOffsetY = mouseY - mCanvas.shapes[i].y;
                    mCanvas.shapes[i].beingHovered = false;
                    mCanvas.dragging = true;
                    mCanvas.selection = mCanvas.shapes[i];
                    mCanvas.moveToFrontOfShapes(mCanvas.shapes, mCanvas.shapes[i], i);
                    mCanvas.valid = false;
                    return;
                }
            }
            if (mCanvas.selection) {
                mCanvas.selection = null;
                mCanvas.valid = false;
            }
        }, true);
        this.canvas.addEventListener("mouseup", function (e) {
            // console.log("MouseUp")
            if (mCanvas.selection) {
                // mCanvas.selection = null
                mCanvas.dragging = false;
                mCanvas.valid = false;
            }
        }, true);
        this.canvas.addEventListener('mousemove', function (e) {
            var mouse = mCanvas.getMouse(e);
            if (mCanvas.dragging) {
                mCanvas.selection.x = mouse.x - mCanvas.dragOffsetX;
                mCanvas.selection.y = mouse.y - mCanvas.dragOffsetY;
                mCanvas.valid = false;
                return;
            }
            if (mCanvas.selection === null) {
                for (var i = 0; i < mCanvas.nShapes; i++) {
                    if (mCanvas.shapes[i].beingHovered) {
                        mCanvas.shapes[i].beingHovered = false;
                        mCanvas.valid = false;
                    }
                    if (mCanvas.shapes[i].contains(mouse.x, mouse.y)) {
                        mCanvas.shapes[i].beingHovered = true;
                        mCanvas.valid = false;
                        // console.log("hovered")
                        return;
                    }
                }
            }
            // console.log("Still reach here")
        }, true);
        this.canvas.addEventListener('dblclick', function (e) {
            var mouse = mCanvas.getMouse(e);
            mCanvas.addShape(new Rectangle(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0, 255, 0, 0.6)')); // these hardcoded things are definitely worth changing
        }, true);
    };
    CanvasState.prototype.moveToFrontOfShapes = function (shapes, s, index) {
        if (index > 0) {
            for (var i = index; i > 0; i--) {
                shapes[i] = shapes[i - 1];
            }
            shapes[0] = s;
        }
    };
    CanvasState.prototype.addShape = function (shape) {
        this.shapes.push(shape);
        this.valid = false;
        this.nShapes++;
    };
    CanvasState.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    CanvasState.prototype.draw = function () {
        if (!this.valid) {
            this.clear();
            var nShapes = this.shapes.length;
            for (var i = nShapes - 1; i >= 0; i--) {
                if (this.shapes[i].x > this.width || this.shapes[i].y > this.height ||
                    this.shapes[i].x + this.shapes[i].width < 0 || this.shapes[i].y + this.shapes[i].height < 0) {
                    continue;
                }
                this.shapes[i].draw(this.context);
            }
            if (this.selection != null) {
                this.context.strokeStyle = this.selection.selectionColor;
                this.context.lineWidth = this.selectionWidth;
                this.context.strokeRect(this.selection.x, this.selection.y, this.selection.width, this.selection.height);
            }
            this.valid = true;
        }
    };
    CanvasState.prototype.getMouse = function (e) {
        var element = this.canvas;
        var offsetX = 0;
        var offsetY = 0;
        var mouseX = 0;
        var mouseY = 0;
        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while (element = element.offsetParent);
        }
        offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
        offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
        mouseX = e.pageX - offsetX;
        mouseY = e.pageY - offsetY;
        return { x: mouseX, y: mouseY };
    };
    return CanvasState;
}());
var s = new CanvasState(document.getElementById('canvas'));
s.init();
// s.addShape(new Rectangle(40, 40, 50, 50, 'lightskyblue'))
s.addShape(new Rectangle(40, 40, 50, 50));
setInterval(function () { s.mState.draw(); }, s.timeInterval); // would love to know what this does
// init()
// wtf is jQuery
var canvas = document.getElementById('canvas'); // When I don't know the type do I just use any?
var context = canvas.getContext('2d');
// context.fillStyle = 'blue'
// context.fillRect(10, 10, 100, 100);
// context.fillStyle = 'green'
// context.fillRect(100, 100, 200, 200);
console.log(typeof (context.fillstyle));
console.log("Finished!");
