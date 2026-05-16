/**
 * 实战: 响应式表单验证
 *
 * 用 RxJS 实现实时表单验证
 * 关键技术:
 *   combineLatest — 合并多个字段的状态
 *   map — 计算验证结果
 *   debounceTime — 防抖
 *   distinctUntilChanged — 只在验证状态变化时通知
 */

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

// ---- 表单字段 ----
const email$ = new BehaviorSubject('');
const password$ = new BehaviorSubject('');

// ---- 验证规则 ----
const emailValid$ = email$.pipe(
  debounceTime(300),
  map(email => {
    if (!email) return 'required';
    if (!email.includes('@')) return 'invalid email';
    return 'ok';
  }),
);

const passwordValid$ = password$.pipe(
  map(pwd => {
    if (!pwd) return 'required';
    if (pwd.length < 8) return 'too short (min 8)';
    return 'ok';
  }),
);

// ---- 整体表单状态 ----
const formState$ = combineLatest([
  email$, emailValid$,
  password$, passwordValid$,
]).pipe(
  map(([email, emailStatus, pwd, pwdStatus]) => ({
    email: { value: email, status: emailStatus },
    password: { value: '*'.repeat(pwd.length), status: pwdStatus },
    valid: emailStatus === 'ok' && pwdStatus === 'ok',
  })),
  distinctUntilChanged((prev, curr) => prev.valid === curr.valid),
);

formState$.subscribe(form => {
  console.log('--- Form State ---');
  console.log(`  Email: [${form.email.status}] ${form.email.value}`);
  console.log(`  Pwd:   [${form.password.status}] ${form.password.value}`);
  console.log(`  Submit: ${form.valid ? 'ENABLED' : 'DISABLED'}`);
});

// ---- 模拟用户输入 ----
console.log('\n=== 模拟用户输入 ===\n');
email$.next('bad');          // invalid email
email$.next('a@b.com');      // ok!

password$.next('123');       // too short
password$.next('12345678');  // ok! → submit enabled!
password$.next('123');       // too short → submit disabled!

// 最终: Email [ok], Pwd [too short], Submit DISABLED
