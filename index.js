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
 * @global
 * @since 0.2.0
 */

/**
 * An object representating options to configure the temporary file or directory
 * creation within this module.
 *
 * @typedef  {Object}  TempPathOptions
 * @property {boolean} [asFile=false] - Whether to create a temporary file instead directory.
 * @property {string}  [ext='.tmp'] - An extension name to use for tempoarary file creation.
 *                                    Ignored if the `asFile` is set to `false`.
 * @property {number}  [maxLen=32] - The maximum characters' length of the generated temporary
 *                                   directory or file name.
 * @global
 * @since  0.3.0
 */


// Alternative for `node:util.isNullOrUndefined`
function isNullOrUndefined(o) {
  return (o === null || typeof o === 'undefined');
}

/**
 * Retrieves the temporary directory path based on the current environment.
 *
 * This function first checks common environment variables for temporary directories:
 * - `TMPDIR` on UNIX-like and macOS systems
 * - `TMP` or `TEMP` on Windows systems
 * 
 * If none of these environment variables are set or return null, it falls back to the 
 * `os.tmpdir()` function. If this also returns null, it uses the current working directory 
 * and creates a new directory called `tmp`.
 *
 * @private
 * @function
 * @returns {string} The temporary directory path.
 * @since 0.1.0
 */
function __getTempDir() {
  return process.env.TMPDIR                   // Unix-like & MacOS systems
    || (process.env.TMP || process.env.TEMP)  // Windows system
    || require('node:os').tmpdir()            // Fallback
    || path.resolve(process.cwd(), 'tmp');    // Otherwise, use current directory
}


/**
 * Generates a temporary path based on the provided or system temporary directory.
 * 
 * This function utilizes a random UUID for the directory name, ensuring that each time
 * it is called, the path will be different from previous calls. The returned path can be
 * used for either a temporary file or directory, according to user preferences.
 *
 * To limit the characters' length of generated temporary directory or file name,
 * set the `maxLen` to the desired value and it must be a positive number.
 * Thus, the function will trim the name to the desired maximum length.
 *
 * @public
 * @function
 * @param {string} [tmpdir] - The temporary directory path. If not provided or empty,
 *                            it defaults to the system's temporary directory.
 * @param {number} [maxLen=32] - The maximum characters' length of the generated temporary path.
 *                            Must be a positive number and greater than zero.
 *
 * @returns {string} The generated temporary path.
 *
 * @throws {TypeError} Throws a `TypeError` if the provided `tmpdir` is not a string.
 * @throws {RangeError} If the given `maxLen` is less than or equal to zero.
 *
 * @since 0.1.0
 */
function getTempPath(tmpdir, maxLen) {
  if (tmpdir && typeof tmpdir !== 'string') {
    throw new TypeError(`Expected type is string. Received ${typeof tmpdir}`);
  }
  if (maxLen <= 0) {
    throw new RangeError('Maximum characters must be greater than zero');
  }

  return path.join(
    (isNullOrUndefined(tmpdir) || tmpdir.length === 0) ? __getTempDir() : tmpdir,
    randomUUID().replace(/-/g, '').substr(0, maxLen)
  );
}

/**
 * Asynchronously creates a temporary path, either as a directory or file,
 * based on the provided or system temporary directory.
 *
 * This function utilizes the {@link module:temppath~getTempPath|getTempPath} function.
 * To limit the characters' length of generated temporary directory or file name,
 * set the {@link TempPathOptions.maxLen `options.maxLen`} to the desired value and
 * it must be a positive number. Thus, the function will trim the name to the desired
 * maximum length.
 *
 * @public
 * @async
 * @function
 * @param {string | TempPathOptions | CreateTempPathCallback} [tmpdir] - The temporary directory path.
 *                                   If an object is provided, it is treated as the `options` parameter.
 *                                   If a function is provided, it is treated as the `callback` parameter,
 *                                   and `tmpdir` will fallback to system-based temporary directory.
 * @param {TempPathOptions | CreateTempPathCallback} [options] - Options for creating the temporary path.
 *                                   If a function is provided, it is treated as the `callback` parameter,
 *                                   and `options` is set to `{}` (an empty object).
 * @param {boolean} [options.asFile=false] - If `true`, create a temporary file. Otherwise, create a directory.
 * @param {string} [options.ext='.tmp'] - The extension for the temporary file. If `asFile` option is `false`,
 *                                        this option will be ignored. Default is '.tmp'.
 * @param {number} [options.maxLen=32] - The maximum characters' length of the generated directory or file name.
 *                                       Defaults to 32 characters.
 * @param {CreateTempPathCallback} callback - A callback function to handle the result path or error.
 *                                            This is crucial and required, even when you wanted to omit all arguments.
 *
 * @throws {TypeError} If the given arguments or the extension name specified with incorrect type.
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
    tmpdir = null;       // Keep this empty
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
  if (options && typeof options !== 'object') {
    throw new TypeError(
      `The "options" argument must be an object. Received ${typeof options}`);
  }
  if (options.ext && typeof options.ext !== 'string') {
    throw new TypeError(`Expected a string extension, got ${typeof options.ext}`);
  }
  if (options.maxLen && typeof options.maxLen !== 'number') {
    throw new TypeError(`Expected a number for maxLen, got ${typeof options.maxLen}`);
  }

  // Resolve the temporary path
  tmpdir = getTempPath(tmpdir, options.maxLen);

  const extension = (options.ext)
    ? options.ext.startsWith('.')
      ? options.ext
      : `.${options.ext}`
    // Use default extension, if the extension name is not specified
    // * feat: Add support for temporary file creation with no extension
    : ((typeof options.ext === 'string' && options.ext.length === 0)
      ? options.ext
      : '.tmp'
    );

  // Create the parent directory of generated temporary path
  fs.promises.mkdir(path.dirname(tmpdir), { recursive: true })
    .then(function () {
      if (options.asFile) {
        const filename = tmpdir + extension;
        // Create an empty file in the temporary directory
        fs.promises.writeFile(filename, '')
          .then(() => callback(null, filename))  // Return the created the temporary file path
          .catch(err => callback(err));
      } else {
        // Create an empty directory in the temporary directory
        fs.promises.mkdir(tmpdir)
          .then(() => callback(null, tmpdir))  // Return the created temporary directory path
          .catch(err => callback(err));
      }
    })
    .catch(err => callback(err));
}

/**
 * Synchronously creates a temporary path, either as a directory or file, based on the provided
 * or system temporary directory and then returns a path that refers to the generated temporary directory or file.
 *
 * This function utilizes the {@link module:temppath~getTempPath|getTempPath} function.
 * To limit the characters' length of generated temporary directory or file name,
 * set the {@link TempPathOptions.maxLen `options.maxLen`} to the desired value and
 * it must be a positive number. Thus, the function will trim the name to the desired
 * maximum length.
 *
 * @public
 * @function
 * @param {string | TempPathOptions} [tmpdir] - The temporary directory path. If an object is provided,
 *                                   it is treated as the `options` parameter,
 *                                   and `tmpdir` will fallback to system-based temporary directory.
 * @param {Object} [options] - Options for creating the temporary path.
 * @param {boolean} [options.asFile=false] - If `true`, create a temporary file. Otherwise, create a directory.
 * @param {string} [options.ext='.tmp'] - The extension for the temporary file. If `asFile` option is `false`,
 *                                        this option will be ignored. Default is `'.tmp'`.
 * @param {number} [options.maxLen=32] - The maximum characters' length of the generated directory or file name.
 *                                       Defaults to 32 characters.
 *
 * @returns {string} The path of the created temporary directory or file.
 *
 * @throws {TypeError} If the given arguments or the extension name specified with incorrect type.
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
  if (options.ext && typeof options.ext !== 'string') {
    throw new TypeError(`Expected a string extension, got ${typeof options.ext}`);
  }
  if (options.maxLen && typeof options.maxLen !== 'number') {
    throw new TypeError(`Expected a number for maxLen, got ${typeof options.maxLen}`);
  }

  // Resolve the temporary path
  tmpdir = getTempPath(tmpdir, options.maxLen);

  const extension = (options.ext)
    ? options.ext.startsWith('.')
      ? options.ext
      : `.${options.ext}`
    // Use default extension, if the extension name is not specified
    // * feat: Add support for temporary file creation with no extension
    : ((typeof options.ext === 'string' && options.ext.length === 0)
      ? options.ext
      : '.tmp'
    );

  try {
    // Create the parent directory of generated temporary path
    fs.mkdirSync(path.dirname(tmpdir), { recursive: true });

    if (options.asFile) {
      const filename = tmpdir + extension;
      fs.writeFileSync(filename, '');  // Create an empty temporary file
      return filename;  // Return the created temporary file path
    }

    // Create a temporary directory with synchronous operation
    fs.mkdirSync(tmpdir);
    return tmpdir;  // Return the created temporary directory path
  } catch (err) {
    // Throw a new error with source error as causative error
    throw new Error(
      `temppath: Failed to create temporary ${
        (options.asFile) ? 'file' : 'directory'
      }.`, { cause: err }
    );
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
