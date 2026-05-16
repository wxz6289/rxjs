import { Observable } from 'rxjs';

const intervalObservable = new Observable(subscriber => {
  const intervalId = setInterval(() => {
    subscriber.next('tick');
  }, 1000);

  return () => {
    clearInterval(intervalId);
  };
});

const subscription = intervalObservable.subscribe(value => {
  console.log(value);
});

setTimeout(() => {
  subscription.unsubscribe();
}, 5000);