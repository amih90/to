import * as vscode from 'vscode';
import * as _ from 'lodash';
import { Utility } from './utility';


export class StringUtils extends Utility {

    constructor() {
        super("string");
    }

    public camelCase(input: string): string {
        return _.camelCase(input);
    }

    public deburr(input: string): string {
        return _.deburr(input);
    }

    public kebabCase(input: string): string {
        return _.kebabCase(input);
    }

    public lowerCase(input: string): string {
        return input.toLowerCase();
    }

    public reverse(input: string): string {
        return input.split('').reverse().join('');
    }

    public snakeCase(input: string): string {
        var pre_str = _.snakeCase(input);
        
        var s = pre_str.replace(/(.*)(int|INT)(\_)(8|16|32|64)(.*)/g, (_, begin, int_part, _underscore, bit_part, after) => 
        `${begin}${int_part}${bit_part}${after}`);
        return s;
    }

    public dotCase(input: string): string {
        return _.snakeCase(input).replace(/_/g, ".");
    }

    public whiteSpace(input: string): string {
        return _.snakeCase(input).replace(/_/g, " ");
    }

    public trim(input: string): string {
        return input.trim();
    }

    public upperCase(input: string): string {
        return input.toUpperCase();
    }

    public pascalCase(input: string): string {
        return _.upperFirst(_.camelCase(input));
    }

    public allCaps(input: string): string {
        return this.snakeCase(input).toUpperCase();
    }
}

