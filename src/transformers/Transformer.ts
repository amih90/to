import ITransformer from './iTransformer';

export abstract class Transformer implements ITransformer {
    public name: string;
    readonly codelensEnabled: boolean;

    constructor(name: string, codelens: boolean = false) {
        this.name = name;
        this.codelensEnabled = codelens;
    }

    match(input: string): boolean {
        throw new Error("Method not implemented.");
    }
    encode(input: string): string {
        throw new Error("Method not implemented.");
    }
    decode(input: string): string {
        throw new Error("Method not implemented.");
    }

}