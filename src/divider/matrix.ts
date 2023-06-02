import { Polygon, Rect, Vec2d, xy } from '../polygon';

import _ from 'lodash';

type Index2d = { x: number, y: number };

// private infix fun Double.divByTiles(tileLen: Double) = ((this - 1) / tileLen).toInt() + 1
const divByTiles = (wholeLen: number, tileLen:number) => Math.floor(((wholeLen - 1) / tileLen)) + 1;


export const lrtb = (tileSize: Vec2d) => (parent: Polygon) => {
	const rect = parent.circumscribedRect();
	const tileCountX = divByTiles(rect.rightBottom.x - rect.leftTop.x, tileSize.x);
	const tileCountY = divByTiles(rect.rightBottom.y - rect.leftTop.y, tileSize.y);

	return _.range(0, tileCountY).flatMap(idxY => _.range(0, tileCountX).map(idxX => ({ idxX, idxY })))
			.map(({ idxX, idxY }) => Polygon.rect(
					xy(rect.leftTop.x + idxX * tileSize.x, rect.leftTop.y + idxY * tileSize.y),
					xy(rect.leftTop.x + idxX * tileSize.x + tileSize.x, rect.leftTop.y + idxY * tileSize.y + tileSize.y)));
}
