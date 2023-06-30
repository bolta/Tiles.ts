import { RgbColor } from './rgb_color';
import { limit } from '../common';
import seedrandom, { PRNG } from 'seedrandom';


export interface ColorGenerator {
	nextColor(): RgbColor;
}

export type RgbColorPredicate = (c: RgbColor) => boolean;
export type ColorMapping = (c: RgbColor) => RgbColor;

export class RandomWalkColorGenerator implements ColorGenerator {
	private rng: PRNG;
	private maxStepSize: number;
	private stepTimes: number;
	private constraint: RgbColorPredicate;
	private effect: ColorMapping;
	private current: RgbColor;

	constructor({
		seed,
		maxStepSize = 0.02,
		stepTimes = 1,
		constraint = _ => true,
		effect = c => c,
	}: {
		seed: string,
		maxStepSize?: number,
		stepTimes?: number,
		constraint?: RgbColorPredicate,
		effect?: ColorMapping,
	}) {
		this.rng = seedrandom(seed);
		this.maxStepSize = maxStepSize;
		this.stepTimes = stepTimes;
		this.constraint = constraint;
		this.effect = effect;
		this.current = this.makeColorInConstraint(() => this.initialColor());
	}
	private initialColor(): RgbColor {
		return new RgbColor(this.rng(), this.rng(), this.rng());
	}

	nextColor(): RgbColor {
		const result = this.current;
		for (let i = 0; i < this.stepTimes; ++i) {
			this.current = this.makeColorInConstraint(() =>
					this.current.map(c => limit(0, c + this.rng() * this.maxStepSize - this.maxStepSize / 2, 1)));
		}

		return this.effect(result);
	}

	/**
	 * コールバックが生成した色が制約を満たすまで生成を繰り返す
	 * @param makeColor 色を生成するコールバック。実行のたびに（乱数などで）結果が変わるものであること
	 * @returns 
	 */
	private makeColorInConstraint(makeColor: () => RgbColor): RgbColor {
		while (true) {
			const c = makeColor();
			if (this.constraint(c)) return c;
		}
	}
}

