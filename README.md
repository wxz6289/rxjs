# RxJS — Reactive Extensions for JavaScript

响应式编程 (Reactive Programming) 是一种以**异步数据流**为核心的编程范式。RxJS 将一切视为流（Observable），通过丰富的操作符组合来声明式地处理异步事件和数据。

## 核心概念速览

```
创建 Observable → pipe(操作符1, 操作符2, ...) → subscribe(处理)
     (数据源)          (变换/过滤/组合)          (消费数据)
```

| 概念 | 说明 |
|------|------|
| **Observable** | 可观察的数据流，随时间推送值 |
| **Observer** | 消费者，`{ next, error, complete }` 三个回调 |
| **Subscription** | 订阅关系，调用 `unsubscribe()` 取消 |
| **Operator** | 纯函数，接收 Observable 返回新 Observable |
| **Subject** | 既是 Observable 也是 Observer，可多播 |
| **Scheduler** | 控制执行时机（同步/异步/微任务/动画帧） |

## 目录结构

```
01-observable/        Observable 核心: 创建、订阅、退订、Cold/Hot
02-operators/         操作符: 转换、过滤、组合、工具、数学
03-subjects/          Subject 体系: Subject/Behavior/Replay/Async
04-multicasting/      多播: share/shareReplay/publish/refCount
05-schedulers/        调度器: async/asap/queue/animationFrame
06-real-world/        实战案例: 搜索、轮询、拖拽、表单、秒表、计数器
07-advanced/          进阶: 高阶 Observable、自定义操作符、错误处理
08-immutable/         Immutable.js: 不可变数据结构
```

## 快速开始

```bash
npm install rxjs
```

```js
import { of, interval, fromEvent } from 'rxjs';
import { map, filter, take, debounceTime, switchMap } from 'rxjs/operators';

// 创建流
of(1, 2, 3).pipe(
  map(x => x * 10),
  filter(x => x > 10)
).subscribe(console.log);  // 20, 30
```

## 操作符选择速查

| 场景 | 使用 |
|------|------|
| 值转换 | `map`, `mapTo` |
| 条件过滤 | `filter`, `skip`, `take` |
| 输入防抖 | `debounceTime` + `distinctUntilChanged` |
| 取消前一个请求 | `switchMap` |
| 并行请求 | `mergeMap` |
| 顺序请求 | `concatMap` |
| 防重复提交 | `exhaustMap` |
| 合并多个流 | `merge`(并行), `concat`(顺序) |
| 取最新组合 | `combineLatest`, `withLatestFrom` |
| 等所有完成 | `forkJoin` |
| 按位置配对 | `zip` |
| 竞态取最快 | `race` |
| 定时轮询 | `interval` + `switchMap` |
| 错误处理 | `catchError`, `retry`, `retryWhen` |
| 调试/日志 | `tap` |
| 状态管理 | `BehaviorSubject` + `scan` |
| 共享流 | `share`, `shareReplay` |

## 常用模式

### 搜索自动补全
```js
fromEvent(input, 'input').pipe(
  map(e => e.target.value),
  debounceTime(300),
  distinctUntilChanged(),
  filter(q => q.length >= 2),
  switchMap(q => fetch(`/api/search?q=${q}`))
);
```

### 定时轮询
```js
interval(5000).pipe(
  switchMap(() => fetch('/api/data')),
  retry(3)
);
```

### 状态管理 (Redux-like)
```js
actions$.pipe(
  scan((state, action) => reducer(state, action), initialState)
).subscribe(behaviorSubject);
```

### 拖拽
```js
mousedown$.pipe(
  switchMap(start =>
    mousemove$.pipe(
      map(move => ({ dx: move.x - start.x, dy: move.y - start.y })),
      takeUntil(mouseup$)
    )
  )
);
```

## Cold vs Hot

- **Cold**（冷）：每次订阅独立执行（`of`, `from`, `interval`, `ajax`）
- **Hot**（热）：多订阅者共享同一数据源（`fromEvent`, `WebSocket`, `Subject`）
- Cold → Hot：用 `share()`, `shareReplay()`, `multicast()`

## 错误处理

```js
source$.pipe(
  retry(3),                                    // 重试3次
  catchError(err => of(fallbackValue)),        // 捕获并降级
  finalize(() => console.log('cleanup'))       // 总是执行清理
);
```

## 退订管理

- 调用 `subscription.unsubscribe()`
- 用 `take(n)` / `takeUntil(notifier$)` / `takeWhile(condition)` 自动退订
- 用 `first()` 取第一个后自动退订
- `async` pipe (Angular) 自动管理

## 参考资源

- [RxJS 官方文档](https://rxjs.dev/)
- [RxJS 操作符决策树](https://rxjs.dev/operator-decision-tree)
- [Learn RxJS](https://www.learnrxjs.io/)
- [RxViz — 可视化](https://rxviz.com/)
