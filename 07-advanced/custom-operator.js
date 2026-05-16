/**
 * 自定义操作符
 *
 * 操作符本质: 接收 Observable，返回新的 Observable 的函数
 *
 * 两种创建方式:
 * 1. 用 pipe + 已有操作符组合
 * 2. 用 new Observable 手动创建
 */

import { Observable, of, interval } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

// ---- 方式1: 组合已有操作符 ----
function multiplyBy(factor: number) {
  return (source$: Observable<number>) =>
    source$.pipe(map(x => x * factor));
}

function filterEven() {
  return (source$: Observable<number>) =>
    source$.pipe(filter(x => x % 2 === 0));
}

// 使用
of(1, 2, 3, 4, 5).pipe(
  filterEven(),
  multiplyBy(10),
).subscribe(v => console.log('composed:', v));
// composed: 20 → 40

// ---- 方式2: 手动创建 (底层) ----
function debug<T>(label: string) {
  return (source$: Observable<T>) =>
    new Observable<T>(subscriber => {
      console.log(`[${label}] subscribed`);
      const sub = source$.subscribe({
        next: v => {
          console.log(`[${label}] next:`, v);
          subscriber.next(v);
        },
        error: err => {
          console.log(`[${label}] error:`, err);
          subscriber.error(err);
        },
        complete: () => {
          console.log(`[${label}] complete`);
          subscriber.complete();
        },
      });
      return () => {
        console.log(`[${label}] unsubscribe`);
        sub.unsubscribe();
      };
    });
}

// 使用
interval(500).pipe(
  take(3),
  debug('MyDebug'),
).subscribe();
// [MyDebug] subscribed
// [MyDebug] next: 0 → [MyDebug] next: 1 → [MyDebug] next: 2
// [MyDebug] complete
// [MyDebug] unsubscribe
