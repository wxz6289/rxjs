/**
 * 实战: 计数器 — BehaviorSubject 状态管理
 *
 * 用 BehaviorSubject 实现简单的 Redux-like 状态管理
 * 关键技术:
 *   BehaviorSubject — 状态容器，新订阅者立即获得当前值
 *   scan — 累加状态变化
 *   Subject — 作为 Action 流
 */

import { BehaviorSubject, Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

// ---- 定义 Actions ----
interface Action {
  type: 'INCREMENT' | 'DECREMENT' | 'RESET' | 'ADD';
  payload?: number;
}

// ---- Reducer (纯函数) ----
const reducer = (state: number, action: Action): number => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    case 'RESET': return 0;
    case 'ADD': return state + (action.payload || 0);
    default: return state;
  }
};

// ---- Store ----
class CounterStore {
  private actions$ = new Subject<Action>();
  state$: BehaviorSubject<number>;

  constructor(initialState = 0) {
    this.state$ = new BehaviorSubject(initialState);

    // 将 action 流通过 reducer 累加到 state
    this.actions$.pipe(
      scan((state, action) => reducer(state, action), initialState)
    ).subscribe(this.state$);
  }

  dispatch(action: Action) { this.actions$.next(action); }
  get value() { return this.state$.value; }
}

// ---- 使用 ----
const store = new CounterStore(0);

store.state$.subscribe(v => console.log('State changed:', v));

store.dispatch({ type: 'INCREMENT' });   // State changed: 1
store.dispatch({ type: 'INCREMENT' });   // State changed: 2
store.dispatch({ type: 'ADD', payload: 5 }); // State changed: 7
store.dispatch({ type: 'DECREMENT' });   // State changed: 6
store.dispatch({ type: 'RESET' });       // State changed: 0

console.log('Current:', store.value);     // Current: 0

// 新订阅者立即获得当前值
store.state$.subscribe(v => console.log('New subscriber:', v));
// New subscriber: 0

// 这就是 NgRx / Redux-Observable 的核心思路
