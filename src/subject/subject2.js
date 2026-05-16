import { from, Subject } from 'rxjs';

const subject = new Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v),
  complete() {
    console.log('observerA complete');
  }
});

subject.subscribe({
    next: (v) => console.log('observerB: ' + v)
});

const observable = from([1, 2, 3]);

observable.subscribe(subject);