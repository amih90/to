import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class Base64Transformer extends Transformer  {

    constructor() {
        const regex = new RegExp("^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?");

        super("base64", regex);
    }

    public encode(input: string): string {
        return Buffer.from(input, 'utf8').toString('base64');
    }

    public decode(input: string): string {
        return Buffer.from(input, 'base64').toString('utf8');
    }
}
