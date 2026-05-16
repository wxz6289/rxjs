import { bindCallback } from 'rxjs';

const fn = (x, y, cb) => {
    setTimeout(() => {
      cb('Hello World', x + y);
      cb("haha")
    }, 1000);
};

const source$ = bindCallback(fn)(2, 3);

source$.subscribe(console.log);