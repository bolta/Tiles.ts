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
		this.initialize();
	}

	initialize(): void {
		this.current = new RgbColor(this.rng(), this.rng(), this.rng());
	}

	nextColor(): RgbColor {
		this.current = this.current.map(c => limit(0, c + this.rng() * 0.1 - 0.05, 1));

		return this.current;
	}
}
