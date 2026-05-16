/**
 * 转换操作符 — 对数据流中的值进行变换
 * map, mapTo, pluck (deprecated), buffer, bufferTime, bufferCount, window
 */

import { of, interval, timer } from 'rxjs';
import { map, mapTo, buffer, bufferTime, bufferCount, window, mergeAll } from 'rxjs/operators';

// ---- map — 对每个值映射转换 ----
console.log('--- map ---');
of(1, 2, 3).pipe(
  map(x => x * 10)
).subscribe(v => console.log('map:', v));
// map: 10 → 20 → 30

// 链式 map
of(1, 2, 3).pipe(
  map(x => x + 1),
  map(x => x * 2)
).subscribe(v => console.log('chained map:', v));
// chained map: 4 → 6 → 8

// ---- mapTo — 将每个值映射为固定值 ----
console.log('--- mapTo ---');
of(1, 2, 3).pipe(
  mapTo('constant')
).subscribe(v => console.log('mapTo:', v));
// mapTo: constant → constant → constant

// ---- buffer — 缓冲值直到 notifier 发出信号 ----
console.log('--- buffer ---');
const source$ = interval(200);       // 每200ms发一个值
const notifier$ = interval(600);     // 每600ms发出缓冲信号
source$.pipe(
  buffer(notifier$),
).subscribe(v => console.log('buffer:', v));
// buffer: [0,1] → [2,3,4] → [5,6,7] → ...
// 每隔600ms收集在此期间的所有值到数组中

// ---- bufferTime — 按时间窗口缓冲 ----
console.log('--- bufferTime ---');
interval(100).pipe(
  bufferTime(350)
).subscribe(v => console.log('bufferTime:', v));
// 每350ms收集一次: [0,1,2] → [3,4,5] → ...

// ---- bufferCount — 按数量缓冲 ----
console.log('--- bufferCount ---');
of(1, 2, 3, 4, 5, 6).pipe(
  bufferCount(2)  // 每2个为一组
).subscribe(v => console.log('bufferCount:', v));
// bufferCount: [1,2] → [3,4] → [5,6]

// ---- window — 类似 buffer 但发出子 Observable 而不是数组 ----
console.log('--- window ---');
interval(100).pipe(
  window(timer(0, 300)),
  mergeAll()  // 展平内部 Observable
).subscribe(v => console.log('window:', v));
// window: 0 → 1 → 2 ...
