/**
 * 实战: API 请求重试 + 指数退避
 *
 * 场景: 网络请求失败时自动重试，间隔递增
 * 关键技术:
 *   retryWhen + delay — 条件重试
 *   指数退避: 1s → 2s → 4s → 8s → max 30s
 *   catchError — 最终失败后的替代方案
 */

import { throwError, timer, of } from 'rxjs';
import { mergeMap, retryWhen, catchError } from 'rxjs/operators';

// ---- 指数退避重试 ----
function retryWithBackoff(maxRetries: number, baseDelay: number = 1000) {
  return retryWhen(errors =>
    errors.pipe(
      mergeMap((err, index) => {
        const attempt = index + 1;
        if (attempt > maxRetries) {
          console.log('  超过最大重试次数，放弃');
          return throwError(() => err);
        }
        // 指数退避: 1s → 2s → 4s → 8s ...
        const delayMs = Math.min(baseDelay * Math.pow(2, index), 30000);
        console.log(`  第 ${attempt} 次重试，等待 ${delayMs}ms...`);
        return timer(delayMs);
      })
    )
  );
}

// ---- 完整请求函数 ----
function apiCallWithRetry(url: string) {
  console.log(`Request: ${url}`);

  // 模拟一个前3次失败的请求
  let attempts = 0;
  const request$ = new Promise((resolve, reject) => {
    attempts++;
    console.log(`  Attempt #${attempts}`);
    setTimeout(() => {
      if (attempts < 4) {
        reject(new Error('Network error'));
      } else {
        resolve({ status: 200, data: 'Success!' });
      }
    }, 200);
  });

  return of(request$).pipe(
    mergeMap(p => p),
    retryWithBackoff(5, 500),  // 最多5次，初始500ms退避
    catchError(err => {
      console.log('  API 最终失败:', err.message);
      return of({ status: 0, data: null, error: err.message });
    })
  );
}

// 执行
apiCallWithRetry('/api/data').subscribe(
  result => console.log('Result:', result),
  err => console.error('Subscribe error:', err)
);

// 输出:
// Request: /api/data
//   Attempt #1
//   第 1 次重试，等待 500ms...
//   Attempt #2
//   第 2 次重试，等待 1000ms...
//   Attempt #3
//   第 3 次重试，等待 2000ms...
//   Attempt #4
// Result: { status: 200, data: 'Success!' }
