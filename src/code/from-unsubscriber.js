import { from } from 'rxjs';

const observable = from([10, 20, 30]);

const subscription = observable.subscribe(console.log);
subscription.unsubscribe();