/**
 * 数学/统计操作符
 * count, max, reduce, every, find, findIndex, isEmpty
 */

import { of } from 'rxjs';
import { count, reduce, max, every, find, findIndex, isEmpty } from 'rxjs/operators';

// ---- count — 计数流中值的个数 ----
of(1, 2, 3, 4, 5).pipe(
  count()
).subscribe(v => console.log('count:', v));
// count: 5

// 条件计数
of(1, 2, 3, 4, 5).pipe(
  count(x => x > 3)
).subscribe(v => console.log('count > 3:', v));
// count > 3: 2

// ---- reduce — 归约 (累加器) ----
of(1, 2, 3, 4).pipe(
  reduce((acc, cur) => acc + cur, 0)
).subscribe(v => console.log('reduce sum:', v));
// reduce sum: 10

// ---- max — 最大值 ----
of(5, 2, 8, 3).pipe(
  max()
).subscribe(v => console.log('max:', v));
// max: 8

// 带比较器的 max
of({ v: 5 }, { v: 2 }, { v: 8 }).pipe(
  max((a, b) => a.v - b.v)
).subscribe(v => console.log('max obj:', v));
// max obj: { v: 8 }

// ---- every — 是否所有值都满足条件 ----
of(2, 4, 6, 8).pipe(
  every(x => x % 2 === 0)
).subscribe(v => console.log('every even:', v));
// every even: true

// ---- find / findIndex — 查找第一个满足条件的值/索引 ----
of(1, 3, 5, 2, 4).pipe(
  find(x => x % 2 === 0)
).subscribe(v => console.log('find:', v));
// find: 2

of(1, 3, 5, 2, 4).pipe(
  findIndex(x => x % 2 === 0)
).subscribe(v => console.log('findIndex:', v));
// findIndex: 3

// ---- isEmpty — 流是否为空 ----
of().pipe(isEmpty()).subscribe(v => console.log('isEmpty:', v)); // true
of(1).pipe(isEmpty()).subscribe(v => console.log('isEmpty:', v)); // false
