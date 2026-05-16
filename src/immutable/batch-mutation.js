import { List } from 'immutable';
import assert from 'assert';

const l1 = List([1, 2, 3]);
const l2 = l1.withMutations(l => {
    l.push(4).push(5).push(6);
});

assert.equal(l1.size, 3);
assert.equal(l2.size, 6);
