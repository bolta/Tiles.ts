export class Vec2d {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(that: Vec2d) { return xy(this.x + that.x, this.y + that.y); }
	subtract(that: Vec2d) { return xy(this.x - that.x, this.y - that.y); }
	multiply(k: number) { return xy(k * this.x, k * this.y); }
	equals(that: Vec2d) { return this.x === that.x && this.y === that.y; }
	/** center の周りを（下向きが正のため、時計回りに）angle ラジアン回す */
	rotate(th: number, center: Vec2d = xy(0, 0)) {
		const c = Math.cos(th);
		const s = Math.sin(th);
		const { x, y } = this.subtract(center);

		return xy(x * c - y * s, x * s + y * c).add(center);
	}
}

export const xy = (x: number, y: number) => new Vec2d(x, y);

// export type Rect = {
// 	leftTop: Vec2d,
// 	rightBottom: Vec2d,
// };
export class Rect {
	public leftTop: Vec2d;
	public rightBottom: Vec2d;

	constructor(leftTop: Vec2d, rightBottom: Vec2d) {
		this.leftTop = leftTop;
		this.rightBottom = rightBottom;
	}

	left() { return this.leftTop.x; }
	top() { return this.leftTop.y; }
	right() { return this.rightBottom.x; }
	bottom() { return this.rightBottom.y; }

	center() {
		return xy((this.left() + this.right()) / 2, (this.top() + this.bottom()) / 2);
	}
}

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
		const rect = this.vertices.reduce((ltrb, v) => ({
			leftTop: xy(Math.min(ltrb.leftTop.x, v.x), Math.min(ltrb.leftTop.y, v.y)),
			rightBottom: xy(Math.max(ltrb.rightBottom.x, v.x), Math.max(ltrb.rightBottom.y, v.y)),
		}), init);

		return new Rect(rect.leftTop, rect.rightBottom);
	}

	rotate(th: number, center: Vec2d): Polygon {
		return polygon(this.vertices.map(v => v.rotate(th, center)));
	}
}

export const polygon = (vertices: Vec2d[]) => new Polygon(vertices);
