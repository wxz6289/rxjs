

import { Observable } from 'rxjs';

const observable = new Observable(subscriber => {
  try {
    subscriber.next(1);
    // throw new Error('oops!');
    subscriber.next(3);
    subscriber.complete();
  } catch (e) {
    subscriber.error(e);
  }
});

observable.subscribe({
  next(x) {
    console.log(x);
  },
  complete() {
    console.log('done');
  },
  error(e) {
    console.error(e);
  }
});