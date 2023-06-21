import { Vec2d, xy } from "./polygon";

export class Line {
	a: number;
	b: number;
	c: number;

	constructor({a, b, c}: { a: number, b: number, c: number }) {
		this.a = a;
		this.b = b;
		this.c = c;
	}
	static horizontal(y: number) { return new Line({ a: 0, b: 1, c: -y }); }
	static vertical(x: number) { return new Line({ a: 1, b: 0, c: -x }); }
	static byPassingPoints(p1: Vec2d, p2: Vec2d) {
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;

		return new Line({
			a: dy,
			b: -dx,
			c: -dy * p1.x + dx * p1.y,
		});
	}
};

/**
 * 2 直線（ax + by + c = 0）の交点を求める。交点がない場合と、2 直線が一致する場合は undefined を返す
 * @param l1 
 * @param l2 
 * @returns 
 */
export const crossingPoint = (l1: Line, l2: Line): Vec2d | undefined => {
	const denom = l1.a * l2.b - l2.a * l1.b;
	if (denom === 0) return undefined;

	const result = xy((l1.b * l2.c - l2.b * l1.c) / denom, (l2.a * l1.c - l1.a * l2.c) / denom);
	// console.log(result);
	return result;
};

