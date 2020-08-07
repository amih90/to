import ITransformer from './iTransformer';

export abstract class Transformer implements ITransformer {
    private readonly regex_utf8: RegExp;

    public readonly name: string;
    protected regex: RegExp;

    constructor(name: string, regex: RegExp) {
        this.name = name;
        this.regex_utf8 = new RegExp("^[\u0020-\u007e\u00a0-\u00ff]*$");
        this.regex = regex;
    }

    match(input: string): boolean {
        if (!input) {
            return false;
        }

        const decodedInput = this.decode(input);

        return this.isUTF8(decodedInput) &&
                input === this.encode(decodedInput) &&
                this.regex.test(input);
    }

    abstract encode(input: string): string;

    abstract decode(input: string): string;

    isUTF8(input: string): boolean {
        return this.regex_utf8.test(input);
    }
}