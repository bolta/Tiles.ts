import Seq from "lazy-sequences";
import { cut as cut_ } from "../clip";
import { Line } from "../line";
import { Polygon } from "../polygon";

export const cut = ({ line } : {line: Line }) => (poly: Polygon) => {
	const children = cut_(poly, line);
	// return children.left.concat(children.right);
	return new Seq(children.left).concat(children.right);
};
