import assert from 'assert';
import { Map, is } from 'immutable';
const o1 = { a: 1, b: 2, c: 3};
const o2 = { a: 1, b: 2, c: 3};
console.log(o1 !== o2);

const m1 = Map(o1);
const m2 = Map(o2);
console.log(m1 !== m2);
console.log(m1.equals(m2));
console.log(is(m1, m2));




