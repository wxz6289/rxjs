import { Map } from 'immutable';

const map1 = Map({ a: 1, b: 2, c: 3});
const map3 = Map({ a: 1, b: 2, c: 3});
const map2 = map1.set('b', 50);
const map4 = map3.set('b', 2);
const map5 = map3;
console.log(map1.get('b'), map2.get('b'));
console.log(map1.equals(map3));
console.log(map1 === map2);
console.log(map1 == map3);

console.log(map3 === map4);
console.log(map4 === map5);

const keys = map1.map((v, k) => k.toUpperCase()).join();

console.log(keys);









