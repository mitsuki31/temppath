# temppath

Create a random temporary path based on system's temporary directory.

## APIs

<h3 id="getTempPath"><!-- Need some newlines -->

`getTempPath` -> `string` (Function)</h3>

Generates a temporary path based on the provided or system temporary directory.

This function utilizes a random UUID for the directory name, ensuring that each time
it is called, the path will be different from previous calls. The returned path can be
used for either a temporary file or directory, according to your preferences.

#### Parameters

- `tmpdir` : { `string` } _(optional)_  
  The temporary directory to be used. If not provided or empty, it defaults to the system's temporary directory.

#### Returns

- `string`  
  A string representing a generated temporary path with a random UUID.


### `createTempPath` -> `void` (Function)

Asynchronously creates a temporary path, either as a directory or file,
based on the provided or system temporary directory.

This function utilizes the [getTempPath](#getTempPath) function.

#### Parameters

- `tmpdir` : { `string` | `Object` | `Function` } _(optional)_  
  The temporary directory path. If an object is provided, it is treated as the `options` parameter.
  If a function is provided, it is treated as the `callback` parameter, and `tmpdir` is set to `null`.

- `options` : { `Object` | `Function` } _(optional)_  
  Options for creating the temporary path. If a function is provided, it is treated as the `callback` parameter,
  and `options` is set to `{}` (an empty object).

  - `options.asFile` : { `boolean` } [Default: `false`] _(optional)_  
    If `true`, create a temporary file. Otherwise, create a directory.

  - `options.ext` : { `string` } [Default: `'.tmp'`] _(optional)_  
    The extension for the temporary file. If `asFile` option is `false`, this option will be ignored. Default is '.tmp'.

- `callback` : { `Function` } _(non-nullable)_  
  A callback function to handle the result path or error. This is crucial and required, even when you wanted to omit all arguments.

  - `error` : { `Error` } _(nullable)_  
    An error object if an error occurred, or `null` if no error.

  - `resultPath` : { `string` }  
    The path of the created temporary directory or file.


### `createTempPathSync` -> `string` (Function)

Synchronously creates a temporary path, either as a directory or file, based on the provided or system temporary directory
and then returns a path that refers to the generated temporary directory or file.

This function utilizes the [getTempPath](#getTempPath) function.

#### Parameters

- `tmpdir` : { `string` | `Object` } _(optional)_  
  The temporary directory path. If an object is provided, it is treated as the `options` parameter, and `tmpdir` is set to `null`.

- `options` : { `Object` } _(optional)_  
  Options for creating the temporary path.

  - `options.asFile` : { `boolean` } [Default: `false`] _(optional)_  
    If `true`, create a temporary file. Otherwise, create a directory.

  - `options.ext` : { `string` } [Default: `'.tmp'`] _(optional)_  
    The extension for the temporary file. If `asFile` option is `false`, this option will be ignored. Default is '.tmp'.

#### Returns

- `string`  
  The path of the created temporary directory or file.

#### Throws

**Type:** `TypeError`  
Throws a `TypeError` if the provided `tmpdir` or `options` is not of the correct type.

**Type:** `Error`  
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

This project is licensed under the MIT License. For more details, see the **LICENSE** file.
