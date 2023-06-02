// 他の色体系もサポートするなら interface Color を設ける

export type RgbComponent = number;

export class RgbColor {
	public r: RgbComponent;
	public g: RgbComponent;
	public b: RgbComponent;

	constructor(r: RgbComponent, g: RgbComponent, b: RgbComponent) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	map(f: (c: RgbComponent) => RgbComponent): RgbColor {
		return new RgbColor(f(this.r), f(this.g), f(this.b));
	}
	// map<T>(f: (c: RgbComponent) => T): { r: T, g: T, b: T } {
	// 	return { r: f(this.r), g: f(this.g), b: f(this.b) };
	// }

	multiply(k: number) { return this.map(c => k * c); }

	toCssColor() {
		return `rgb(${convertComponent(this.r)}, ${convertComponent(this.g)}, ${convertComponent(this.b)})`;
	}


}

const convertComponent = (c: RgbComponent) => Math.round(c * 255);
