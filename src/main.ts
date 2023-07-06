import * as fs from 'fs';
import { promisify } from 'util';
import { exec as exec_ } from 'child_process';
const writeFile = promisify(fs.writeFile);
const exec = promisify(exec_);
import { renderToNewCanvas } from './renderer';
import { Spec } from './spec';
import { preprocess } from './preprocess';

(async () => {
	// 絶対パスにしないと解決されない場合あり
	const srcPath = fs.realpathSync(process.argv[2]);
	const inPath = preprocess(srcPath) ?? srcPath;
	const spec: Spec = (await import(inPath)).spec;
	const outPath = inPath.replace(/\.[^.]*$/, '.png');
	if (fs.existsSync(outPath)) {
		console.log(`${outPath} already exists.`);
	} else {
		const canvas = renderToNewCanvas(spec.size, spec.divider, spec.colors);
		await writeFile(outPath, canvas.toBuffer());
	}
	await exec(`cmd.exe /c start ${outPath}`);
})();
