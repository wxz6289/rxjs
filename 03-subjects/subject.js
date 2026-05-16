/**
 * Subject — 既是 Observable 也是 Observer
 *
 * 本质: 多播的 Observable
 * - 可以手动 next()/error()/complete() 推送
 * - 多个订阅者共享同一数据源
 * - subject 完成后(complete/error)不能再推送
 *
 * 变体:
 *   BehaviorSubject  — 有初始值，新订阅者立即收到最新值
 *   ReplaySubject    — 缓存 N 个值，新订阅者收到缓存+后续
 *   AsyncSubject     — 只发出 complete 前的最后一个值
 */

import { interval, Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';
import { take } from 'rxjs/operators';

// ==================== Subject ====================
console.log('--- Subject ---');
const subject = new Subject();

subject.subscribe({
  next: v => console.log('sub1:', v),
  complete: () => console.log('sub1 complete'),
});

subject.next('a');
subject.next('b');

// 第二个订阅者中途加入
subject.subscribe(v => console.log('sub2:', v));
subject.next('c');  // 两个订阅者都收到
// sub1: a, b, c
// sub2: c (只收到加入后的值)

subject.complete();
subject.next('d');  // 无效 — subject 已完结
// sub1 complete

// ==================== BehaviorSubject ====================
console.log('--- BehaviorSubject ---');
const bSubject = new BehaviorSubject('init');

bSubject.subscribe(v => console.log('b-sub1:', v));
// b-sub1: init (立即收到当前值!)

bSubject.next('updated');
// b-sub1: updated

bSubject.subscribe(v => console.log('b-sub2:', v));
// b-sub2: updated (新订阅者收到最新值，不是 'init')

// ==================== ReplaySubject ====================
console.log('--- ReplaySubject ---');
const rSubject = new ReplaySubject(2);  // 缓存最近2个值

rSubject.next(1);
rSubject.next(2);
rSubject.next(3);
// 缓存 [2, 3]

rSubject.subscribe(v => console.log('r-sub1:', v));
// r-sub1: 2, 3 (收到缓存的最近2个值！)
rSubject.next(4);
// r-sub1: 4

// ==================== AsyncSubject ====================
console.log('--- AsyncSubject ---');
const aSubject = new AsyncSubject();

aSubject.subscribe(v => console.log('a-sub1:', v));
aSubject.next(1);
aSubject.next(2);
aSubject.next(3);
// 还没发出 — 等待 complete
aSubject.complete();
// a-sub1: 3 (只收到最后的3！)
