/**
 * Cold vs Hot Observable
 *
 * Cold (冷): 每次 subscribe 都独立执行生产者
 *   — of, from, interval, timer, range 创建的 Observable 都是冷的
 *   — 每个订阅者收到自己独立的数据流
 *
 * Hot (热): 多个订阅者共享同一个数据源
 *   — Subject, fromEvent, WebSocket 是热的
 *   — 通过 multicast/publish/share 把冷的变热
 */

import { interval, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

// ---- Cold Observable: 每次订阅都重新开始 ----
console.log('--- Cold ---');
const cold$ = interval(1000).pipe(take(3));

cold$.subscribe(v => console.log('cold obs 1:', v));

setTimeout(() => {
  cold$.subscribe(v => console.log('cold obs 2:', v));
}, 2000);
// 输出:
// cold obs 1: 0 (1s)
// cold obs 1: 1 (2s)   ← obs2 此时订阅，独立开始
// cold obs 2: 0 (2s)   ← 从自己的 0 开始！
// cold obs 1: 2 (3s)
// cold obs 2: 1 (3s)
// ...各走各的

// ---- Hot Observable (Subject): 订阅者共享 ----
console.log('--- Hot ---');
const subject = new Subject();
const hot$ = subject.asObservable();

hot$.subscribe(v => console.log('hot obs 1:', v));

subject.next('a');
subject.next('b');

const sub2 = hot$.subscribe(v => console.log('hot obs 2:', v));
subject.next('c');  // 两个订阅者都收到 'c'

sub2.unsubscribe();
subject.next('d');  // 只有 obs1 收到 'd'
// hot obs 1: a → b → c (obs2加入) → c → d(obs1 only)

// ---- Cold → Hot: 用 Subject 多播 ----
console.log('--- Cold to Hot ---');
const hotTick$ = interval(1000).pipe(take(3));
// 通过订阅到 Subject 来共享
const bridgeSubject = new Subject();
hotTick$.subscribe(bridgeSubject);

bridgeSubject.subscribe(v => console.log('shared 1:', v));

setTimeout(() => {
  bridgeSubject.subscribe(v => console.log('shared 2:', v));
}, 1500);
// shared 1: 0 → 1
//        shared 2: 1 (中途加入，错过前面的)
// shared 1: 2; shared 2: 2
// 两个订阅者共享同一个 interval 源！

// 更好的写法: 用 multicast / share 操作符 (见 04-multicasting/)
