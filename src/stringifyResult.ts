/**
 * Result information for a JSON sort operation.
 */
export class StringifyResult {
  public success: boolean;
  public result: string;

  /**
   * Creates a new result object.
   * @param {boolean} success - True if the operation succeeded; false if not.
   * @param {string} result - The sorted block of JSON.
   */
  constructor(success: boolean, result: string) {
    this.success = success;
    this.result = result;
  }
}
