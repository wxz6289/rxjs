/**
 * 组合操作符 — 合并多个数据流
 * merge, concat, combineLatest, forkJoin, race, zip, startWith, withLatestFrom
 */

import { of, interval, timer, merge, concat, combineLatest, forkJoin, race, zip } from 'rxjs';
import { map, startWith, withLatestFrom, take } from 'rxjs/operators';

// ---- merge — 并发合并多个流 (并行) ----
console.log('--- merge ---');
const fast$ = timer(0, 1000).pipe(take(3), map(x => `A${x}`));
const slow$ = timer(500, 1000).pipe(take(3), map(x => `B${x}`));
merge(fast$, slow$).subscribe(v => console.log('merge:', v));
// merge: A0 → B0(500ms) → A1(1s) → B1(1.5s) → A2(2s) → B2(2.5s)
// 按实际到达时间交错

// ---- concat — 顺序合并 (等待前一个完成) ----
console.log('--- concat ---');
const s1$ = of(1, 2, 3);
const s2$ = of('a', 'b');
concat(s1$, s2$).subscribe(v => console.log('concat:', v));
// concat: 1 → 2 → 3 → a → b (s1$ 完成才执行 s2$)

// ---- combineLatest — 任意源发出都取各源最新值组合 ----
console.log('--- combineLatest ---');
const a$ = interval(1000).pipe(take(3), map(x => `A${x}`));
const b$ = interval(1500).pipe(take(3), map(x => `B${x}`));
combineLatest([a$, b$]).subscribe(v => console.log('combineLatest:', v));
// combineLatest: ['A1','B0'] → ['A2','B0'] → ['A2','B1'] → ...

// ---- forkJoin — 等所有源完成，发出最后一次值的数组 ----
console.log('--- forkJoin ---');
forkJoin({
  users: of(['Alice', 'Bob']),
  posts: of([{ id: 1 }, { id: 2 }]),
}).subscribe(result => console.log('forkJoin:', result));
// forkJoin: { users: ['Alice','Bob'], posts: [{id:1},{id:2}] }

// ---- race — 竞态，取最先发出的流，忽略其余 ----
console.log('--- race ---');
race(
  timer(200).pipe(map(() => 'fast')),
  timer(500).pipe(map(() => 'slow')),
).subscribe(v => console.log('race:', v));
// race: fast (慢的那个被忽略)

// ---- zip — 按位置配对 ----
console.log('--- zip ---');
zip(
  of(1, 2, 3),
  of('a', 'b', 'c'),
).subscribe(v => console.log('zip:', v));
// zip: [1,'a'] → [2,'b'] → [3,'c']

// ---- startWith — 在流开始前插入初始值 ----
console.log('--- startWith ---');
of(2, 3).pipe(
  startWith(1)
).subscribe(v => console.log('startWith:', v));
// startWith: 1 → 2 → 3

// ---- withLatestFrom — 取自己的值 + 另一个流的最新值 ----
console.log('--- withLatestFrom ---');
const trigger$ = interval(1000).pipe(take(3));
const state$ = interval(300).pipe(take(10));
trigger$.pipe(
  withLatestFrom(state$)
).subscribe(v => console.log('withLatestFrom:', v));
// 每1s输出: [trigger_n, 当时state$的最新值]
