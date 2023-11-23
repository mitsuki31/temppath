/**
 * Main entry of 'tempath' module.
 * @author Ryuu Mitsuki
 */

'use strict';

const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { isNullOrUndefined } = require('node:util');

/**
 * Gets the temporary directory path based on the environment.
 *
 * This function checks common environment variables for temporary directories,
 * such as TMPDIR on Unix-like and MacOS systems, and TMP/TEMP on Windows.
 * If no environment variable is set, it defaults to a 'tmp' directory
 * within the current working directory.
 *
 * @private
 * @function
 * @returns {string} The temporary directory path.
 */
function __getTempDir() {
    return process.env.TMPDIR                     // Unix-like & MacOS systems
        || (process.env.TMP || process.env.TEMP)  // Windows system
        || path.resolve(process.cwd(), 'tmp');    // Default path
}


/**
 * Generates a temporary path based on the provided or system temporary directory.
 * 
 * This function utilizes a random UUID for the directory name, ensuring that each time
 * it is called, the path will be different from previous calls. The returned path can be
 * used for either a temporary file or directory, according to your preferences.
 *
 * @public
 * @function
 * @param {string} [tmpdir] - The temporary directory path. If not provided or empty,
 *                            it defaults to the system's temporary directory.
 * @returns {string} The generated temporary path.
 * @throws {TypeError} Throws a `TypeError` if the provided `tmpdir` is not a string.
 */
function getTempPath(tmpdir) {
    if (tmpdir && typeof tmpdir !== 'string') {
        throw new TypeError(
            `Expected type is 'string', received '${typeof tmpdir}'`);
    }
    
    if (!tmpdir || (typeof tmpdir === 'string' && tmpdir.length === 0)) {
        // Get system's temporary directory
        tmpdir = __getTempDir();
    }
    
    return path.join(tmpdir, randomUUID().replace(/-/g, ''));
}

/*----------
 * EXPORTS
 ----------*/

// For CommonJS
if (!isNullOrUndefined(module)) {
    // Export the 'getTempPath' function as default export
    module.exports = getTempPath;
}

// For ESModule
if (!isNullOrUndefined(exports) && typeof exports === 'object') {
    // Export the 'getTempPath' function as default export
    exports.default = getTempPath;
}
