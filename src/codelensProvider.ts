import * as vscode from 'vscode';
import ITransformer from './transformers/iTransformer';

class TransformerCodeLens extends vscode.CodeLens {
    readonly token: string;

    public transformer?: ITransformer | undefined;

    constructor(range: vscode.Range, token: string) {
        super(range);

        this.transformer = undefined;
        this.token = token;
    }
}


export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private regex: RegExp;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    private transformers: ITransformer[];

    constructor(transformers: ITransformer[]) {
        this.transformers = transformers;

        this.regex = /\'(.+)\'/g;

        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

        if (vscode.workspace.getConfiguration("to").get("enableCodeLens", true)) {
            this.codeLenses = [];
            const regex = new RegExp(this.regex);
            const text = document.getText();
            let matches;
            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(document.positionAt(matches.index).line);
                const indexOf = line.text.indexOf(matches[0]);
                const position = new vscode.Position(line.lineNumber, indexOf);

                const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
                const token = document.getText(range).slice(1, -1);

                if (range) {
                    this.codeLenses.push(new TransformerCodeLens(range, token));
                }
            }
            return this.codeLenses;
        }
        return [];
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("to").get("enableCodeLens", true)) {
            const lens: TransformerCodeLens = codeLens as TransformerCodeLens;

            if (!lens.transformer) {
                for (const transformer of this.transformers) {
                    if (transformer.match(lens.token)) {
                        lens.transformer = transformer;
                        break;
                    }
                }
            }

            const token = lens.transformer?.decode(lens.token);

            lens.command = {
                title: `${lens.transformer?.constructor.name} - ${token}`,
                tooltip: "Tooltip provided by sample extension",
                command: "to.codelensAction",
                arguments: ["Argument 1", false]
            };
            return lens;
        }
        return null;
    }
}