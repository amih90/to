import * as vscode from 'vscode';
import { base32Encode, base32Decode } from '@ctrl/ts-base32';
import { Transformer } from './transformer';


export class Base32Transformer extends Transformer  {

    constructor() {
        const regex = new RegExp("^[A-Z2-7]+=*$");

        super("base32", regex);
    }

    public match(input: string): boolean {
        try {
            return super.match(input);
        } catch {
            return false;
        }
    }

    public encode(input: string): string {
        return base32Encode(Buffer.from(input));
    }

    public decode(input: string): string {
        return Buffer.from(base32Decode(input)).toString();
    }
}

