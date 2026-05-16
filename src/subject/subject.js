import { Subject } from 'rxjs';

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

subject.next(1);
subject.next(2);
subject.complete();