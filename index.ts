import { of, fromEvent, BehaviorSubject, iif } from "rxjs";
import {
  delay,
  repeatWhen,
  mergeMap,
  tap,
  repeat,
  takeUntil,
  switchMap,
  takeWhile, filter, catchError
} from "rxjs/operators";

let count = 0;
const startPoll = new BehaviorSubject(false);
const documentClick = fromEvent(document, "click").pipe(
  tap(() => console.log("clicked"))
);

const request = of(count).pipe(
  tap(() => console.log("requesting...")),
  delay(2000),
  tap(() => console.log("requested " + count++)),
  tap(() => {if(count === 5) throw count}),
);

const polling = of({}).pipe(
  tap(() => console.log("waiting...")),
  delay(2000),
  switchMap(() => request),
  catchError((e) => { console.log('error at', e); throw e; }),
  repeat(),
  takeWhile(() => count < 10),
  //repeatWhen(() => startPoll),
  //tap(() => count++ < 5 ? startPoll.next(true) : startPoll.complete()),
);

console.log('start');
polling.subscribe();
