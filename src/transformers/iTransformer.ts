export default interface ITransformer {

    match(input: string): boolean;

    encode(input: string): string;

    decode(input: string): string;
}