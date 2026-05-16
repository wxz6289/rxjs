import { List, Map, Set } from 'immutable';
const l = List([1,2,3]);
const a = [0, ...l, 4, 5];
console.log(a);

const m1 = Map({ a: 1, b: 2, c: 3});
const m2 = Map({ a: 1, b: 2, c: 3});

const s = Set().add(m1);
console.log(s.has(m2));
console.log(s);

const u1 = m1.set('b', 100);
console.log(m1 !== u1);
const u2 = m1.set('b', 100);
console.log(u1 !== u2 );
console.log(u1.equals(u2));




