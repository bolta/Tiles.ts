import { Polygon } from "../polygon";
import { Divider } from "./divider";

export const composite: (dividers: Divider[]) => Divider =
		// TODO 親をはみ出さないよう clip する
		dividers => dividers.reduce((accum, div) => (poly: Polygon) => accum(poly).concatMap(div));
