import ITransformer from './iTransformer';

export abstract class Transformer implements ITransformer {
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
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