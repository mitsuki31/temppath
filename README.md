# temppath

A lightweight and multi-platform Node.js module designed to create temporary files
and directories. It can utilize the system's default temporary path or a user-specified
directory, offering flexibility and ease of use across different environments.

This module leverages system environment variables to determine the temporary directory
and will fallback to the built-in function [`os.tmpdir()`](https://nodejs.org/api/os.html#os_os_tmpdir)
if the module is incapable determine the temporary directory provided by the system.

Here’s a detailed example demonstrating how to create a temporary directory using this module:

```javascript
const temppath = require('@mitsuki31/temppath');

temppath.createTempPath((err, tempDir) => {
  if (err) console.error('Error creating temporary directory:', err);
  else console.log('Created temporary directory:', tempDir);
});
```

And here’s how you can create a temporary file:

```javascript
const temppath = require('@mitsuki31/temppath');

temppath.createTempPath({ asFile: true }, (err, tempFile) => {
  if (err) console.error('Error creating temporary file:', err);
  else console.log('Created temporary file:', tempFile);
});
```

In the examples above:
- The first snippet creates a temporary directory within the system's default temporary path.
- The second snippet creates a temporary file within the same system-based temporary path.

It's that simple! With just a few lines of code, `temppath` allows you to handle temporary
file and directory creation effortlessly.

If you don't like callback-based function and want the `createTempPath` function as a
promise-based function. Try to promisify it using `util.promisify` function, like this:

```javascript
const { promisify } = require('node:util');
const temppath = require('@mitsuki31/temppath');
// Promisify the function
const createTempPath = promisify(temppath.createTempPath);

(async () => {  // Need this block if use CommonJS module
  // Create a temporary file in current directory with extension '.foo' and
  // limit the maximum file name's length to 20 characters
  const tempFile = await createTempPath('.', {
    asFile: true,
    ext: 'foo',
    maxLen: 20
  });
  console.log(tempFile);
  // Output: b3du3b2156sb36bo9hgi.foo
})();
```

## About System Temporary Directory

On different operating systems, the path to the temporary directory is specified by
various environment variables. These paths are used by the operating system and
applications to store temporary files. Below are the details for each operating system:

### Linux and macOS

On Linux and macOS systems, the temporary directory path is provided by the environment
variable `TMPDIR`. This variable is widely recognized and used by applications for
temporary storage. If `TMPDIR` is not set, applications may fallback to using standard
directories such as `/tmp`.

You can check the temporary path provided by the system echoing the `TMPDIR` environment variable:
```bash
echo $TMPDIR
```

### Windows

On Windows systems, there are two primary environment variables that typically store
the path to the temporary directory: `TEMP` and `TMP`. Both variables usually point
to the same directory and are used interchangeably by the operating system and
applications to store temporary files.

You can check the temporary path provided by the system using this command:
```pwsh
echo $env:TMP
echo $env:TEMP
```

If you're using Command Prompt try this instead:
```cmd
echo %TMP%
echo %TEMP%
```

In summary, these environment variables ensure that temporary files are stored in a standard
location that can be easily accessed and cleaned up by the system or applications.

## APIs

<h3 id="getTempPath"><!-- Need some newlines -->

`getTempPath` (Function)</h3>

```ts
function getTempPath(tmpdir?: string, maxLen?: number = 32): string
```

Generates a temporary path based on the provided or system temporary directory.

This function utilizes a random UUID for the directory name, ensuring that each time
it is called, the path will be different from previous calls. The returned path can be
used for either a temporary file or directory, according to your preferences.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tmpdir` | `string` | The temporary directory to be used. If not provided or empty, it defaults to the system's temporary directory. |
| `maxLen` | `number` | The maximum characters' length of the generated temporary path. |

#### Returns

A string representing a generated temporary path with a random UUID that can be used
as temporary file or directory name.

**Type:** `string`

#### Throws

- `TypeError`  
  Throws a `TypeError` if the provided `tmpdir` is not a string.

- `RangeError`  
  If the given `maxLen` is less than or equal to zero.

### `createTempPath` (Function)

```ts
function createTempPath(
  tmpdir?: string | TempPathOptions | CreateTempPathCallback,
  options?: TempPathOptions | CreateTempPathCallback,
  callback: CreateTempPathCallback
): void
```

Asynchronously creates a temporary path, either as a directory or file,
based on the provided or system temporary directory.

This function utilizes the [getTempPath](#getTempPath) function.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tmpdir` | `string` \| [`TempPathOptions`] \| [`CreateTempPathCallback`] | The temporary directory path. If an object is provided, it is treated as the `options` parameter. If a function is provided, it is treated as the `callback` parameter, and `tmpdir` will fallback to the temporary directory provided by the system. |
| `options` | [`TempPathOptions`] \| [`CreateTempPathCallback`] | Options for creating the temporary path. If a function is provided, it is treated as the `callback` parameter, and `options` is set to `{}` (an empty object). |
| `callback` | [`CreateTempPathCallback`] | A callback function to handle the result path or error. This is crucial and required, even when you wanted to omit all arguments.

#### Throws

- `TypeError`  
  If the given arguments or the extension name specified with incorrect type.

### `createTempPathSync` (Function)

```ts
function createTempPathSync(
  tmpdir?: string | TempPathOptions,
  options?: TempPathOptions
): string
```

Synchronously creates a temporary path, either as a directory or file, based on the provided or system temporary directory
and then returns a path that refers to the generated temporary directory or file.

This function utilizes the [getTempPath](#getTempPath) function.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tmpdir` | `string` \| [`TempPathOptions`] \| [`CreateTempPathCallback`] |  The temporary directory path. If an object is provided, it is treated as the `options` parameter, and `tmpdir` will fallback to the temporary directory provided by the system. |
| `options` | [`TempPathOptions`] \| [`CreateTempPathCallback`] | Options for creating the temporary path. |

#### Returns

A string representating the path of the created temporary directory or file.

**Type:** `string`

#### Throws

- `TypeError`  
  If the given arguments or the extension name specified with incorrect type.

- `Error`  
  Throws an `Error` if there is an issue creating the temporary directory or file.


## Development

### Initialize and Install Dependencies

```bash
npm install
```

### Build JSDoc

Generated JSDocs will be in `docs` directory.

```bash
npm run build:docs
```

### Test

Tests are written using inbuilt `node:assert` module.

```bash
npm test
```

Alternatively, you can run each test manually.

- Run CommonJS test.
  ```bash
  npm run test:cjs
  ```

- Run ESModule test.
  ```bash
  npm run test:esm
  ```

## License

This project is licensed under the MIT License. For more details, see the [**LICENSE**](https://github.com/mitsuki31/temppath/blob/master/LICENSE) file.

<!-- ::: Links ::: -->

[`TempPathOptions`]: https://mitsuki31.github.io/temppath/global.html#TempPathOptions
[`CreateTempPathCallback`]: https://mitsuki31.github.io/temppath/global.html#CreateTempPathCallback