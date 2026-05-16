/**
 * 创建操作符 — 创建 Observable 的快捷方式
 * of, from, interval, timer, range, generate, create, fromEvent
 */

import { of, from, interval, timer, range, generate, Observable, fromEvent } from 'rxjs';

// ---- of — 按顺序发出值，同步完成 ----
console.log('--- of ---');
of(1, 2, 3).subscribe({
  next: v => console.log('of:', v),
  complete: () => console.log('of: complete'),
});
// of: 1 → of: 2 → of: 3 → of: complete

// ---- from — 从数组/Promise/可迭代对象创建 ----
console.log('--- from ---');
from([10, 20, 30]).subscribe(v => console.log('from array:', v));
from(Promise.resolve('done')).subscribe(v => console.log('from promise:', v));
from('hi').subscribe(v => console.log('from string:', v));
// from promise: done, from string: h → i

// ---- interval — 定时递增推送 ----
console.log('--- interval ---');
// interval(1000) — 每秒发出递增数字: 0, 1, 2, ...
const intervalSub = interval(1000).subscribe(v => console.log('interval:', v));
setTimeout(() => intervalSub.unsubscribe(), 3500);
// interval: 0 → 1 → 2 (3.5秒后停止)

// ---- timer — 延迟后发出单值或定时发出 ----
console.log('--- timer ---');
timer(2000).subscribe(() => console.log('timer: 2s delay'));
timer(1000, 500).subscribe(v => console.log('timer repeat:', v));
// 1秒后开始，每500ms: 0 → 1 → 2 → ...

// ---- range — 发出范围内的连续数字 ----
console.log('--- range ---');
range(5, 3).subscribe(v => console.log('range:', v));
// range: 5 → 6 → 7

// ---- generate — 类似 for 循环的流 ----
console.log('--- generate ---');
generate({
  initialState: 1,
  condition: v => v < 8,
  iterate: v => v * 2,
}).subscribe(v => console.log('generate:', v));
// generate: 1 → 2 → 4

// ---- Observable.create (底层) ----
Observable.create(observer => {
  observer.next('custom 1');
  observer.next('custom 2');
  observer.complete();
}).subscribe(console.log);

// ---- fromEvent — DOM 事件转 Observable (浏览器环境) ----
// const clicks$ = fromEvent(document, 'click');
// clicks$.subscribe(e => console.log('click:', e.clientX, e.clientY));
