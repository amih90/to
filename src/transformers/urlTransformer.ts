import * as vscode from 'vscode';
import { Transformer } from './Transformer';

export class UrlencodeTransformer extends Transformer {
  constructor() {
    const regex = new RegExp('^[A-Za-z0-9%./]+=[^s]+');

    super('urlencode', regex);
  }

  public match(input: string): boolean {
    if (!input) {
      return false;
    }

    const decodedInput = this.decode(input);

    return this.isUTF8(decodedInput) && input !== decodedInput;
  }

  public encode(input: string): string {
    return encodeURIComponent(input);
  }

  public decode(input: string): string {
    return decodeURIComponent(input);
  }
}
