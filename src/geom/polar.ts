import { Vec2d, xy } from "../polygon";

export class Polar2d {
	public r: number;
	public th: number;

	constructor(r: number, th: number) {
		this.r = r;
		this.th = th;
	}

	static fromCartesian(point: Vec2d, origin: Vec2d = xy(0, 0)) {
		const diff = point.subtract(origin);
		if (diff.equals(xy(0, 0))) return rth(0, 0);

		return rth(Math.sqrt(diff.x * diff.x + diff.y * diff.y),
				Math.atan2(diff.y, diff.x));
	}

	toCartesian(origin: Vec2d = xy(0, 0)) {
		return xy(origin.x + this.r * Math.cos(this.th),
				origin.y + this.r * Math.sin(this.th));
	}
}

export const rth = (r: number, th: number) => new Polar2d(r, th);
