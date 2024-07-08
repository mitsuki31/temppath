/**
 * Main entry of `temppath` module.
 * @module temppath
 * @author Ryuu Mitsuki
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
// Should be avoid due to deprecated
// const { isNullOrUndefined } = require('node:util');


/**
 * Callback function to handle the result or error from calling the
 * {@link module:temppath~createTempPath|createTempPath} function.
 *
 * @callback CreateTempPathCallback
 * @param {?Error} error - An error object if an error occurred, or `null` if no error.
 * @param {string} resultPath - The path of the created temporary directory or file.
 * @since 0.2.0
 */


// Alternative for `node:util.isNullOrUndefined`
function isNullOrUndefined(o) {
  return (o === null || typeof o === 'undefined');
}

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
 * @since 0.1.0
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
 * @since 0.1.0
 */
function getTempPath(tmpdir) {
  if (tmpdir && typeof tmpdir !== 'string') {
    throw new TypeError(`Expected type is string. Received ${typeof tmpdir}`);
  }

  return path.join(
    (isNullOrUndefined(tmpdir) || tmpdir.length === 0) ? __getTempDir() : tmpdir,
    randomUUID().replace(/-/g, '')
  );
}

/**
 * Asynchronously creates a temporary path, either as a directory or file,
 * based on the provided or system temporary directory.
 *
 * This function utilizes the {@link module:temppath~getTempPath|getTempPath} function.
 *
 * @public
 * @async
 * @function
 * @param {string|Object|module:temppath~CreateTempPathCallback} [tmpdir] - The temporary directory path.
 *                                   If an object is provided, it is treated as the `options` parameter.
 *                                   If a function is provided, it is treated as the `callback` parameter,
 *                                   and `tmpdir` is set to `null`.
 * @param {Object|module:temppath~CreateTempPathCallback} [options] - Options for creating the temporary path.
 *                                   If a function is provided, it is treated as the `callback` parameter,
 *                                   and `options` is set to `{}` (an empty object).
 * @param {boolean} [options.asFile=false] - If `true`, create a temporary file. Otherwise, create a directory.
 * @param {string} [options.ext='.tmp'] - The extension for the temporary file. If `asFile` option is `false`,
 *                                        this option will be ignored. Default is '.tmp'.
 * @param {module:temppath~CreateTempPathCallback} callback - A callback function to handle the result path or error.
 *                                                            This is crucial and required, even when you wanted to omit all arguments.
 *
 * @example <caption>Only specify a callback function</caption>
 * // Without any argument but a callback function
 * // This will create a temporary directory in system's temporary path
 * createTempPath(function (err, createdPath) {
 *   if (err) console.error(err);
 *   else console.log(createdPath);
 *   // Unix: "$TMPDIR/<TEMPPATH_DIR>"
 *   // Termux Android: "$TMPDIR/<TEMPPATH_DIR>" or "$PREFIX/tmp/<TEMPPATH_DIR>"
 *   // Windows: "%TMP%\<TEMPPATH_DIR>" or "%TEMP%\<TEMPPATH_DIR>"
 * });
 *
 * @example <caption>Create a temporary file in system's temporary path</caption>
 * // This will create a temporary file in system's temporary path
 * // with extension name of '.foo_temp'
 * createTempPath({ asFile: true, ext: 'foo_temp' }, function (err, createdPath) {
 *   if (err) console.error(err);
 *   else console.log(createdPath);
 *   // Unix: "$TMPDIR/<TEMPPATH_FILE>.foo_temp"
 *   // Termux Android: "$TMPDIR/<TEMPPATH_FILE>.foo_temp" or "$PREFIX/tmp/<TEMPPATH_FILE>.foo_temp"
 *   // Windows: "%TMP%\<TEMPPATH_FILE>.foo_temp" or "%TEMP%\<TEMPPATH_FILE>.foo_temp"
 * });
 *
 * @example <caption>Create a temporary file in current directory</caption>
 * const path = require('node:path');
 * // For ESM: import path from 'node:path';
 *
 * // Use `process.cwd()` to get current directory path
 * createTempPath(path.join(process.cwd(), 'tmp'), { asFile: true }, function (err, createdPath) {
 *   if (err) console.error(err);
 *   else console.log(createdPath);
 *   // Unix: "$PWD/tmp/<TEMPPATH_FILE>.tmp"
 *   // Termux Android: "$PWD/tmp/<TEMPPATH_FILE>.tmp"
 *   // Windows: "%CD%\tmp\<TEMPPATH_FILE>.tmp"
 * });
 *
 * @since 0.2.0
 */
function createTempPath(tmpdir, options, callback) {
    if ((typeof tmpdir === 'object' && !Array.isArray(tmpdir))
            && typeof options === 'function' && isNullOrUndefined(callback)) {
        callback = options;  // Swap the `options` to `callback`
        options = tmpdir;    // Swap the `tmpdir` to `options`
        tmpdir = null;       // Make this empty
    } else if (!isNullOrUndefined(tmpdir) && typeof options === 'function'
            && isNullOrUndefined(callback)) {
        callback = options;
        options = {};
    } else if (typeof tmpdir === 'function' && isNullOrUndefined(options)
            && isNullOrUndefined(callback)) {
        callback = tmpdir;
        options = {};
        tmpdir = null;
    } else if (isNullOrUndefined(options)) {
        options = {};
    }
    
    if (!callback || typeof callback !== 'function') {
        throw new TypeError(
            `The "callback" argument must be a function. Received ${typeof callback}`);
    }
    
    if (typeof options !== 'object') {
        throw new TypeError(
            `The "options" argument must be an object. Received ${typeof options}`);
    }
    
    // Resolve the root temporary path
    tmpdir = getTempPath(tmpdir);
    
    // Default extension name for the extension of temporary file
    const defaultExt = '.tmp';
    let extension;
    
    if (options.ext && typeof options.ext === 'string') {
        extension = options.ext.startsWith('.')
            ? options.ext
            : (options.ext === '' ? defaultExt : '.' + options.ext);
    } else {
        // Use default extension, if user not provided the extension name
        extension = defaultExt;
    }
        
    // Create a new temporary directory, if `asFile` is false
    if (!options.asFile) {
        fs.mkdir(tmpdir, { recursive: true }, function (err) {
            if (err) {
                callback(err);
                return;
            }
            
            callback(null, tmpdir);
        });
    }
    // Otherwise, create as a temporary file
    else {
        fs.mkdir(path.dirname(tmpdir), { recursive: true }, function (err) {
            if (err) {
                callback(err);
                return;
            }
            
            const filename = tmpdir + extension;
            fs.writeFile(filename, '', function (errWrite) {
                if (errWrite) {
                    callback(errWrite);
                    return;
                }
                
                callback(null, filename);
            });
        });
    }
}

/**
 * Synchronously creates a temporary path, either as a directory or file, based on the provided
 * or system temporary directory and then returns a path that refers to the generated temporary directory or file.
 *
 * This function utilizes the {@link module:temppath~getTempPath|getTempPath} function.
 *
 * @public
 * @function
 * @param {string|Object} [tmpdir] - The temporary directory path. If an object is provided,
 *                                   it is treated as the `options` parameter, and `tmpdir` is set to null.
 * @param {Object} [options] - Options for creating the temporary path.
 * @param {boolean} [options.asFile=false] - If `true`, create a temporary file. Otherwise, create a directory.
 * @param {string} [options.ext='.tmp'] - The extension for the temporary file. If `asFile` option is `false`,
 *                                        this option will be ignored. Default is '.tmp'.
 * @returns {string} The path of the created temporary directory or file.
 *
 * @throws {TypeError} Throws a `TypeError` if the provided `tmpdir` or `options` is not of the correct type.
 * @throws {Error} Throws an `Error` if there is an issue creating the temporary directory or file.
 *
 * @example <caption>Call the function without any argument</caption>
 * // If no argument specified, it will creates a temporary directory
 * // in system's temporary path
 * const tmpDirPath = createTempPathSync();
 * console.log(tmpDirPath);
 * // Unix: "$TMPDIR/<TEMPPATH_DIR>"
 * // Termux Android: "$TMPDIR/<TEMPPATH_DIR>" or "$PREFIX/tmp/<TEMPPATH_DIR>"
 * // Windows: "%TMP%\<TEMPPATH_DIR>" or "%TEMP%\<TEMPPATH_DIR>"
 *
 * @example <caption>Create a temporary file with custom extension</caption>
 * const tmpFilePath = createTempPathSync({ asFile: true, ext: 'txt' });
 * console.log(tmpFilePath);
 * // Unix: "$TMPDIR/<TEMPPATH_FILE>.txt"
 * // Termux Android: "$TMPDIR/<TEMPPATH_FILE>.txt" or "$PREFIX/tmp/<TEMPPATH_FILE>.txt"
 * // Windows: "%TMP%\<TEMPPATH_FILE>.txt" or "%TEMP%\<TEMPPATH_FILE>.txt"
 *
 * @example <caption>Create a temporary file in current directory</caption>
 * const path = require('node:path');
 * // For ESM: import path from 'node:path';
 *
 * // Use `process.cwd()` to get current directory path
 * const customTmpFilePath = createTempPathSync(
 *   path.join(process.cwd(), 'tmp'), { asFile: true });
 * console.log(customTmpFilePath);
 * // Unix: "$PWD/tmp/<TEMPPATH_FILE>.tmp"
 * // Termux Android: "$PWD/tmp/<TEMPPATH_FILE>.tmp"
 * // Windows: "%CD%\tmp\<TEMPPATH_FILE>.tmp"
 *
 * @since 0.2.0
 */
function createTempPathSync(tmpdir, options) {
    // Swap the 'tmpdir' argument to 'options', if the provided is an object
    // and the 'options' argument is undefined or empty
    if (typeof tmpdir === 'object' && !Array.isArray(tmpdir)
            && isNullOrUndefined(options)) {
        options = tmpdir;  // Swap
        tmpdir = null;     // Make this empty
    } else if (isNullOrUndefined(options)) {
        // By using this approach, all paramaters will be optional.
        // Users can simply call this function without any argument and with no error.
        options = {};
    }
    
    if (typeof options !== 'object') {
        throw new TypeError(
            `The "options" argument must be an object. Received ${typeof options}`);
    }
    
    // Resolve the root temporary path
    tmpdir = getTempPath(tmpdir);
    
    // Default extension name for the extension of temporary file
    const defaultExt = '.tmp';
    let extension;
    
    if (options.ext && typeof options.ext === 'string') {
        extension = options.ext.startsWith('.')
            ? options.ext
            : (options.ext === '' ? defaultExt : '.' + options.ext);
    } else {
        // Use default extension, if user not provided the extension name
        extension = defaultExt;
    }
    
    try {
        // Create a new temporary directory, if `asFile` is false
        if (!options.asFile) {
            fs.mkdirSync(tmpdir, { recursive: true });
            
            // Return the created temporary directory path
            return tmpdir;
        }
        // Otherwise, create as a temporary file
        else {
            const filename = tmpdir + extension;
            fs.mkdirSync(path.dirname(tmpdir), { recursive: true });
            fs.writeFileSync(filename, '');
            
            // Return the created temporary file path
            return filename;
        }
    } catch (error) {
        let msg = 'temppath: Failed to create temporary ';
        if (options.asFile) {
            msg += 'file.';
        } else {
            msg += 'directory.';
        }
        // Throw a new error with main error as cause error
        throw new Error(msg, { cause: error });
    }
}


/*----------
 * EXPORTS
 ----------*/

// Create a frozen object used for exports
const temppath = Object.freeze({
    getTempPath,
    createTempPath,
    createTempPathSync
});

// For CommonJS
if (!isNullOrUndefined(module)) {
    Object.defineProperty(module, 'exports', {
        value: Object.isFrozen(temppath) ? temppath : Object.freeze(temppath),
        writable: false
    });
}

// For ESModule
if (!isNullOrUndefined(exports) && typeof exports === 'object') {
    // Export the 'temppath' as default export
    Object.defineProperty(exports, 'default', {
        value: Object.isFrozen(temppath) ? temppath : Object.freeze(temppath),
        writable: false
    });
    
    exports.getTempPath = getTempPath;
    exports.createTempPath = createTempPath;
    exports.createTempPathSync = createTempPathSync;
}
