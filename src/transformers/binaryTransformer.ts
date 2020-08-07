import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class BinaryTransformer extends Transformer  {

    constructor() {
        const regex = new RegExp("^([01 ]{1,8})+$");

        super("binary", regex);
    }

    public encode(input: string): string {
        return Array.from(input)
            .reduce((acc: string[], char: string) => acc.concat(char.charCodeAt(0).toString(2)), [])
            .map((bin: string) => '0'.repeat(8 - bin.length) + bin )
            .join(' ');
    }

    public decode(input: string): string {
        return input.trim().split(" ")
            .map((byte: string) => String.fromCharCode(parseInt(byte, 2))).join("");;
    }
}
