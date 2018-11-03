function greeter(person) {
    return 'hello ' + person + "!";
}
var mName = 'Dale';
console.log(greeter(mName));
function prnt(message) {
    console.log(message);
}
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
        // this.hoverColor = "#2EE6E6"
        this.hoverColor = "#CC0000";
        this.minWidth = 5;
        this.minHeight = 5;
        this.scalingFactor = 0.1;
        this.rotation = Math.PI / 4;
        // this.rotation = 0
    }
    Rectangle.prototype.draw = function (context) {
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.rotate(this.rotation);
        if (this.beingHovered) {
            context.fillStyle = this.hoverColor;
        }
        else {
            context.fillStyle = this.fill;
        }
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.setTransform(1, 0, 0, 1, 0, 0);
    };
    Rectangle.prototype.getCurrentAngle = function (x, y) {
        // if (x >= 0 && y >= 0) {
        // 	return Math.atan(x/y)
        // } else if (x >= 0 && y < 0) {
        // 	return (Math.PI - Math.atan(x/y))
        // } else if (x < 0 && y < 0) {
        // 	return Math.PI + Math.atan(x/y)
        // } else {
        // 	return (2 * Math.PI) - Math.atan(x/y)
        // }
        return (Math.atan(y / x));
    };
    Rectangle.prototype.contains = function (x, y) {
        var translatedX = x - (this.x + this.width / 2);
        var translatedY = y - (this.y + this.height / 2);
        var currentAngle = this.getCurrentAngle(translatedX, translatedY);
        var radius = Math.sqrt(translatedX * translatedX + translatedY * translatedY);
        var translatedRotatedX = radius * Math.cos(currentAngle - this.rotation);
        var translatedRotatedY = radius * Math.sin(currentAngle - this.rotation);
        if ((translatedRotatedX <= this.width / 2) &&
            (-this.width / 2 <= translatedRotatedX) &&
            (translatedRotatedY <= this.height / 2) &&
            (-this.height / 2 <= translatedRotatedY)) {
            return true;
        }
        else {
            return false;
        }
        // if ((this.x <= x) && 
        // 	(x <= this.x + this.width) && 
        // 	(this.y <= y) && 
        // 	(y <= this.y + this.height)) {
        // 	return true
        // } else {
        // 	return false
        // }
    };
    Rectangle.prototype.scale = function (delta) {
        var midX = this.x + this.width / 2;
        var midY = this.y + this.height / 2;
        var newWidth = this.width + delta;
        var newHeight = this.height + delta;
        if (newWidth < this.minWidth) {
            newWidth = this.minWidth;
        }
        if (newHeight < this.minHeight) {
            newHeight = this.minHeight;
        }
        this.x = midX - newWidth / 2;
        this.y = midY - newHeight / 2;
        this.width = newWidth;
        this.height = newHeight;
    };
    return Rectangle;
}());
// Remember to attribute simonsarris
var LSCanvas = /** @class */ (function () {
    function LSCanvas(canvas) {
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
    LSCanvas.prototype.init = function () {
        var mCanvas = this.mState;
        this.canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; });
        this.canvas.addEventListener("mousedown", function (e, Canvas) {
            console.log("MouseDown");
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
            if (mCanvas.selection && e.button === 0) {
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
        this.canvas.addEventListener("wheel", function (e) {
            // prnt("Scrolling baby " + e.deltaY)
            if (mCanvas.selection) {
                mCanvas.selection.scale(e.deltaY * mCanvas.selection.scalingFactor * -1);
            }
            mCanvas.valid = false;
        }, true);
        this.canvas.addEventListener('mousemove', function (e) {
            var mouse = mCanvas.getMouse(e);
            if (mCanvas.dragging) {
                mCanvas.selection.x = mouse.x - mCanvas.dragOffsetX;
                mCanvas.selection.y = mouse.y - mCanvas.dragOffsetY;
                mCanvas.valid = false;
                return;
            }
            // if (mCanvas.selection === null) {
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
            // }
            // console.log("Still reach here")
        }, true);
        this.canvas.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            console.log("Right Click");
            if (mCanvas.selection) {
                var mouse = mCanvas.getMouse(e);
                mCanvas.addShape(new Rectangle(mouse.x - mCanvas.selection.width / 2, mouse.y - mCanvas.selection.height / 2, mCanvas.selection.width, mCanvas.selection.height));
            }
            return false;
        }, true);
        this.canvas.addEventListener('dblclick', function (e) {
            var mouse = mCanvas.getMouse(e);
            for (var i = 0; i < mCanvas.nShapes; i++) {
                if (mCanvas.shapes[i].contains(mouse.x, mouse.y)) {
                    mCanvas.selection = null;
                    mCanvas.deleteShape(mCanvas.shapes[i]);
                    mCanvas.valid = false;
                    return;
                }
            }
        }, true);
    };
    LSCanvas.prototype.moveToFrontOfShapes = function (shapes, s, index) {
        if (index > 0) {
            for (var i = index; i > 0; i--) {
                shapes[i] = shapes[i - 1];
            }
            shapes[0] = s;
        }
    };
    LSCanvas.prototype.addShape = function (shape) {
        this.shapes.push(shape);
        this.valid = false;
        this.nShapes++;
    };
    LSCanvas.prototype.deleteShape = function (shape) {
        var index = this.shapes.indexOf(shape);
        if (index > -1) {
            this.shapes.splice(index, 1);
        }
        this.nShapes--;
    };
    LSCanvas.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    LSCanvas.prototype.draw = function () {
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
                this.context.save();
                this.context.translate(this.selection.x + this.selection.width / 2, this.selection.y + this.selection.height / 2);
                this.context.rotate(this.selection.rotation);
                this.context.strokeRect(-this.selection.width / 2, -this.selection.height / 2, this.selection.width, this.selection.height);
                // context.fillRect(-this.selection.width/2, -this.selection.height/2, this.selection.width, this.selection.height)
                this.context.restore();
            }
            this.valid = true;
        }
    };
    LSCanvas.prototype.getMouse = function (e) {
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
    return LSCanvas;
}());
var s = new LSCanvas(document.getElementById('canvas'));
s.init();
// s.addShape(new Rectangle(40, 40, 50, 50, 'lightskyblue'))
s.addShape(new Rectangle(375, 275, 100, 50));
setInterval(function () { s.mState.draw(); }, s.timeInterval);
// init()
// wtf is jQuery
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// context.fillStyle = 'blue'
// context.fillRect(10, 10, 100, 100);
// context.fillStyle = 'green'
// context.fillRect(100, 100, 200, 200);
console.log(typeof (context.fillstyle));
console.log("Finished!");
/* TODO

- Create default sizes for shape and spawn with those - maybe overload constructor

Rotation
    - Callback function for draw to make things way nicer
    - Draw from center always?
Saving data
Different shapes
Buttons
unit tests
report



- Rename class variables and local variables to better naming conventions
*/
/*
QUESTIONS:

- When I don't know the type do I just use any? e.g. var canvas: any = document.getElementById('canvas')


PROJECT REQUIREMENTS
- Application architecture
- key design decisions
- Unit testing. What do you want me to test.
- How good do you want it to look?
- General how does the npm structure look
- what development environment do you use


*/ 
