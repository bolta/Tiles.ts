import { RgbColor } from './rgb_color';
import { limit } from '../common';
import seedrandom, { PRNG } from 'seedrandom';


export interface ColorGenerator {
	initialize(): void;
	nextColor(): RgbColor;
}

export class RandomWalkColorGenerator implements ColorGenerator {
	rng: PRNG;
	current: RgbColor;

	constructor(params: { seed: string }) {
		this.rng = seedrandom(params.seed);
		this.current = this.initialColor();
		console.log(this.current);
	}
	private initialColor(): RgbColor {
		return new RgbColor(this.rng(), this.rng(), this.rng());
	}

	initialize(): void {
		this.current = this.initialColor();
	}

	nextColor(): RgbColor {
		this.current = this.current.map(c => limit(0, c + this.rng() * 0.1 - 0.05, 1));

		return this.current;
	}
}
