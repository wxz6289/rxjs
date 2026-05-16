import { List } from 'immutable';
import assert from 'assert';
const l1 = List([1,2]);
const l2 = l1.push(3, 4, 5);
const l3 = l2.unshift(0);
const l4 = l1.concat(l2, l3);

assert.equal(l1.size, 2);
assert.equal(l2.size, 5);
assert.equal(l3.size, 6);
assert.equal(l4.size, 13);
assert.equal(l4.get(0),1);