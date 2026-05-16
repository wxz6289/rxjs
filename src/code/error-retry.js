import { Observable, retry, scan, catchError, throwError } from 'rxjs';

let count = 0;
const errorObservable = new Observable(subscriber => {
  count++;
  subscriber.next(count);
  subscriber.error(new Error('oops!'));
});

const handleObservable = errorObservable.pipe(
  // scan((count) => count + 1, 0),
  retry(3),
  catchError((err) => {
    console.error('catchError:', err);
    return throwError(() => new Error('retry Error'))
  }),
);

handleObservable.subscribe({
  next(count) {
    console.log("subscribe: ",count);
  },
  error(err) {
    console.error(`subscribe error ${err}`);
  }
});