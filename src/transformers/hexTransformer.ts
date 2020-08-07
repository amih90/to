import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class HexTransformer extends Transformer  {

    constructor() {
        const regex = new RegExp("^[0-9A-F]+$", 'i');

        super("hex", regex);
    }

    public encode(input: string): string {
        return Buffer.from(input, 'utf8').toString('hex');
    }

    public decode(input: string): string {
        return Buffer.from(input, 'hex').toString('utf8');
    }
}
