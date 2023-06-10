import polygonsIntersect from 'polygons-intersect';
import { xy } from '../../src/polygon';
import { RandomWalkColorGenerator } from '../../src/color/color_generator';
import { lrtb, scatter } from '../../src/divider/matrix';
import { composite } from '../../src/divider/composite';
import { Spec } from '../../src/spec';
import { $seed } from '../../src/placeholder';

export const spec: Spec = {
	size: xy(800, 600),

	divider: composite([
//		lrtb({ tileSize: xy(200, 200) }),
		scatter({
			tileSize: xy(  4,   4),
			...$seed,
		}),
	]),

	// colors: new RandomWalkColorGenerator({ ...{ seed: '8454819a-3325-49a3-a453-a4e2c92f4999' } }),
	colors: new RandomWalkColorGenerator({ seed: 'a4a6023a-0a16-416f-a747-40fcbb312855' }),
};

