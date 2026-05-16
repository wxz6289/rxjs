import { Map, List } from 'immutable';

const m1 = Map({a: 1, b: 2, c: 3, d: 4});
const m2 = Map({ c: 10, a: 20, t: 30});
const o = { d: 100, o: 200, g: 300};
const m3 = m1.merge(m2, o);
console.log(m3);

const l1 = List([1, 2, 3]);
const l2 = List([4, 5, 6]);
const l3 = l1.concat(l2);
console.log(l3);

