export class StringifyResult {
  success: boolean;
  result: string;

  constructor(success: boolean, result: string) {
    this.success = success;
    this.result = result;
  }
}
