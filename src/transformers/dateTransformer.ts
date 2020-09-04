import * as vscode from 'vscode';
import { Transformer } from './transformer';


export class DateTransformer extends Transformer  {

    constructor() {
        const regex = new RegExp("^-?\d{9,20}|\d{10,20}$", 'i');

        super("date", regex);
    }

    public encode(input: string): string {
        return new Date(input).getTime().toString();
    }

    public decode(input: string): string {
        return new Date(input).toDateString();
    }
}
