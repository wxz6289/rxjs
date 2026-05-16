/**
 * 工具操作符
 * tap — 副作用 (调试、日志)
 * delay — 延迟
 */

import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

// ---- tap — 不修改流的透传操作（调试利器） ----
of(1, 2, 3).pipe(
  tap(x => console.log('before map:', x)),
  map(x => x * 10),
  tap(x => console.log('after map:', x)),
).subscribe();
// before map: 1 → after map: 10
// before map: 2 → after map: 20
// before map: 3 → after map: 30
// tap 不改变流的值，只执行副作用

// ---- 实战: 用 tap 打日志 ----
of('user1', 'user2').pipe(
  tap({
    next: v => console.log('Processing:', v),
    complete: () => console.log('All done!'),
  })
).subscribe();

// ---- delay — 延迟每个值的发出 ----
of(1, 2, 3).pipe(
  delay(1000)
).subscribe(v => console.log('delay:', v));
// 1秒后: 1 → 2 → 3 (每个都延迟了)
// 注意: delay 延迟了所有值，但值之间的间隔保持不变
