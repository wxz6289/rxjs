import { timer } from 'rxjs';

const timerObservable = timer(2000);

timerObservable.subscribe({
  next(value) {
    console.log('timer emitted:', value);
  },
  complete() {
    console.log('done!');
  }
});