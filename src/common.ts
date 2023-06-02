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
