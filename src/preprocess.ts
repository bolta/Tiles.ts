import * as fs from 'fs';
import Seq from 'lazy-sequences';
import * as uuid from 'uuid';
import * as path from 'path';
import moment from 'moment';

const tilesSrcDir = path.resolve(path.dirname(process.argv[1]));

// Windows でも / を使う
const relativePathWithSlashes = (from, to) => path.relative(from, to).replace(/\\/g, '/');

// このコメントがソースファイルの先頭にあるときのみ処理済と見なす
const PREPROCESSED_MARKER = '// PREPROCESSED';

/**
 * srcPath のファイルが前処理されていない場合、前処理して処理後のパスを返す。
 * すでに前処理されている場合は null を返す
 */
export const preprocess = (srcPath) => {
	const srcContent = fs.readFileSync(srcPath, 'utf-8');
	if (srcContent.includes(PREPROCESSED_MARKER)) return null;

	const srcLines = new Seq(srcContent.split('\n'));
	const { name: srcName, ext: srcExt } = path.parse(srcPath);
	const destDir = path.join(tilesSrcDir, '..', 'atelier', srcName);

	const destLines =
			new Seq([PREPROCESSED_MARKER])
			.concat(srcLines.map(line => line.trim().startsWith('import')
					? line.replace(/(['"])\.\.\/src\//, `$1${relativePathWithSlashes(destDir, tilesSrcDir)}/`)
					: line.replace(/\$seed/, `{ seed: '${uuid.v4()}' }`)));
	const destContent = destLines.map(line => `${line}\n`).collect().join('');

	const timestampRun = moment().format('YYYYMMDD_HHmmss');
	const destPath = path.join(destDir, `${srcName}.${timestampRun}${srcExt}`);

	fs.mkdirSync(destDir, { recursive: true });
	fs.writeFileSync(destPath, destContent, { flag: 'wx' });

	return destPath;
};

