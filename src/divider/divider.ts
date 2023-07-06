import { Polygon } from '../geom/polygon';

import { Seq } from 'lazy-sequences';

export type Divider = (Polygon) => Seq<Polygon>;
