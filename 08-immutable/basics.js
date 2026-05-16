/**
 * Immutable.js 基础
 *
 * 不可变数据: 修改总是返回新对象，原对象不变
 * 优势: 变更检测快 (引用比较)、并发安全、撤销/重做容易
 *
 * 核心类型: List, Map, Set, Seq
 */

import { List, Map, Set, Seq, fromJS } from 'immutable';

// ---- Map — 不可变键值对 ----
const map1 = Map({ a: 1, b: 2, c: 3 });
const map2 = map1.set('b', 50);
console.log(map1.get('b'));  // 2 (未变!)
console.log(map2.get('b'));  // 50 (新对象)
console.log(map1 === map2);  // false (不同引用)

// 链式更新
const map3 = map1.set('a', 10).set('c', 30).delete('b');
console.log(map3.toJS());    // { a: 10, c: 30 }

// ---- List — 不可变数组 ----
const list1 = List([1, 2, 3]);
const list2 = list1.push(4).push(5);
console.log(list1.size);     // 3
console.log(list2.size);     // 5
console.log(list2.get(0));   // 1

// 不可变性: 修改返回新 List
const list3 = list1.set(0, 99);
console.log(list1.get(0));   // 1 (原 List 不变)
console.log(list3.get(0));   // 99

// 常用方法 (类似 Array)
const doubled = list1.map(x => x * 2);
const filtered = list1.filter(x => x > 1);
const sum = list1.reduce((a, b) => a + b, 0);
console.log(doubled.toJS()); // [2, 4, 6]
console.log(filtered.toJS()); // [2, 3]
console.log(sum);            // 6

// ---- Set — 不可变集合 (自动去重) ----
const set1 = Set([1, 2, 2, 3, 3, 3]);
console.log(set1.toJS());    // [1, 2, 3]
const set2 = set1.add(4).add(5);
console.log(set2.has(3));    // true

// ---- fromJS — 深度转换 JS 对象/数组 ----
const nested = fromJS({
  user: { name: 'Alice', scores: [90, 85, 95] },
});
const updated = nested.setIn(['user', 'name'], 'Bob')
                      .updateIn(['user', 'scores'], s => s.push(100));
console.log(updated.toJS());
// { user: { name: 'Bob', scores: [90, 85, 95, 100] } }
// 每一步返回全新的不可变数据结构
