/**
 * 实战: WebSocket 数据流
 *
 * 将 WebSocket 消息转为 RxJS Observable
 * 关键技术:
 *   new Observable — 包装 WebSocket
 *   retry — 断线重连
 *   share — 多播共享连接
 */

import { Observable, Subject } from 'rxjs';
import { retry, share, filter, map, takeUntil } from 'rxjs/operators';

// ---- WebSocket Observable 工厂 ----
function createWebSocket$(url: string) {
  return new Observable<MessageEvent>(observer => {
    console.log('Connecting to', url);
    const socket = new WebSocket(url);

    socket.onmessage = (event) => observer.next(event);
    socket.onerror = (err) => observer.error(err);
    socket.onclose = (event) => {
      if (event.wasClean) {
        observer.complete();
      } else {
        observer.error(new Error('Connection closed unexpectedly'));
      }
    };

    // 退订时关闭连接
    return () => {
      console.log('Closing WebSocket');
      socket.close();
    };
  });
}

// ---- 使用 ----
/* 实际代码:
const chatMessages$ = createWebSocket$('wss://chat.example.com').pipe(
  map(event => JSON.parse(event.data)),
  // 断线自动重连
  retry({ delay: 3000, count: 5 }),
  // 多播共享（多个组件订阅同一个连接）
  share()
);

// 按类型过滤消息
const systemMsgs$ = chatMessages$.pipe(
  filter((msg: any) => msg.type === 'system')
);
const userMsgs$ = chatMessages$.pipe(
  filter((msg: any) => msg.type === 'user')
);

// 发送消息
function sendMessage(socket: WebSocket, msg: object) {
  socket.send(JSON.stringify(msg));
}
*/

console.log('WebSocket 流模式:');
console.log('  createWebSocket$(url) → 返回 Observable<MessageEvent>');
console.log('  → pipe(retry()) → 自动重连');
console.log('  → pipe(share()) → 多组件共享同一连接');
console.log('  → pipe(filter()) → 按类型分发消息');
