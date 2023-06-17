import { polygon, Polygon, xy } from './polygon';

import * as pc from 'polygon-clipping';

export const intersect = (lhs: Polygon, rhs: Polygon): Polygon[] => {
	const toArrays = poly => poly.vertices.map(({ x, y }) => [x, y]);
	const toPolygon = (arrays: number[][]) => polygon(arrays.map(([x, y]) => xy(x, y)));

	const result: pc.MultiPolygon = pc.intersection([toArrays(lhs)], [toArrays(rhs)]);

	return result.map((p: pc.Polygon) => {
		// type pc.Polygon = pc.Ring[]
		// とりあえず先頭のものだけ（あれば）処理する。穴あきには未対応と思われる
		if (p.length === 0) return polygon([]);

		return toPolygon(p[0]);
	})
	.filter(p => p.vertices.length >= 3);
}

