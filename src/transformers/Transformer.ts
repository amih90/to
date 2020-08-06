import ITransformer from './iTransformer';

export abstract class Transformer implements ITransformer {
    public readonly name: string;

    private readonly regex_ascii: RegExp;

    constructor(name: string) {
        this.name = name;

        this.regex_ascii = new RegExp("^[\x00-\xFF]*$");
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

    isAscii(input: string): boolean {
        return this.regex_ascii.test(input);
    }
}