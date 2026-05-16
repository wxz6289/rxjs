/**
 * 实战: 秒表 (Stopwatch) — start/stop/reset
 *
 * 用 RxJS 管理时间状态
 * 关键技术:
 *   timer — 高频计时
 *   filter — 条件控制
 *   takeUntil — 停止条件
 *   Subject — 控制命令
 */

import { timer, Subject, merge } from 'rxjs';
import { map, takeUntil, scan, startWith, withLatestFrom } from 'rxjs/operators';

// ---- Actions ----
type Cmd = 'START' | 'STOP' | 'RESET';

// ---- 秒表逻辑 ----
function createStopwatch() {
  const cmd$ = new Subject<Cmd>();

  // 每 50ms tick 一次
  const elapsed$ = timer(0, 50).pipe(
    scan(ms => ms + 50, 0),
    takeUntil(cmd$.pipe(filter(c => c === 'RESET' || c === 'STOP')))
  );

  // 控制状态
  const running$ = merge(
    cmd$.pipe(filter(c => c === 'START'), map(() => true)),
    cmd$.pipe(filter(c => c === 'STOP' || c === 'RESET'), map(() => false)),
  ).pipe(startWith(false));

  return { cmd$, elapsed$, running$ };
}

// ---- 使用演示 ----
const { cmd$, elapsed$, running$ } = createStopwatch();

elapsed$.pipe(
  withLatestFrom(running$)
).subscribe(([ms, running]) => {
  const seconds = (ms / 1000).toFixed(2);
  const status = running ? '▶' : '⏸';
  console.log(`${status} ${seconds}s`);
});

// 模拟操作序列
cmd$.next('START');
setTimeout(() => cmd$.next('STOP'), 1000);   // 1秒后停止
setTimeout(() => cmd$.next('START'), 1500);  // 1.5秒后再开始
setTimeout(() => cmd$.next('RESET'), 2500);  // 2.5秒后重置

// 输出类似:
// ▶ 0.00s → ▶ 0.05s → ... → ▶ 1.00s
// ⏸ 1.00s
// ▶ 0.00s → ▶ 0.05s → ... → ▶ 1.00s
// (reset 停止流)
