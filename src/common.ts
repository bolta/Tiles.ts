import { Seq } from 'lazy-sequences';

export const limit = (min: number, val: number, max: number) => Math.min(Math.max(min, val), max);

/**
 * 始点・終点（含まない）を指定して Seq を生成する
 * （Seq.fromRange が終点を含んでいて使いにくそうなので）
 * @param start 
 * @param end 
 * @returns 
 */
export const range = (start: number, end: number) => start < end
		? Seq.fromRange(start, end - 1)
		: Seq.empty<number>();

/**
 * next() が undefined を返すまで呼び出し続ける Seq を生成する。
 * undefined は結果に含まれない。
 * T は undefined であってはならない
 * @param next
 * @returns 
 */
export const generate = <T>(next: () => T | undefined): Seq<T> =>
		Seq.iterate(next, undefined)
		.drop(1)
		.takeWhile(e => e !== undefined) as Seq<T>;
