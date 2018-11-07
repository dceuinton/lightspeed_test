import {Rectangle} from "../Shapes"
import {Circle} from "../Shapes"
import {Star} from "../Shapes"
import {Triangle} from "../Shapes"
import {assert} from "chai"
// import {expect} from "chai"

describe("Rectangle.contains(x,y)", () => {
		var mRect:Rectangle = new Rectangle(0, 0, 50, 50, 0)
		// var contains:Function = mRect.contains

		it("should return a boolean", () => {				
			assert.typeOf(mRect.contains(0, 0), "boolean", "contains is not returning a boolean")
		});

		it("point in rectangle test - should return true", () => {
			assert.equal(mRect.contains(mRect.x + mRect.width/2+1, mRect.y + mRect.height/2), true, "point is not in rectangle")
		});

		it("point in rectangle test - should return true", () => {
			assert.equal(mRect.contains(0,25), true, "(0, 25) is not in rectangle")
		});

		it("point in rectangle test - should return false", () => {
			assert.equal(mRect.contains(-1,25), false, "(-1, 25) is in rectangle")
		});

		it("point in rectangle test - should return false", () => {
			assert.equal(mRect.contains(mRect.x + mRect.width + 1,mRect.y + mRect.height + 1), false, "(mRect.x + mRect.width + 1,mRect.y + mRect.height + 1) is in rectangle")
		});

		it("point in rectangle test - should return true", () => {
			assert.equal(mRect.contains(mRect.x + mRect.width - 1, mRect.y + mRect.height - 1), true, "(mRect.x + mRect.width - 1, mRect.y + mRect.height - 1) is in rectangle")
		});

		it("checking contains after moving (true)", () => {
			mRect.updatePosition(mRect.x + 100, mRect.y)
			assert.equal(mRect.contains(100, 25), true, "after moving right 100, point is not in rectangle")
			mRect.updatePosition(mRect.x - 100, mRect.y)
		});

		it("checking contains after moving (false)", () => {
			mRect.updatePosition(mRect.x + 100, mRect.y)
			assert.equal(mRect.contains(0, 0), false, "after moving right 100, point 0, 0 is in rectangle")
			mRect.updatePosition(mRect.x - 100, mRect.y)
		});

		it("point in rectangle test - rotated inside (false)", () => {
			mRect.rotate(0.5)
			assert.equal(mRect.contains(mRect.width - 1, mRect.height - 1), false, "(mRect.width - 1, mRect.height - 1) after rotating 0.5rads is somehow in the rectangle")
			mRect.rotate(-0.5)
		});

		it("point in rectangle test - rotated inside (true)", () => {
			let angle:number = 0.5
			mRect.rotate(angle)
			assert.equal(mRect.contains(mRect.x + mRect.width, mRect.y + mRect.height/2), true, "rotated 0.5rads and tried to match rotation, but not in the rectangle")
			mRect.rotate(-angle)
		});

		it("scaling test - (true)", () => {
			mRect.scale(-20)
			assert.equal(mRect.contains(mRect.width - 5, mRect.height - 5), true, "scaling doesn't include point slightly inside shape")
			mRect.scale(20)
		});

		it("scaling test - (false)", () => {
			let prevH:number = mRect.height
			mRect.scale(-20)
			assert.equal(mRect.contains(mRect.x + mRect.width/2, mRect.y - prevH/2), false, "scaling somehow include old height even after getting smaller")
			mRect.scale(20)
		});
});

describe("Circle.contains(x,y)", () => {
		var mCircle:Circle = new Circle(0, 0, 50)
		// var contains:Function = mRect.contains

		it("should return a boolean", () => {				
			assert.typeOf(mCircle.contains(0, 0), "boolean", "contains is not returning a boolean")
		});

		it("point in circle test - should return true", () => {
			assert.equal(mCircle.contains(mCircle.x + mCircle.radius/2, mCircle.y + mCircle.radius/2), true, "point is not in circle")
		});

		it("point in circle test - should return true", () => {
			assert.equal(mCircle.contains(0,25), true, "(0, 25) is not in circle")
		});

		it("point in circle test - should return false", () => {
			assert.equal(mCircle.contains(-51,25), false, "(-51, 25) is in circle")
		});

		it("point in circle test - should return false", () => {
			assert.equal(mCircle.contains(mCircle.x + mCircle.radius + 1,mCircle.y + mCircle.radius + 1), false, "(mCircle.x + mCircle.radius + 1,mCircle.y + mCircle.radius + 1) is in circle")
		});

		it("point in circle test - should return true", () => {
			assert.equal(mCircle.contains(mCircle.x + mCircle.radius - 1, 0), true, "(mCircle.x + mCircle.radius - 1, 0) is in circle")
		});

		it("checking contains after moving (true)", () => {
		mCircle.updatePosition(mCircle.x + 100, mCircle.y)
		assert.equal(mCircle.contains(100, 0), true, "after moving right 100, point is not in circle")
		mCircle.updatePosition(mCircle.x - 100, mCircle.y)
		});

		it("checking contains after moving (false)", () => {
		mCircle.updatePosition(mCircle.x + 100, mCircle.y)
		assert.equal(mCircle.contains(0, 0), false, "after moving right 100, point is in circle")
		mCircle.updatePosition(mCircle.x - 100, mCircle.y)
		});

		it("scaling test - (true)", () => {
			mCircle.scale(-20)
			assert.equal(mCircle.contains(mCircle.x, mCircle.y - mCircle.radius + 1), true, "scaling doesn't include point slightly inside shape")
			mCircle.scale(20)
		});

		it("scaling test - (false)", () => {
			let prevR:number = mCircle.radius
			mCircle.scale(-20)
			assert.equal(mCircle.contains(mCircle.x, mCircle.y - prevR -5), false, "scaling somehow include old radius size even after getting smaller")
			mCircle.scale(20)
		});
});

describe("Triangle.contains(x,y)", () => {
	var mTriangle:Triangle = new Triangle(0, 0, 50, 0)

	it("should return a boolean", () => {
		assert.typeOf(mTriangle.contains(0, 0), "boolean", "contains is not returning a boolean")
	});

	it("point in triangle test - origin (true)", () => {
		assert.equal(mTriangle.contains(0, 0), true, "(0, 0) is not in the triangle")
	});

	it("point in triangle test - inside (true)", () => {
		assert.equal(mTriangle.contains(0, -mTriangle.radius+1), true, "(0, -mTriangle.radius+1) is not in the triangle")
	});

	it("point in triangle test - outside (false)", () => {
		assert.equal(mTriangle.contains(10000, 10000), false, "(10000, 10000) is somehow in the triangle")
	});

	it("point in triangle test - outside (false)", () => {
		assert.equal(mTriangle.contains(0, -mTriangle.radius -1), false, "(0, -mTriangle.radius -1) is somehow in the triangle")
	});

	it("checking contains after moving (true)", () => {
		mTriangle.updatePosition(mTriangle.x + 100, mTriangle.y)
		assert.equal(mTriangle.contains(100, 0), true, "after moving right 100, point is not in triangle")
		mTriangle.updatePosition(mTriangle.x - 100, mTriangle.y)
	});

	it("checking contains after moving (false)", () => {
		mTriangle.updatePosition(mTriangle.x + 100, mTriangle.y)
		assert.equal(mTriangle.contains(0, 0), false, "after moving right 100, point is in triangle")
		mTriangle.updatePosition(mTriangle.x - 100, mTriangle.y)
	});

	it("point in triangle test - rotated inside (false)", () => {
		mTriangle.rotate(0.5)
		assert.equal(mTriangle.contains(0, mTriangle.radius-1), false, "(0, mTriangle.radius-1) rotated 0.5rads is somehow in the triangle")
		mTriangle.rotate(-0.5)
	});

	it("point in triangle test - rotated inside (true)", () => {
		let angle:number = 0.5
		mTriangle.rotate(angle)
		assert.equal(mTriangle.contains(0, 0), true, "rotated 0.5rads and tried to match rotation, but not in the triangle")
		mTriangle.rotate(-angle)
	});

	it("scaling test - (true)", () => {
		mTriangle.scale(-20)
		assert.equal(mTriangle.contains(mTriangle.x, mTriangle.y - mTriangle.radius + 1), true, "scaling doesn't include point slightly inside shape")
		mTriangle.scale(20)
	});

	it("scaling test - (false)", () => {
		let prevR:number = mTriangle.radius
		mTriangle.scale(-20)
		assert.equal(mTriangle.contains(mTriangle.x, mTriangle.y - prevR -5), false, "scaling somehow include old radius size even after getting smaller")
		mTriangle.scale(20)
	});
});

describe("Star.contains(x, y)", () => {
	var mStar:Star = new Star(0, 0, 50, 5, 0)

	it("should return a boolean", () => {
		assert.typeOf(mStar.contains(0, 0), "boolean", "contains is not returning a boolean")
	});

	it("point in star test - origin (true)", () => {
		assert.equal(mStar.contains(0, 0), true, "(0, 0) is not in the star")
	});

	it("point in star test - inside (true)", () => {
		assert.equal(mStar.contains(0, -mStar.radius+1), true, "(0, -mStar.radius+1) is not in the star")
	});

	it("point in star test - outside (false)", () => {
		assert.equal(mStar.contains(10000, 10000), false, "(10000, 10000) is somehow in the star")
	});

	it("point in star test - outside (false)", () => {
		assert.equal(mStar.contains(0, -mStar.radius -1), false, "(0, -mStar.radius -1) is somehow in the star")
	});

	it("checking contains after moving (true)", () => {
		mStar.updatePosition(mStar.x + 100, mStar.y)
		assert.equal(mStar.contains(100, 0), true, "after moving right 100, point is not in star")
		mStar.updatePosition(mStar.x - 100, mStar.y)
	});

	it("checking contains after moving (false)", () => {
		mStar.updatePosition(mStar.x + 100, mStar.y)
		assert.equal(mStar.contains(0, 0), false, "after moving right 100, point is in star")
		mStar.updatePosition(mStar.x - 100, mStar.y)
	});

	it("point in star test - rotated inside (false)", () => {
		mStar.rotate(0.5)
		assert.equal(mStar.contains(0, mStar.radius-1), false, "(0, mStar.radius-1) rotated 0.5rads is somehow in the star")
		mStar.rotate(-0.5)
	});

	it("point in star test - rotated inside (true)", () => {
		let angle:number = 0.5
		mStar.rotate(angle)
		assert.equal(mStar.contains(0, 0), true, "rotated but now origin not in star")
		mStar.rotate(-angle)
	});

	it("scaling test - (true)", () => {
		mStar.scale(-20)
		assert.equal(mStar.contains(mStar.x, mStar.y - mStar.radius + 1), true, "scaling doesn't include point slightly inside shape")
		mStar.scale(20)
	});

	it("scaling test - (false)", () => {
		let prevR:number = mStar.radius
		mStar.scale(-20)
		assert.equal(mStar.contains(mStar.x, mStar.y - prevR -5), false, "scaling somehow include old radius size even after getting smaller")
		mStar.scale(20)
	});

});