import { intersect } from "../clip";
import { Polygon } from "../polygon";
import { Divider } from "./divider";

export const composite: (dividers: Divider[]) => Divider =
		dividers => dividers.reduce((accum, div) =>
				(poly: Polygon) =>
						accum(poly)
						.concatMap((parent: Polygon) => div(parent).concatMap(child => intersect(child, parent))));
