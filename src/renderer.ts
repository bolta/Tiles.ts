import { CanvasRenderingContext2D, createCanvas } from "canvas";
import { ColorGenerator } from "./color/color_generator";
import { Divider } from "./divider/divider";
import { Polygon, polygon, Vec2d, xy } from "./geom/polygon";
import * as _ from 'lodash';

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

	const tiles = divider(canvasPolygon);

	// TODO collect せずに回したい
	tiles.collect().forEach(tile => {
		const col = colorGen.nextColor();
		ctx.fillStyle = col.toCssColor();
		ctx.strokeStyle = col.multiply(.8).toCssColor();
		fillPolygon(ctx, tile);
	});

	return canvas;
};
