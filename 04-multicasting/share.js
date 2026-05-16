/**
 * 多播操作符 — 让多个订阅者共享同一个源
 *
 * multicast + connect: 底层多播
 * publish + refCount: 自动管理连接
 * share(): 最常用的多播快捷方式
 * shareReplay(n): 共享 + 缓存重放
 */

import { interval, Subject } from 'rxjs';
import { take, multicast, share, shareReplay } from 'rxjs/operators';

// ---- 问题: Cold Observable 每个订阅者独立 ----
console.log('--- No Sharing (two subscriptions) ---');
const cold$ = interval(1000).pipe(take(3));
cold$.subscribe(v => console.log('ns1:', v));
setTimeout(() => cold$.subscribe(v => console.log('ns2:', v)), 2000);
// ns1: 0 → 1 → 2
// ns2: 0 → 1 → 2 (独立！错过了前面的值)

// ---- multicast — 底层多播控制 ----
console.log('--- multicast ---');
const multi$ = interval(1000).pipe(
  take(3),
  multicast(new Subject())
) as any;
// 需要手动 connect() 和 unsubscribe()

// ---- share() — 最常用的共享方式 ----
console.log('--- share ---');
const shared$ = interval(1000).pipe(
  take(4),
  share()
);

shared$.subscribe(v => console.log('share1:', v));
setTimeout(() => {
  shared$.subscribe(v => console.log('share2:', v));
}, 2000);
// share1: 0 → 1 ┐
// share2:  (加入)┴→ 2 → 3
// share2 收到了 2 和 3 — 共享同一个源!
// share() 内部: refCount > 0 时订阅源; refCount === 0 时退订

// ---- shareReplay — 共享 + 给新订阅者重放缓存 ----
console.log('--- shareReplay ---');
const replay$ = interval(1000).pipe(
  take(5),
  shareReplay({ bufferSize: 2, refCount: true })
);

replay$.subscribe(v => console.log('sr1:', v));
setTimeout(() => {
  replay$.subscribe(v => console.log('sr2:', v));
}, 3500);
// sr1: 0 → 1 → 2 ┐
// sr2: 1 → 2 (重放缓存!) → 继续 3 → 4
// shareReplay(2) 缓存最近2个值，新订阅者立即收到
