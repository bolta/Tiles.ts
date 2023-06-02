import * as fs from 'fs';
import { promisify } from 'util';
import { exec as exec_ } from 'child_process';
const writeFile = promisify(fs.writeFile);
const exec = promisify(exec_);
import polygonsIntersect from 'polygons-intersect';
import { xy } from './polygon';
import { RandomWalkColorGenerator } from './color/color_generator';
import { lrtb } from './divider/matrix';
import { renderToNewCanvas } from './renderer';
import { composite } from './divider/composite';

const spec = {
	size: xy(800, 600),

	divider: composite([
		lrtb({ x: 200, y: 200 }),
		lrtb({ x:   8, y:   8 }),
	]),
};

const colorGen = new RandomWalkColorGenerator();
const canvas = renderToNewCanvas(spec.size, spec.divider, colorGen);

(async () => {
	await writeFile("image.png", canvas.toBuffer());
	await exec('cmd.exe /c start image.png');
})();

