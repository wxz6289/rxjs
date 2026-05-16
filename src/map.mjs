import { Observable } from "rxjs";

function map(project){
    return new Observable(subscriber => {
        const sub = subscriber.subscribe({
            next: value => {
                try {
                    subscriber.next(project(value));
                } catch (error) {
                    subscriber.error(error);
                }
            },
            error: err => subscriber.error(error),
            complete: () => subscriber.complete()
        });
        return {
            unsubscribe: () => {
                sub.unsubscribe();
            }
        }
    })
}

const t = [23, 45, 21, 65];
const m = map((t) => x*2);
m.subscribe(console.log);