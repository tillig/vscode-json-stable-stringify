export class StringifyResult {
  public success: boolean;
  public result: string;

  constructor(success: boolean, result: string) {
    this.success = success;
    this.result = result;
  }
}
