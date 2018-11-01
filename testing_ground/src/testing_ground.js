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
        this.dragging = false;
        this.selection = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.mState = this;
        this.selectionColor = '#CC0000'; // This should be incldued in the shapes class as a different one for each shape
        this.selectionWidth = 10;
        this.timeInterval = 30;
        // What is e?
        canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; });
        // Test for my own purposes ,can you use speech marks not just apostrophes
        canvas.addEventListener('mousedown', function (e) {
            var mouse = this.mState.getMouse(e);
            var mouseX = mouse.x;
            var mouseY = mouse.y;
            var shapes = this.mState.shapes;
            var nShapes = shapes.length;
            // for (var i = nShapes - 1; i >= 0; i--) { // his implementation if it doesn't work
            for (var i = 0; i < nShapes; i++) {
                if (shapes[i].contains(mouseX, mouseY)) {
                    var mSelection = shapes[i]; // SHould this be a let. Definitely test this tomorrow!
                    this.mState.dragOffsetX = mouseX - mSelection.x;
                    this.mState.dragOffsetY = mouseY - mSelection.y;
                    this.mState.dragging = true;
                    this.mState.selection = mSelection;
                    this.mState.valid = false;
                    return;
                }
            }
            if (this.mState.selection) {
                this.mState.selection = null;
                this.mState.valid = false;
            }
        }, true); // Why is there a true there, look up api
        canvas.addEventListener('mousemove', function (e) {
            if (this.dragging) {
                var mouse = this.mState.getMouse(e);
                this.mState.selection.x = mouse.x - this.mState.dragOffsetX;
                this.mState.selection.y = mouse.y - this.mState.dragOffsetY;
                this.mState.valid = false;
            }
        }, true);
        canvas.addEventListener('dblclick', function (e) {
            var mouse = this.mState.getMouse();
            this.mState.addShape(new Rectangle(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0, 255, 0, 0.6)')); // these hardcoded things are definitely worth changing
        }, true);
    }
    CanvasState.prototype.addShape = function (shape) {
        this.shapes.push(shape);
        this.valid = false;
    };
    CanvasState.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    CanvasState.prototype.draw = function () {
        if (!this.valid) {
            var context = this.context; // again whats going on here with the var && why are we getting var?
            var shapes = this.shapes;
            this.clear();
            var nShapes = shapes.length; // This could easily be a class variable that is updated with each add or delete shape
            for (var i = 0; i < nShapes; i++) {
                var shape = shapes[i];
                if (shape.x > this.width || shape.y > this.height ||
                    shape.x + shape.width < 0 || shape.y + shape.height < 0) {
                    continue;
                }
                shapes[i].draw(context);
            }
            if (this.selection != null) {
                context.strokeStyle = this.selectionColor;
                context.lineWidth = this.selectionWidth;
                var mSel = this.selection; // can I get rid of stuff like this in favor using selection
                context.strokeRect(mSel.x, mSel.y, mSel.width, mSel.height);
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
s.addShape(new Rectangle(40, 40, 50, 50, 'lightskyblue'));
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
