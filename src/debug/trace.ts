const trace = <T>(x: T) => trace2(x, x);
const trace2 = <T>(x: T, y: any) => { console.log(y); return x; };
