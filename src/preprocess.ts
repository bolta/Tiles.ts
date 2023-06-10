import * as fs from 'fs';
import { Seq } from 'lazy-sequences'
import * as uuid from 'uuid';

const rawSrc = process.argv[2];
const tilesSrcDir = process.argv[3];
if (! rawSrc || ! tilesSrcDir) throw 'specify a file to preprocess and a path to tiles src/ dir';

const srcLines = new Seq(fs.readFileSync(rawSrc, 'utf-8').split('\n'));

const destLines = srcLines.map(line => line.trim().startsWith('import')
		? line.replace(/(['"])\.\.\/src/, `$1${tilesSrcDir}`)
		: line.replace(/\$seed/, `{ seed: '${uuid.v4()}' }`));

for (const line of destLines) {
	console.log(line);
}
