/**
 * Observable 核心概念 — 创建、订阅、退订、错误处理
 *
 * Observable = 数据流 = 随时间推送的值序列
 * 4种通知: next(value), error(err), complete()
 * 退订: subscription.unsubscribe() 或 takeUntil 等操作符自动退订
 */

import { Observable } from 'rxjs';

// ---- 基础创建 ----
const onSubscribe = observer => {
  let number = 1;
  const timer = setInterval(() => {
    observer.next(number++);
    if (number > 3) {
      clearInterval(timer);
      observer.complete();
    }
  }, 1000);
  // 返回退订函数 — 资源清理
  return () => clearInterval(timer);
};

new Observable(onSubscribe).subscribe(
  value => console.log('value:', value),
  err => console.error('error:', err),
  () => console.log('complete!')
);

// 输出: (每秒一个) value: 1 → value: 2 → value: 3 → complete!

// ---- 同步推送 vs 异步推送 ----
console.log('before subscribe');
new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.complete();
}).subscribe({
  next: v => console.log('sync:', v),
  complete: () => console.log('sync done'),
});
console.log('after subscribe');
// 输出: before → sync: 1 → sync: 2 → sync done → after
// Observable 同步执行推送! (除非内部用了 setTimeout)

// ---- 错误处理 ----
new Observable(observer => {
  observer.error(new Error('Something went wrong'));
}).subscribe({
  next: console.log,
  error: err => console.error('Caught:', err.message),
  complete: () => console.log('complete'),
});
// complete 不会执行 — error 和 complete 是互斥的

// ---- 退订与资源清理 ----
const subscription = new Observable(observer => {
  const id = setTimeout(() => observer.next('delayed'), 1000);
  return () => {
    clearTimeout(id);
    console.log('cleanup: timer cleared');
  };
}).subscribe(v => console.log(v));

setTimeout(() => {
  subscription.unsubscribe();
  console.log('unsubscribed');
}, 500);
// 输出: unsubscribed → cleanup: timer cleared
// (1秒后才到，但已被取消，所以 "delayed" 不会打印)
