/**
 * ESModule test.
 * @author Ryuu Mitsuki
 */

import fs from 'node:fs';
import assert from 'node:assert';
import path from 'node:path';
import { isNullOrUndefined } from 'node:util';
import temppath from '../index.js';
// Or:
// import { default as temppath } from '../index.js';

const rootDir = path.resolve(process.cwd()),
      rootDirTmp = path.join(rootDir, 'tmp'),
      systemRootDirTmp = path.dirname(temppath.getTempPath());

/*--------
 * TESTS
 ---------*/

/*---------------
 * Test Imports
 ----------------*/

assert.equal(typeof temppath.getTempPath, 'function');
assert.equal(typeof temppath.createTempPath, 'function');
assert.equal(typeof temppath.createTempPathSync, 'function');
assert.throws(function () {
    // Test the inextensibility of 'temppath' module
    // In ESModule, we do not need to declare 'use strict' to make code below
    // throws an error, it is enabled by default.
    Object.defineProperty(temppath, 'foo', { value: 'bar' });
}, Error);

/*---------------------
 * Test `getTempPath`
 ----------------------*/

const tmpPath = temppath.getTempPath();  // Generate a temporary path

assert.ok(!isNullOrUndefined(tmpPath));
assert.equal(typeof tmpPath, 'string');
assert.ok(path.isAbsolute(tmpPath));
assert.notEqual(tmpPath, temppath.getTempPath());
assert.throws(function () {
    temppath.getTempPath([ 'error test' ]);
}, TypeError);

console.info('Test `getTempPath` passed.\n');

/*------------------------
 * Test `createTempPath`
 -------------------------*/

/**
 * Stores all promise-based tests of `createTempPath` function.
 */
const createTempPathTests = Promise.all([
    new Promise(function (resolve, reject) {
        // Test using system's root temporary path
        temppath.createTempPath(function (err, outPath) {
            if (err) { reject(err); return }
            
            assert.ok(!isNullOrUndefined(outPath));
            assert.equal(path.dirname(outPath), systemRootDirTmp);
            console.info('Async created path:', outPath);
            
            // Delete the created temporary directory
            if (fs.existsSync(outPath)) fs.rmdirSync(outPath);
            console.info('Async deleted path:', outPath);
            resolve();
        });
    }),
    new Promise(function (resolve, reject) {
        // Test using custom root temporary path
        temppath.createTempPath(rootDirTmp, function (err, outPath) {
            if (err) { reject(err); return }
            
            assert.ok(!isNullOrUndefined(outPath));
            assert.equal(path.dirname(outPath), rootDirTmp);
            console.info('Async created path:', outPath);
            
            // Delete the created temporary directory
            if (fs.existsSync(outPath)) fs.rmdirSync(outPath);
            console.info('Async deleted path:', outPath);
            resolve();
        });
    }),
    new Promise(function (resolve, reject) {
        // Test temporary file creation
        temppath.createTempPath({ asFile: true, ext: 'test' }, function (err, outPath) {
            if (err) { reject(err); return }
            
            assert.ok(!isNullOrUndefined(outPath));
            assert.ok(outPath.endsWith('.test'));
            assert.equal(path.dirname(outPath), systemRootDirTmp);
            console.info('Async created path:', outPath);
            
            // Delete the created temporary file
            if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
            console.info('Async deleted path:', outPath);
            resolve();
        });
    })
]);


/*----------------------------
 * Test `createTempPathSync`
 -----------------------------*/

let outTmpPath;

{
    // Test using system's root temporary path
    outTmpPath = temppath.createTempPathSync(/* Use system default */);
    assert.ok(!isNullOrUndefined(outTmpPath));
    assert.equal(path.dirname(outTmpPath), systemRootDirTmp);
    console.info('Created path:', outTmpPath);
    
    // Delete the created temporary directory
    if (fs.existsSync(outTmpPath)) {
        fs.rmdirSync(outTmpPath);
        console.info('Deleted path:', outTmpPath);
    }
}

{
    // Test using custom root temporary path
    outTmpPath = temppath.createTempPathSync(rootDirTmp);
    assert.ok(!isNullOrUndefined(outTmpPath));
    assert.equal(path.dirname(outTmpPath), rootDirTmp);
    console.info('Created path:', outTmpPath);
    
    // Delete the created temporary directory
    if (fs.existsSync(outTmpPath)) {
        fs.rmdirSync(outTmpPath);
        console.info('Deleted path:', outTmpPath);
    }
}

{
    // Test temporary file creation
    outTmpPath = temppath.createTempPathSync({ asFile: true, ext: 'test' });
    assert.ok(!isNullOrUndefined(outTmpPath));
    assert.ok(outTmpPath.endsWith('.test'));
    assert.equal(path.dirname(outTmpPath), systemRootDirTmp);
    console.info('Created path:', outTmpPath);
    
    // Delete the created temporary file
    if (fs.existsSync(outTmpPath)) {
        fs.unlinkSync(outTmpPath);
        console.info('Deleted path:', outTmpPath);
    }
}

console.info('Test `createTempPathSync` passed.\n');

// Wait until all promises in `createTempPathTests` done
createTempPathTests.then(function () {
    console.info('Test `createTempPath` passed.\n');
    console.info('All tests passed.\n');
}).catch(function (err) {
    console.error(err);
    assert.fail(err);
});
