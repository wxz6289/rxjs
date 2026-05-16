/**
 * Scheduler — 控制 Observable 执行的时机和上下文
 *
 * queue  — 同步执行（队列顺序）
 * asap   — 微任务（尽可能快）
 * async  — 宏任务 (setTimeout)
 * animationFrame — requestAnimationFrame（浏览器渲染帧）
 */

import { range, asyncScheduler, asapScheduler, queueScheduler, animationFrameScheduler, of } from 'rxjs';
import { observeOn, subscribeOn, tap } from 'rxjs/operators';

// ---- 默认: 同步执行 ----
console.log('--- Sync (no scheduler) ---');
console.log('before');
of('sync').subscribe(v => console.log(v));
console.log('after');
// before → sync → after

// ---- asyncScheduler — 宏任务延迟 ----
console.log('--- async ---');
console.log('before async');
of('async').pipe(
  observeOn(asyncScheduler)
).subscribe(v => console.log(v));
console.log('after async');
// before async → after async → async (延迟到宏任务)

// ---- subscribeOn — 控制订阅在哪个调度器执行 ----
of('subscribeOn').pipe(
  subscribeOn(asyncScheduler),
  tap(() => console.log('tap in sync?')),
).subscribe(v => console.log(v));
// subscribeOn 影响整个流水线的开始调度

// ---- observeOn — 控制后续操作符的执行调度器 ----
console.log('--- observeOn ---');
of(1, 2, 3).pipe(
  tap(v => console.log('before observeOn:', v)),  // 同步
  observeOn(asyncScheduler),
  tap(v => console.log('after observeOn:', v)),   // 异步(宏任务)
).subscribe();
// before observeOn: 1 → 2 → 3 (同步)
// after observeOn: 1 → 2 → 3 (在宏任务中)

// ---- animationFrame — 在浏览器渲染帧执行 ----
// animationFrameScheduler.schedule(() => {
//   element.style.transform = `translateX(${x}px)`;
// });

// ---- 调度器总结 ----
// queue:            同步，按队列顺序
// asap:            微任务 (Promise.then / process.nextTick)
// async:           宏任务 (setTimeout)
// animationFrame:  requestAnimationFrame (仅浏览器)
//
// 需要 Scheduler 的操作符:
// - interval, timer, range (创建)
// - bindCallback, bindNodeCallback
// - observeOn, subscribeOn
// - delay, timeout, throttle, debounce
