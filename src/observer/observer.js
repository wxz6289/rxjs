import { Observable } from "rxjs";

const observer = {
  next(value) {
    console.log("on next:", value);
  },
  error(err) {
    console.error("on error:", err);
  },
  complete() {
    console.log("on complete");
  }
};

const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

observable.subscribe(observer);