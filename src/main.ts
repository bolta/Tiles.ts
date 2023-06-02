import _ from 'lodash';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec as exec_ } from 'child_process';
const writeFile = promisify(fs.writeFile);
const exec = promisify(exec_);
import polygonsIntersect from 'polygons-intersect';
import { Polygon, polygon, Vec2d, xy } from './polygon';
import { RandomWalkColorGenerator } from './color/color_generator';
import { lrtb } from './divider/matrix';
import { Divider } from './divider/divider';

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

const composite: (dividers: Divider[]) => Divider = dividers =>
		// TODO 親をはみ出さないよう clip する
		dividers.reduce((accum, div) => (poly: Polygon) => accum(poly).concatMap(div));

const spec = {
	size: xy(800, 600),

	divider: composite([
		lrtb({ x: 200, y: 200 }),
		lrtb({ x:   8, y:   8 }),
	]),
};

const canvas = createCanvas(spec.size.x, spec.size.y);
const ctx = canvas.getContext("2d");
ctx.lineWidth = 1;

const tileSize = { x: 8, y: 8 };

const colorGen = new RandomWalkColorGenerator();

const canvasPolygon = Polygon.rect(xy(0, 0), spec.size);
const tiles = spec.divider(canvasPolygon);
// TODO collect せずに回したい
tiles.collect().forEach(tile => {
	const col = colorGen.nextColor();
	ctx.fillStyle = col.toCssColor();
	ctx.strokeStyle = col.multiply(.8).toCssColor();
	fillPolygon(ctx, tile);
});


(async () => {
	await writeFile("image.png", canvas.toBuffer());
	await exec('cmd.exe /c start image.png');
})();

