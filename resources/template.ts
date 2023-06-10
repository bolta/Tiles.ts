import polygonsIntersect from 'polygons-intersect';
import { xy } from '../src/polygon';
import { RandomWalkColorGenerator } from '../src/color/color_generator';
import { lrtb } from '../src/divider/matrix';
import { composite } from '../src/divider/composite';
import { Spec } from '../src/spec';
import { $seed } from '../src/placeholder';

export const spec: Spec = {
	size: xy(800, 600),

	divider: composite([
		lrtb(xy(200, 200)),
		lrtb(xy(  8,   8)),
	]),

	colors: new RandomWalkColorGenerator({ ...$seed }),
};
