/**
 * Immutable.js 进阶: 嵌套更新、相等比较、Seq 惰性计算
 */

import { Map, List, Seq, is, fromJS } from 'immutable';

// ---- 嵌套结构深度更新 ----
const state = fromJS({
  user: {
    name: 'Alice',
    profile: { age: 25, city: 'NYC' },
    hobbies: ['reading', 'coding'],
  },
  count: 0,
});

// setIn — 设置深层路径的值
const s1 = state.setIn(['user', 'profile', 'city'], 'LA');
console.log(s1.getIn(['user', 'profile', 'city']));  // LA

// updateIn — 基于旧值计算新值
const s2 = state.updateIn(['count'], v => v + 1);
const s3 = state.updateIn(['user', 'hobbies'], list => list.push('gaming'));
console.log(s2.get('count'));       // 1
console.log(s3.getIn(['user', 'hobbies']).toJS()); // ['reading','coding','gaming']

// ---- 值相等比较 (引用不同但值相同 = true) ----
const a = Map({ x: 1, y: 2 });
const b = Map({ x: 1, y: 2 });
console.log(a === b);     // false (不同引用)
console.log(is(a, b));    // true (值相等!)

// is 对嵌套结构递归比较
const nested1 = fromJS({ a: { b: 1 } });
const nested2 = fromJS({ a: { b: 1 } });
console.log(is(nested1, nested2));  // true

// ---- Seq — 惰性计算 ----
// Seq 不会创建中间集合，适合大数据处理
const result = Seq([1, 2, 3, 4, 5, 6])
  .filter(x => {
    console.log('filter:', x);
    return x % 2 === 0;
  })
  .map(x => {
    console.log('map:', x);
    return x * 10;
  })
  .take(2);  // 只取前2个 — 惰性计算只在需要时执行

console.log('--- 强制求值 ---');
console.log(result.toArray());
// filter: 1 → filter: 2 → map: 2
// filter: 3 → filter: 4 → map: 4
// [20, 40]
// 注意: 3和5没有经过 map（被filter过滤了），5-6根本没处理（take(2) 之后不需要了）

// ---- merge / mergeDeep — 合并 Map ----
const base = Map({ a: 1, b: 2, c: { d: 3 } });
const merged = base.merge(Map({ b: 20, e: 5 }));
console.log(merged.toJS());  // { a:1, b:20, c:{d:3}, e:5 }
// merge 浅合并 — c 完整保留

const deepMerged = base.mergeDeep(Map({ b: 20, c: { e: 6 } }));
console.log(deepMerged.toJS());  // { a:1, b:20, c:{d:3, e:6} }
// mergeDeep 递归合并 — c 内部也合并了
