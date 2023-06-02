import { RgbColor } from './rgb_color';
import { limit } from '../common';

export interface ColorGenerator {
	nextColor(): RgbColor;
}

export class RandomWalkColorGenerator implements ColorGenerator {

	current: RgbColor; // = new RgbColor(Math.random(), Math.random(), Math.random());

	constructor() {
		// TODO 乱数生成器をフィールドに持つ
		this.current = new RgbColor(Math.random(), Math.random(), Math.random());
	}

	nextColor(): RgbColor {
		this.current = this.current.map(c => limit(0, c + Math.random() * 0.1 - 0.05, 1));

		return this.current;
	}
}
