// Type definitions for temppath
//
// Project: https://github.com/mitsuki31/temppath
// Definitions by: Ryuu Mitsuki <https://github.com/mitsuki31>

declare module '@mitsuki31/temppath' {
  /**
   * Callback function to handle the result or error from calling the
   * {@link createTempPath} function.
   *
   * @param err - The error object if any. Otherwise, `null` if no error.
   * @param resultPath - The path of the created temporary directory or file.
   */
  type CreateTempPathCallback = (err: Error | null, resultPath?: string) => void;

  /**
   * An interface representating options to configure the temporary file or directory
   * creation within this module.
   */
  interface TempPathOptions {
    /**
     * Whether to create a temporary file or directory.
     */
    asFile?: boolean;
    /**
     * The extension for the temporary file. If `asFile` option is `false`, this option will be ignored.
     */
    ext?: string;
    /**
     * The maximum characters' length of the generated directory or file name. Must be a
     * positive number and greater than zero.
     */
    maxLen?: number;
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
   * @param tmpdir - The temporary directory path. If not provided or empty, it defaults to the
   *                 system's temporary directory.
   * @param maxLen - The maximum characters' length of the generated temporary path. Must be a
   *                 positive number and greater than zero.
   * @returns        The temporary path.
   *
   * @throws {TypeError} Throws a `TypeError` if the provided `tmpdir` is not a string.
   * @throws {RangeError} If the given `maxLen` is less than or equal to zero.
   */
  function getTempPath(tmpdir?: string, maxLen?: number): string;

  /**
   * Asynchronously creates a temporary path, either as a directory or file,
   * based on the provided or system temporary directory.
   *
   * This function utilizes the {@link getTempPath} function. To limit the characters'
   * length of generated temporary directory or file name, set the
   * {@link TempPathOptions.maxLen} to the desired value and it must be a positive number.
   * Thus, the function will trim the name to the desired maximum length.
   *
   * @param callback - A callback function to handle the result path and error if any.
   *
   * @throws {TypeError} If the given arguments or the extension name specified with incorrect type.
   */
  function createTempPath(callback: CreateTempPathCallback): void;

  /**
   * Asynchronously creates a temporary path, either as a directory or file,
   * based on the provided or system temporary directory.
   *
   * This function utilizes the {@link getTempPath} function. To limit the characters'
   * length of generated temporary directory or file name, set the
   * {@link TempPathOptions.maxLen} to the desired value and it must be a positive number.
   * Thus, the function will trim the name to the desired maximum length.
   *
   * @param tmpdir - A temporary directory path. If not provided or empty, it defaults to the
   *                 system's temporary directory.
   * @param callback - A callback function to handle the result path and error if any.
   *
   * @throws {TypeError} If the given arguments or the extension name specified with incorrect type.
   */
  function createTempPath(tmpdir: string, callback: CreateTempPathCallback): void;

  /**
   * Asynchronously creates a temporary path, either as a directory or file,
   * based on the provided or system temporary directory.
   *
   * This function utilizes the {@link getTempPath} function. To limit the characters'
   * length of generated temporary directory or file name, set the
   * {@link TempPathOptions.maxLen} to the desired value and it must be a positive number.
   * Thus, the function will trim the name to the desired maximum length.
   *
   * @param options - An options object to configure the temporary file or directory creation.
   * @param callback - A callback function to handle the result path and error if any.
   *
   * @throws {TypeError} If the given arguments or the extension name specified with incorrect type.
   */
  function createTempPath(options: TempPathOptions, callback: CreateTempPathCallback): void;

  /**
   * Asynchronously creates a temporary path, either as a directory or file,
   * based on the provided or system temporary directory.
   *
   * This function utilizes the {@link getTempPath} function. To limit the characters'
   * length of generated temporary directory or file name, set the
   * {@link TempPathOptions.maxLen} to the desired value and it must be a positive number.
   * Thus, the function will trim the name to the desired maximum length.
   *
   * @param tmpdir - A temporary directory path. If not provided or empty, it defaults to the
   *                 system's temporary directory.
   * @param options - An options object to configure the temporary file or directory creation.
   * @param callback - A callback function to handle the result path and error if any.
   *
   * @throws {TypeError} If the given arguments or the extension name specified with incorrect type.
   */
  function createTempPath(
    tmpdir: string,
    options: TempPathOptions,
    callback: CreateTempPathCallback
  ): void;

  /**
   * Synchronously creates a temporary path, either as a directory or file, based on the provided
   * or system temporary directory and then returns a path that refers to the generated temporary directory or file.
   *
   * This function utilizes the {@link module:temppath~getTempPath|getTempPath} function.
   * To limit the characters' length of generated temporary directory or file name,
   * set the {@link TempPathOptions.maxLen} to the desired value and
   * it must be a positive number. Thus, the function will trim the name to the desired
   * maximum length.
   *
   * @param tmpdir - A temporary directory path. If not provided or empty, it defaults to the
   *                 system's temporary directory.
   * @param options - An options object to configure the temporary file or directory creation.
   *
   * @returns The path of the created temporary directory or file.
   *
   * @throws {TypeError} If the given arguments or the extension name specified with incorrect type.
   * @throws {Error} Throws an `Error` if there is an issue creating the temporary directory or file.
   */
  function createTempPathSync(tmpdir?: string, options?: TempPathOptions): string;
}
