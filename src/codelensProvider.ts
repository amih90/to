import * as vscode from 'vscode';
import { Transformer } from './transformers/transformer';
import { Transform } from 'stream';

class TransformerCodeLens extends vscode.CodeLens {
    readonly token: string;
    readonly transformer: Transformer;

    constructor(range: vscode.Range, token: string, transformer: Transformer) {
        super(range);

        this.token = token;
        this.transformer = transformer;
    }
}


export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private regex: RegExp;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    private transformers: Transformer[];

    constructor(transformers: Transformer[]) {
        this.transformers = transformers;

        this.regex = /(["'])(?:\\.|[^\\])*?\1/g;

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

                if (range) {
                    const token = document.getText(range).slice(1, -1);
                    let transformer;

                    // search for matching transfomer
                    for (const t of this.transformers) {
                        if (t.match(token)) {
                            transformer = t;
                            break;
                        }
                    }

                    if (transformer) {
                        this.codeLenses.push(new TransformerCodeLens(range, token, transformer));
                    }
                }
            }
            return this.codeLenses;
        }
        return [];
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("to").get("enableCodeLens", true)) {
            const lens: TransformerCodeLens = codeLens as TransformerCodeLens;

            const token = lens.transformer.decode(lens.token);
            const title = `${lens.transformer.name} - ${token}`;

            lens.command = {
                title,
                tooltip: "Tooltip provided by sample extension",
                command: "to.codelensAction",
                arguments: [token, false]
            };

            return lens;
        }

        return null;
    }
}