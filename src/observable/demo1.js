/* import { Observable } from 'rxjs';

const observable = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
    }, 1000);
});

console.log('just before subscribe');
observable.subscribe({
    next(x) { console.log('got value ' + x); },
    error(err) { console.error('something wrong occurred: ' + err); },
    complete() { console.log('done'); }
});
console.log('just after subscribe'); */


import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(subscriber) {
    const id = setInterval(() => {
        subscriber.next('hi')
    }, 1000);
    const timer = setTimeout(() => { subscriber.complete(); }, 3000);

    return () => {
        clearInterval(id);
        clearTimeout(timer);
    }
});

const subscription = observable.subscribe({
    next(value) { console.log('value: ', value); },
    complete() {
        console.log('done');
        subscription.unsubscribe();
    }
});
