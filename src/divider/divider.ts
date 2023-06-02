import { Polygon } from '../polygon';

import { Seq } from 'lazy-sequences';

export type Divider = (Polygon) => Seq<Polygon>;
