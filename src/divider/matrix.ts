import { Polygon, Rect, Vec2d, xy } from '../polygon';
import { generate, range } from '../common';

import * as _ from 'lodash';
import { Seq } from 'lazy-sequences';
import seedrandom from 'seedrandom';

type Index2d = { ix: number, iy: number };

const divByTiles = (wholeLen: number, tileLen:number) => Math.floor(((wholeLen - 1) / tileLen)) + 1;

export const lrtb = ({
	tileSize,
}: {
	tileSize: Vec2d,
}) => matrix({
	tileSize,
	arrangeTiles: arrangeLrtb,
	makeTile: makeRectTile,
});

export const scatter = ({
	tileSize,
	seed,
}: {
	tileSize: Vec2d,
	seed: string,
}) => {
	const rng = seedrandom(seed);

	// メモ：波打たせる
	// const rng_ = seedrandom(seed);
	// const rng = () => {
	// 	const r = rng_();
	// 	if (r <= 0.5) return r;
	// 	const r1 = rng_();
	// 	if (r1 < 1 + 0.5 * Math.sin(2 * Math.PI * r)) {
	// 		return r;
	// 	} else {
	// 		return 1 - r;
	// 	}
	// };

	return matrix({
		tileSize,
		arrangeTiles: ({ ix: sizeX, iy: sizeY }) => {
			const nextYs: number[] = Array(sizeX).fill(sizeY - 1);
			let countDone = 0;

			return generate(() => {
				if (countDone >= sizeX * sizeY) return undefined;
				const ix = Math.floor(rng() * sizeX);
				const iy = nextYs[ix];
				if (nextYs[ix] >= 0) {
					-- nextYs[ix];
					++ countDone;
				}
				return { ix, iy };
			})
			.filter(({ iy }) => iy >= 0);
		},
		makeTile: makeRectTile,
	});
}


const matrix = ({
	tileSize,
	arrangeTiles,
	makeTile,
}: {
	tileSize: Vec2d,
	arrangeTiles: (size: Index2d) => Seq<Index2d>,
	makeTile: (rect: Rect, tileSize: Vec2d, index: Index2d) => Polygon,
}) => (parent: Polygon) => {
	const rect = parent.circumscribedRect();
	const tileCountXy = {
		ix: divByTiles(rect.rightBottom.x - rect.leftTop.x, tileSize.x),
		iy: divByTiles(rect.rightBottom.y - rect.leftTop.y, tileSize.y),
	};
	const idxXys = arrangeTiles(tileCountXy);

	return idxXys.map(index => makeTile(rect, tileSize, index));
}

const arrangeLrtb = (size: Index2d) => range(0, size.iy).concatMap(iy =>
	range(0, size.ix).map(ix =>
		({ ix, iy })
	)
);

const makeRectTile = (rect: Rect, tileSize: Vec2d, { ix, iy }: Index2d) => Polygon.rect(
		xy(rect.leftTop.x + ix * tileSize.x, rect.leftTop.y + iy * tileSize.y),
		xy(rect.leftTop.x + ix * tileSize.x + tileSize.x, rect.leftTop.y + iy * tileSize.y + tileSize.y));

