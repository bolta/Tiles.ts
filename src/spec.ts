import { ColorGenerator } from "./color/color_generator";
import { Divider } from "./divider/divider";
import { Vec2d } from "./geom/polygon";

export type Spec = {
	size: Vec2d,
	divider: Divider,
	colors: ColorGenerator,
};
