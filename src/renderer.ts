import { CanvasRenderingContext2D, createCanvas } from "canvas";
import { ColorGenerator } from "./color/color_generator";
import { Divider } from "./divider/divider";
import { Polygon, polygon, Vec2d, xy } from "./polygon";
import * as _ from 'lodash';

import {
	Polygon as CPolygon,
	intersection,
	MultiPolygon,
} from 'polygon-clipping';

const intersect = (lhs: Polygon, rhs: Polygon): Polygon[] => {
	const toArrays = poly => poly.vertices.map(({ x, y }) => [x, y]);
	const toPolygon = (arrays: number[][]) => polygon(arrays.map(([x, y]) => xy(x, y)));

	const result: MultiPolygon = intersection([toArrays(lhs)], [toArrays(rhs)]);

	return result.map((p: CPolygon) => {
		// type CPolygon = Ring[]
		// とりあえず先頭のものだけ（あれば）処理する。穴あきには未対応と思われる
		if (p.length === 0) return polygon([]);

		return toPolygon(p[0]);
	});
}


const fillPolygon = (ctx: CanvasRenderingContext2D, p: Polygon) => {
	const vs = p.vertices;
	if (vs.length === 0) return;

	ctx.beginPath();
	ctx.moveTo(vs[0].x, vs[0].y);
	_.tail(vs).forEach(v => { ctx.lineTo(v.x, v.y); });
	// path.lineTo(p[0].x, p[0].y); // 不要みたい
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};

export const renderToNewCanvas = (size: Vec2d, divider: Divider, colorGen: ColorGenerator) => {
	const canvas = createCanvas(size.x, size.y);
	const ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	const canvasPolygon = Polygon.rect(xy(0, 0), size);

	// const tiles = divider(canvasPolygon);

	// 切り抜き実験
	const clip = new Polygon([xy(400, 100), xy(100, 500), xy(700, 500)]);
	const tiles = divider(canvasPolygon)
			.concatMap(tile => intersect(tile, clip))
			.filter(tile => tile.vertices.length >= 3);

	// TODO collect せずに回したい
	tiles.collect().forEach(tile => {
		const col = colorGen.nextColor();
		ctx.fillStyle = col.toCssColor();
		ctx.strokeStyle = col.multiply(.8).toCssColor();
		fillPolygon(ctx, tile);
	});

	return canvas;
};
