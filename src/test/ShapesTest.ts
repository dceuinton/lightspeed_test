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
});

describe("Triangle.contains(x,y)", () => {
	var mTriangle:Triangle = new Triangle(0, 0, 50, 0)

	it("should return a boolean", () => {
		assert.typeOf(mTriangle.contains(0, 0), "boolean", "contains is not returning a boolean")
	});

	it("point in triangle test - origin (true)", () => {
		assert.equal(mTriangle.contains(0, 0), true, "(0, 0) is not in the triangle")
	})

	it("point in triangle test - inside (true)", () => {
		assert.equal(mTriangle.contains(0, -mTriangle.radius+1), true, "(0, -mTriangle.radius+1) is not in the triangle")
	})

	it("point in triangle test - rotated inside (false)", () => {
		mTriangle.rotate(0.5)
		assert.equal(mTriangle.contains(0, mTriangle.radius-1), false, "(0, mTriangle.radius-1) rotated 0.5rads is somehow in the triangle")
		mTriangle.rotate(-0.5)
	})	

	it("point in triangle test - outside (false)", () => {
		assert.equal(mTriangle.contains(10000, 10000), false, "(10000, 10000) is somehow in the triangle")
	});

	it("point in triangle test - outside (false)", () => {
		assert.equal(mTriangle.contains(0, -mTriangle.radius -1), false, "(0, -mTriangle.radius -1) is somehow in the triangle")
	});
});

describe("Star.contains(x, y)", () => {
	var mStar:Star = new Star(0, 0, 50, 5, 0)

	it("should return a boolean", () => {
		assert.typeOf(mStar.contains(0, 0), "boolean", "contains is not returning a boolean")
	});

	it("point in star test - origin (true)", () => {
		assert.equal(mStar.contains(0, 0), true, "(0, 0) is not in the star")
	})

	it("point in star test - inside (true)", () => {
		assert.equal(mStar.contains(0, -mStar.radius+1), true, "(0, -mStar.radius+1) is not in the star")
	})

	it("point in star test - rotated inside (false)", () => {
		mStar.rotate(0.5)
		assert.equal(mStar.contains(0, mStar.radius-1), false, "(0, mStar.radius-1) rotated 0.5rads is somehow in the star")
		mStar.rotate(-0.5)
	})	

	it("point in star test - outside (false)", () => {
		assert.equal(mStar.contains(10000, 10000), false, "(10000, 10000) is somehow in the star")
	});

	it("point in star test - outside (false)", () => {
		assert.equal(mStar.contains(0, -mStar.radius -1), false, "(0, -mStar.radius -1) is somehow in the star")
	});
});