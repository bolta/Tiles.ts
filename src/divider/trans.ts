import { intersect } from "../clip";
import { Polygon, Rect, xy } from "../geom/polygon";
import { Divider } from "./divider";

export const rotate = ({
	th,
	source,
}: {
	th: number,
	source: Divider,
}) => (poly: Polygon) => {
	// TODO center を指定できるようにする
	const center = poly.circumscribedRect().center();

	const expandedOuterRect = poly.rotate(-th, center).circumscribedRect();
	const originalOuterRect = poly.circumscribedRect();

	const mergedLeft = Math.min(expandedOuterRect.left(), originalOuterRect.left());
	const mergedTop = Math.min(expandedOuterRect.top(), originalOuterRect.top());
	const mergedRight = Math.max(expandedOuterRect.right(), originalOuterRect.right());
	const mergedBottom = Math.max(expandedOuterRect.bottom(), originalOuterRect.bottom());

	const mergedOuterRect = Polygon.rect(xy(mergedLeft, mergedTop), xy(mergedRight, mergedBottom));

	return source(mergedOuterRect)
			.map(p => p.rotate(th, center))
			.concatMap(p => intersect(p, poly));
};
