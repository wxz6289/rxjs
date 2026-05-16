import { Seq, Map, Range, fromJS } from 'immutable';

const o = { a: 1, b: 2, c: 3};

const s = Seq(o).map(x => x * x).toObject();
console.log(s);

const obj = { 1: "one"};
console.log(Object.keys(obj));
console.log(obj["1"], obj[1]);

const m = fromJS(obj);
console.log(m.get("1"), m.get(1));

const oddSqures = Seq([1,2,3,4,5,6,7,8,9])
    .filter(x => x % 2 !== 0)
    .map(x => x * x);
console.log(oddSqures);
console.log(oddSqures.get(1));

const map = Map(o);
const lazySeq = Seq(map);
const lz = lazySeq.flip()
.map(key => key.toUpperCase())
.flip();
console.log(lz);

const range = Range(1, Infinity)
    .skip(1000)
    .map(n => -n)
    .filter(n => n % 2 === 0)
    .take(2)
    .reduce((r, n) => r * n, 1);
console.log(range);







