export class Vec2d {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(that: Vec2d) { return xy(this.x + that.x, this.y + that.y); }
	subtract(that: Vec2d) { return xy(this.x - that.x, this.y - that.y); }
	equals(that: Vec2d) { return this.x === that.x && this.y === that.y; }
}

export const xy = (x: number, y: number) => new Vec2d(x, y);

export type Rect = {
	leftTop: Vec2d,
	rightBottom: Vec2d,
};

export class Polygon {
	/**
	 * 多角形を形成する全ての頂点。
	 * 始点と終点は一致しなくてもよい（n 角形であれば要素は n つ）
	 */
	vertices: Vec2d[];

	constructor(vertices: Vec2d[]) {
		// TODO length === 0 の場合（1, 2 も？）エラーにする
		this.vertices = vertices;
	}

	static rect(leftTop: Vec2d, rightBottom: Vec2d): Polygon {
		return new Polygon([
			xy(leftTop.x, leftTop.y),
			xy(rightBottom.x, leftTop.y),
			xy(rightBottom.x, rightBottom.y),
			xy(leftTop.x, rightBottom.y),
		]);
	}

	// vertices(): Vec2d[] {
	// 	// 簡単のため防御的コピーは行わない
	// 	return this.vertices_;
	// }

	circumscribedRect(): Rect {
		const init = {
			leftTop: xy(Infinity, Infinity),
			rightBottom: xy(-Infinity, -Infinity),
		};
		return this.vertices.reduce((ltrb, v) => ({
			leftTop: xy(Math.min(ltrb.leftTop.x, v.x), Math.min(ltrb.leftTop.y, v.y)),
			rightBottom: xy(Math.max(ltrb.rightBottom.x, v.x), Math.max(ltrb.rightBottom.y, v.y)),
		}), init);
	}
}

export const polygon = (vertices: Vec2d[]) => new Polygon(vertices);
