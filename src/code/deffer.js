import { defer, lastValueFrom, Observable, timer } from "rxjs";

const deferObservable = defer(() => {
  return new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    timer(1000).subscribe(() => {
      subscriber.next(3);
      subscriber.complete();
    });
  });
});

async function getDeferredValue() {
  const result = await lastValueFrom(deferObservable);
  console.log("differed value: ",result);
}

getDeferredValue()