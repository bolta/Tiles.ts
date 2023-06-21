import { crossingPoint, Line } from './line';
import { polygon, Polygon, Vec2d, xy } from './polygon';

import * as pc from 'polygon-clipping';

export const intersect = (lhs: Polygon, rhs: Polygon): Polygon[] => {
	const toArrays = poly => poly.vertices.map(({ x, y }) => [x, y]);
	const toPolygon = (arrays: number[][]) => polygon(arrays.map(([x, y]) => xy(x, y)));

	let result: pc.MultiPolygon;
	try {
		result = pc.intersection([toArrays(lhs)], [toArrays(rhs)]);
	} catch (e) {
		// TODO intersection がなぜか失敗することがある。
		// エラーはいくつか出るようで、入力が悪いのか、ライブラリの問題なのかよくわかっていない（両方あるかもしれない）。
		// とりあえず続ける
		console.log(JSON.stringify(toArrays(lhs)), JSON.stringify(toArrays(rhs)));
		console.log("*", e);
		result = [];
	}

	return result.map((p: pc.Polygon) => {
		// type pc.Polygon = pc.Ring[]
		// とりあえず先頭のものだけ（あれば）処理する。穴あきには未対応と思われる
		if (p.length === 0) return polygon([]);

		return toPolygon(p[0]);
	})
	.filter(p => p.vertices.length >= 3);
}


const constrain = <T>(value: T, pred: (x: T) => boolean): T | undefined =>
		pred(value) ? value : undefined;


const trace = <T>(x: T) => { console.log(x); return x; };


export type CutResult = {
	/** カット対象図形の外接矩形の左上隅を含む側 */
	left: Polygon[],
	/** カット対象図形の外接矩形の左上隅を含まない側 */
	right: Polygon[],
};

/**
 * poly を line で 2 つに分割する
 * @param poly
 * @param line 
 * @returns 
 */
export const cut = (poly: Polygon, line: Line): CutResult => {
	// 実装上は、poly の外接矩形を line で 2 つの Polygon に分割し、
	// それぞれの Polygon と poly との共通部分を求める
	const rect = poly.circumscribedRect();

	const left = rect.leftTop.x;
	const top = rect.leftTop.y;
	const right = rect.rightBottom.x;
	const bottom = rect.rightBottom.y;

	// rect 各辺と交わるかどうか・どこで交わるかを求める。
	// line は長さが無限だが rect は長さを考慮する。
	// 頂点は一方の辺にだけ属するものとする
	const crossTop = constrain(crossingPoint(line, Line.horizontal(top)),
			p => p !== undefined && left <= p.x && p.x < right);
	const crossRight = constrain(crossingPoint(line, Line.vertical(right)),
			p => p !== undefined && top <= p.y && p.y < bottom);
	const crossBottom = constrain(crossingPoint(line, Line.horizontal(bottom)),
			p => p !== undefined && right >= p.x && p.x > left);
	const crossLeft = constrain(crossingPoint(line, Line.vertical(left)),
			p => p !== undefined && bottom >= p.y && p.y > top);

	const leftTop = () => rect.leftTop;
	const rightTop = () => xy(right, top);
	const rightBottom = () => rect.rightBottom;
	const leftBottom = () => xy(left, bottom);

	// 交点の数が 0（空振り）、1（頂点をかすめる）の場合、分割は発生しない。
	// 2 の場合、どの辺と交わったかで場合分けする。
	// 3 以上の場合はない
	const fragments: Polygon[] | undefined =
			crossTop && crossRight ? [
				polygon([leftTop(), crossTop, crossRight, rightBottom(), leftBottom()]),
				polygon([crossTop, rightTop(), crossRight]),
			] : crossTop && crossBottom ? [
				polygon([leftTop(), crossTop, crossBottom, leftBottom()]),
				polygon([crossTop, rightTop(), rightBottom(), crossBottom]),
			] : crossTop && crossLeft ? [
				polygon([leftTop(), crossTop, crossLeft]),
				polygon([crossTop, rightTop(), rightBottom(), leftBottom(), crossLeft]),
			] : crossRight && crossBottom ? [
				polygon([leftTop(), rightTop(), crossRight, crossBottom, leftBottom()]),
				polygon([crossRight, rightBottom(), crossBottom]),
			] : crossRight && crossLeft ? [
				polygon([leftTop(), rightTop(), crossRight, crossLeft]),
				polygon([crossLeft, crossRight, rightBottom(), leftBottom()]),
			] : crossBottom && crossLeft ? [
				polygon([leftTop(), rightTop(), rightBottom(), crossBottom, crossLeft]),
				polygon([crossLeft, crossBottom, leftBottom()]),
			] : undefined;

	return fragments ? {
		left: intersect(poly, fragments[0]),
		right: intersect(poly, fragments[1]),
	} : {
		left: [poly],
		right: [],
	};
};
