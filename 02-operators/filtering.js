/**
 * 过滤操作符 — 选择性通过或丢弃值
 * filter, take, takeUntil, takeWhile, skip, skipUntil, first, last
 */

import { of, interval, timer } from 'rxjs';
import { filter, take, takeUntil, takeWhile, skip, skipUntil, first, last } from 'rxjs/operators';

// ---- filter — 条件过滤 ----
console.log('--- filter ---');
of(1, 2, 3, 4, 5, 6).pipe(
  filter(x => x % 2 === 0)
).subscribe(v => console.log('filter (even):', v));
// filter (even): 2 → 4 → 6

// ---- take — 取前 N 个值后自动完成 ----
console.log('--- take ---');
interval(100).pipe(
  take(3)
).subscribe({
  next: v => console.log('take:', v),
  complete: () => console.log('take: complete')
});
// take: 0 → 1 → 2 → take: complete

// ---- takeUntil — 直到 notifier 发出时停止 ----
console.log('--- takeUntil ---');
interval(100).pipe(
  takeUntil(timer(500))  // 500ms后停止
).subscribe({
  next: v => console.log('takeUntil:', v),
  complete: () => console.log('takeUntil: complete')
});
// takeUntil: 0 → 1 → 2 → 3 → complete (500ms内约4-5个值)

// ---- takeWhile — 条件为真时继续 ----
console.log('--- takeWhile ---');
of(1, 2, 3, 4, 1, 2).pipe(
  takeWhile(x => x < 4)
).subscribe(v => console.log('takeWhile:', v));
// takeWhile: 1 → 2 → 3 (4不满足就停止了)

// ---- skip — 跳过前 N 个 ----
console.log('--- skip ---');
of(1, 2, 3, 4, 5).pipe(
  skip(2)
).subscribe(v => console.log('skip:', v));
// skip: 3 → 4 → 5

// ---- skipUntil — 直到 notifier 发出才开始 ----
console.log('--- skipUntil ---');
interval(100).pipe(
  skipUntil(timer(350))
).subscribe(v => console.log('skipUntil:', v));
// 350ms后才开始: 3 → 4 → 5 → ...

// ---- first — 只取第一个（可带条件） ----
console.log('--- first ---');
of(1, 3, 5, 2, 4).pipe(
  first()  // 第一个值
).subscribe(v => console.log('first:', v));
// first: 1

of(1, 3, 5, 2, 4).pipe(
  first(x => x % 2 === 0)  // 第一个偶数
).subscribe(v => console.log('first (even):', v));
// first (even): 2

// ---- last — 取最后一个 ----
console.log('--- last ---');
of(1, 2, 3, 4, 5).pipe(
  last()
).subscribe(v => console.log('last:', v));
// last: 5
