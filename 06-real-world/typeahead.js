/**
 * 实战: 搜索自动补全 (Typeahead / Autocomplete)
 *
 * 场景: 用户输入关键词，自动搜索建议
 * 关键技术:
 *   debounceTime — 防抖，等用户停止输入再发请求
 *   distinctUntilChanged — 去重，相同关键词不重复请求
 *   filter — 至少2个字符才搜索
 *   switchMap — 取消前一个未完成的请求
 *   catchError — 处理错误但不中断流
 */

import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, map, catchError, tap } from 'rxjs/operators';

// 模拟 API 搜索
function searchAPI(query: string): Promise<string[]> {
  console.log(`  API call: "${query}"`);
  return new Promise(resolve => {
    setTimeout(() => {
      const results = [`${query}1`, `${query}2`, `${query}3`];
      resolve(results);
    }, 300 + Math.random() * 500);
  });
}

/* 浏览器中的实际使用:
const input = document.getElementById('search-input');
const results$ = fromEvent(input, 'input').pipe(
  map((e: InputEvent) => (e.target as HTMLInputElement).value),
  debounceTime(300),          // 停止输入300ms后才发请求
  distinctUntilChanged(),     // 与上次相同则跳过
  filter(q => q.length >= 2), // 至少2字符
  tap(q => console.log('Searching:', q)),
  switchMap(q =>              // 取消前一个未完成的搜索
    searchAPI(q).pipe(
      catchError(err => {
        console.error('Search failed:', err);
        return of([]);        // 错误时返回空数组，流继续
      })
    )
  )
);
results$.subscribe(results => console.log('Results:', results));
*/

// 模拟演示
of('r', 'rx', 'rxjs', 'rxjs', 'rx').pipe(
  debounceTime(100),
  distinctUntilChanged(),
  filter(q => q.length >= 2),
  switchMap(q => of(`Results for: ${q}`))
).subscribe(console.log);
// r 被过滤(只有1字符), rxjs重复被跳过
// Results for: rx → Results for: rxj
