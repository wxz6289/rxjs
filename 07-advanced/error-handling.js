/**
 * RxJS 错误处理
 *
 * catchError — 捕获错误并返回替代流
 * retry     — 错误时重新订阅
 * retryWhen — 延迟重试（指数退避）
 * finalize  — 无论成功/失败/退订都执行清理
 */

import { of, throwError, timer } from 'rxjs';
import { catchError, retry, retryWhen, delay, finalize, take, mergeMap } from 'rxjs/operators';

// ---- catchError — 捕获并替换 ----
throwError(() => new Error('Boom!')).pipe(
  catchError(err => {
    console.log('Caught:', err.message);
    return of('recovered value');  // 返回替代流
  })
).subscribe({
  next: v => console.log('Received:', v),
  error: err => console.log('Error:', err),  // 不会执行
  complete: () => console.log('Complete'),
});
// Caught: Boom!
// Received: recovered value
// Complete

// ---- retry — 简单重试 ----
let attempt = 0;
new Observable(subscriber => {
  attempt++;
  console.log(`Attempt #${attempt}`);
  if (attempt < 3) {
    subscriber.error(new Error('Fail'));
  } else {
    subscriber.next('success!');
    subscriber.complete();
  }
}).pipe(
  retry(4)  // 最多重试4次
).subscribe(v => console.log('Result:', v));
// Attempt #1 → Attempt #2 → Attempt #3 → Result: success!

// ---- retryWhen + delay — 指数退避重试 ----
throwError(() => new Error('Network error')).pipe(
  retryWhen(errors =>
    errors.pipe(
      mergeMap((err, i) => {
        const retryAttempt = i + 1;
        if (retryAttempt > 5) {
          return throwError(() => err);  // 超过5次放弃
        }
        const delayMs = Math.min(1000 * Math.pow(2, retryAttempt), 30000);
        console.log(`Retry #${retryAttempt} after ${delayMs}ms`);
        return timer(delayMs);
      })
    )
  )
).subscribe({
  error: err => console.log('最终失败:', err.message),
});
// Retry #1 after 2000ms
// Retry #2 after 4000ms
// ...最多5次

// ---- finalize — 最终清理（总是执行） ----
of(1, 2, 3).pipe(
  finalize(() => console.log('cleanup!'))
).subscribe();
// 1 → 2 → 3 → cleanup!
// finalize 在 complete, error, 或 unsubscribe 时都会执行
