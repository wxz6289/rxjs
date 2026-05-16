/**
 * 高阶 Observable — Observable of Observable
 *
 * 当一个 Observable 发出的值本身也是 Observable 时，需要"展平"
 *
 * 四个核心高阶映射操作符:
 *   switchMap  — 切换到最新（取消前一个）→ 最常用
 *   mergeMap   — 并发合并（不取消）→ 并行请求
 *   concatMap  — 排队顺序执行 → 严格顺序
 *   exhaustMap — 忽略新请求直到当前完成 → 防重复提交
 */

import { interval, of, timer } from 'rxjs';
import { switchMap, mergeMap, concatMap, exhaustMap, take, map, delay } from 'rxjs/operators';

// ---- switchMap — 切换，取消前一个（搜索场景） ----
console.log('--- switchMap ---');
// 模拟快速输入: 每300ms一个"请求"
interval(300).pipe(
  take(5),
  switchMap(id => {
    console.log(`  发起请求 ${id}`);
    // 模拟 API 请求（每个请求耗时 500ms）
    return timer(500).pipe(map(() => `结果 ${id}`));
  })
).subscribe(result => console.log('收到:', result));
// 请求0(300ms) → 请求1(600ms, 取消0) → 请求2(900ms, 取消1)
// → 请求3(1200ms, 取消2) → 请求4(1500ms, 取消3)
// 收到: 结果 4 (只有最后一个完成了！)
// 场景: 搜索建议、自动补全

// ---- mergeMap — 并发，不取消（批量请求） ----
console.log('--- mergeMap ---');
of('url1', 'url2', 'url3').pipe(
  mergeMap(url => {
    console.log(`  并行请求 ${url}`);
    return timer(500).pipe(map(() => `${url} 结果`));
  })
).subscribe(result => console.log('收到:', result));
// 三个请求同时发出，500ms后三个结果几乎同时到达
// 场景: 批量 API 调用

// ---- concatMap — 排队，等前一个完成 ----
console.log('--- concatMap ---');
of('A', 'B', 'C').pipe(
  concatMap(id => {
    console.log(`  顺序处理 ${id}`);
    return timer(300).pipe(map(() => `${id} 完成`));
  })
).subscribe(result => console.log('收到:', result));
// A完成 → B完成 → C完成（严格顺序，一个等一个）
// 场景: 表单提交序列、动画序列

// ---- exhaustMap — 忽略，当前未完成时跳过 ----
console.log('--- exhaustMap ---');
interval(200).pipe(
  take(10),
  exhaustMap(id => {
    console.log(`  处理 ${id}`);
    return timer(500).pipe(map(() => `${id} 完成`));
  })
).subscribe(result => console.log('收到:', result));
// 0 处理 → (1,2被忽略) → 3 处理 → (4,5被忽略) → 6 处理...
// 场景: 登录按钮防重复点击、保存按钮
