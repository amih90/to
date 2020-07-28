import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class ReverseWordTransformer extends Transformer  {

    constructor() {
        super("reverseWord");
    }


    public match(input: string): boolean {
        return false;
    }

    public encode(input: string): string {
        return input.split('').reverse().join('');
    }

    public decode(input: string): string {
        return this.encode(input);
    }
}

