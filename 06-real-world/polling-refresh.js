/**
 * 实战: 轮询刷新 (Polling)
 *
 * 场景: 定时拉取最新数据（监控面板、消息列表）
 * 关键技术:
 *   interval + switchMap — 定时切换请求
 *   timer + repeat — 间隔轮询（等上次完成再开始下一次）
 *   takeUntil — 条件终止
 */

import { interval, timer, Subject } from 'rxjs';
import { switchMap, repeat, takeUntil, tap, retry } from 'rxjs/operators';

// 模拟 API
function fetchData() {
  console.log('  Fetching...');
  return new Promise(resolve => {
    setTimeout(() => resolve({ time: new Date().toISOString(), value: Math.random() }), 300);
  });
}

// ---- 方式1: interval + switchMap (简单轮询) ----
console.log('--- Interval Polling ---');
const polling$ = interval(2000).pipe(
  tap(() => console.log('Tick')),
  switchMap(() => fetchData()),
);

// 5秒后停止轮询
const stop$ = timer(5000);
const sub = polling$.pipe(
  takeUntil(stop$)
).subscribe(
  data => console.log('Polling data:', data),
  err => console.error(err),
  () => console.log('Polling stopped')
);
// 输出: Tick → Fetching... → Polling data: {...} (2s后)
//       Tick → Fetching... → Polling data: {...} (4s后)
//       Polling stopped (5s后)

// ---- 方式2: timer + repeat (等请求完再计时间隔) ----
console.log('--- Timer + Repeat ---');
let pollCount = 0;
timer(0, 2000).pipe(
  switchMap(() => {
    pollCount++;
    if (pollCount > 3) return ['STOP']; // 条件终止
    return fetchData();
  }),
  retry(2),  // 失败重试2次
).subscribe(data => {
  if (data === 'STOP') return;
  console.log('Repeated poll:', data);
});

// ---- 手动控制: start/stop ----
// const stopSubject = new Subject();
// const startSubject = new Subject();
// startSubject.pipe(
//   switchMap(() => timer(0, 3000).pipe(
//     switchMap(() => fetchData()),
//     takeUntil(stopSubject)
//   ))
// ).subscribe(data => console.log('Manual poll:', data));
// startSubject.next();  // 开始
// stopSubject.next();   // 停止
