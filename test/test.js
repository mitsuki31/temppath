/**
 * CommonJS test.
 * @author Ryuu Mitsuki
 */

const assert = require('node:assert');
const path = require('node:path');
const getTempPath = require('./index.js');

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
