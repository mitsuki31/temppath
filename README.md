# temppath

Create a random temporary path based on system's temporary directory.

## API

### `getTempPath` (Function)

Generates a temporary path based on the provided or system temporary directory.

This function utilizes a random UUID for the directory name, ensuring that each time
it is called, the path will be different from previous calls. The returned path can be
used for either a temporary file or directory, according to your preferences.

#### Parameters

- `tmpdir` - The temporary directory to be used. If not provided or empty, it defaults to the system's temporary directory.

#### Returns

- `string` - A string representing a generated temporary path with a random UUID.


## Test

There are two ways to run tests on this project.

1. `npm test`  
  Only supported on Unix-based systems.

2. `make test`  
  Supports cross-platform testing with `make` installed on the device.

Alternatively, you can run each test manually.

### `npm`
- `npm run test:cjs` - Run CommonJS test.
- `npm run test:esm` - Run ESModule test.

### `make`
- `make test-cjs` - Run CommonJS test.
- `make test-esm` - Run ESModule test.

## License

This project is licensed under the MIT License. For more details, see the **LICENSE** file.
