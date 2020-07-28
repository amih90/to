import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class HexTransformer extends Transformer  {

    private regex: RegExp;

    constructor() {
        super("hex", true);

        this.regex = new RegExp("^[0-9A-F]+$", 'i');
    }


    public match(input: string): boolean {
        return this.regex.test(input);
    }

    public encode(input: string): string {
        return Buffer.from(input, 'utf8').toString('hex');
    }

    public decode(input: string): string {
        return Buffer.from(input, 'hex').toString('utf8');
    }
}
