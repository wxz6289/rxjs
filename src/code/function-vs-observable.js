/* function foo() {
  console.log("hello!");
  return 32;
}

const x = foo.call();
console.log(x);
const y = foo.call();
console.log(y) */

import { Observable } from 'rxjs';

const observable = new Observable((subscriber) => {
  console.log("hello!");
  subscriber.next(32);
});

observable.subscribe((x) => {
  console.log(x);
});

observable.subscribe((x) => {
  console.log(x);
});