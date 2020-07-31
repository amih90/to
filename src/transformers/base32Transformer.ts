import * as vscode from 'vscode';
import { base32Encode, base32Decode } from '@ctrl/ts-base32';
import { Transformer } from './transformer';


export class Base32Transformer extends Transformer  {

    private regex: RegExp;

    constructor() {
        super("base32");

        this.regex = new RegExp("^[A-Z2-7]+=*$");
    }

    public match(input: string): boolean {
        try {
            return input === this.encode(this.decode(input)) && this.regex.test(input);
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

