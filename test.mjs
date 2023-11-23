/**
 * ESModule test.
 * @author Ryuu Mitsuki
 */

import assert from 'node:assert';
import path from 'node:path';
import getTempPath from './index.js';
// Or:
// import { default as getTempPath } from './index.js';

const tempPath = getTempPath();  // Generate a temporary path

/*--------
 * TESTS
 ---------*/

assert.equal(typeof getTempPath, 'function');
assert.notEqual(tempPath, null);
assert.equal(typeof tempPath, 'string');
assert.notEqual(tempPath, getTempPath());
assert.ok(path.isAbsolute(tempPath));
assert.throws(function () {
    getTempPath([ 'error test' ]);
}, TypeError);

console.info('All tests passed.');
