import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class UrlencodeTransformer extends Transformer  {

    constructor() {
        super("urlencode");
    }


    public match(input: string): boolean {
        return input !== decodeURIComponent(input);
    }

    public encode(input: string): string {
        return encodeURIComponent(input);
    }

    public decode(input: string): string {
        return decodeURIComponent(input);
    }
}
