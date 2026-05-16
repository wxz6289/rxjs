/**
 * 实战: 拖拽 (Drag & Drop)
 *
 * 用 RxJS 实现鼠标拖拽
 * 关键技术:
 *   fromEvent — mousedown / mousemove / mouseup 转 Observable
 *   switchMap — mousedown 时切换为 mousemove 流
 *   takeUntil — mouseup 时停止 mousemove
 *   map — 计算位移
 */

import { fromEvent, Observable } from 'rxjs';
import { switchMap, takeUntil, map, startWith } from 'rxjs/operators';

/* 浏览器实际代码:
const draggable = document.getElementById('draggable');

const mouseDown$ = fromEvent<MouseEvent>(draggable, 'mousedown');
const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

const drag$ = mouseDown$.pipe(
  switchMap(startEvent => {
    // 记录起始位置
    const startX = startEvent.clientX;
    const startY = startEvent.clientY;
    const elemLeft = draggable.offsetLeft;
    const elemTop = draggable.offsetTop;

    // 防止拖拽时选中文字
    startEvent.preventDefault();

    return mouseMove$.pipe(
      map(moveEvent => ({
        left: elemLeft + moveEvent.clientX - startX,
        top: elemTop + moveEvent.clientY - startY,
      })),
      takeUntil(mouseUp$)  // 鼠标松开时停止
    );
  })
);

drag$.subscribe(pos => {
  draggable.style.left = pos.left + 'px';
  draggable.style.top = pos.top + 'px';
});
*/

// ---- 模拟演示 ----
console.log('Drag & Drop 示例 (需要在浏览器中运行)');
console.log('核心逻辑:');
console.log('  mousedown → switchMap(() => mousemove.pipe(takeUntil(mouseup)))');
console.log('  → 在 mousedown 和 mouseup 之间跟踪 mousemove 的坐标差');
