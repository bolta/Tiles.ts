import * as fs from 'fs';
import { promisify } from 'util';
import { exec as exec_ } from 'child_process';
const writeFile = promisify(fs.writeFile);
const exec = promisify(exec_);
import { renderToNewCanvas } from './renderer';
import { Spec } from './spec';

(async () => {
	// 絶対パスにしないと解決されない場合あり
	const path = fs.realpathSync(process.argv[2]);
	const spec: Spec = (await import(path)).spec;

	const canvas = renderToNewCanvas(spec.size, spec.divider, spec.colors);

	const outPath = path.replace(/\.[^.]*$/, '.png');
	if (fs.existsSync(outPath)) {
		console.log(`${outPath} already exists.`);
	} else {
		await writeFile(outPath, canvas.toBuffer());
	}
	await exec(`cmd.exe /c start ${outPath}`);
})();

