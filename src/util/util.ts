/**
 * 根据给定的范围 [start, end) 和步长 step 创建一个纯数值数组，注意这个范围是前闭后开区间，步长默认值是 1
 */
export function range(start : number, end : number, step : number = 1): number[] {
    let arr : number[] = [];
    for (let i = start; i < end; i += step) {
        arr.push(i);
    }
    return arr;
}
