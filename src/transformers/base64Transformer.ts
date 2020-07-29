import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class Base64Transformer extends Transformer  {

    private regex: RegExp;

    constructor() {
        super("base64");

        this.regex = new RegExp("^(?:[A-Za-z0-9+/]{4})+(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");
    }

    public match(input: string): boolean {
        if (!input) {
            return false;
        }

        return input === this.encode(this.decode(input)) && this.regex.test(input);
    }

    public encode(input: string): string {
        return Buffer.from(input, 'utf8').toString('base64');
    }

    public decode(input: string): string {
        return Buffer.from(input, 'base64').toString('utf8');
    }
}
