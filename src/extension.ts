import * as vscode from 'vscode';
import { CodelensProvider } from './codelensProvider';
import ITransformer from './transformers/iTransformer';
import { Base64Transformer, base64Disposable } from './transformers/Base64Transformer';



export function activate(context: vscode.ExtensionContext) {
    const transformers: ITransformer[] = [
        new Base64Transformer()
    ];

    const codelensProvider = new CodelensProvider(transformers);
    vscode.languages.registerCodeLensProvider("*", codelensProvider);

    const reverseWordDisposable = vscode.commands.registerCommand('to.reverseWord', function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            const word = document.getText(selection);
            const reversed = word.split('').reverse().join('');
            editor.edit(editBuilder => {
                editBuilder.replace(selection, reversed);
            });
        }
    });

    context.subscriptions.push(reverseWordDisposable);
    context.subscriptions.push(base64Disposable);



    vscode.commands.registerCommand("codelens-sample.enableCodeLens", () => {
        vscode.workspace.getConfiguration("codelens-sample").update("enableCodeLens", true, true);
    });

    vscode.commands.registerCommand("codelens-sample.disableCodeLens", () => {
        vscode.workspace.getConfiguration("codelens-sample").update("enableCodeLens", false, true);
    });

    vscode.commands.registerCommand("codelens-sample.codelensAction", (args: any) => {
        vscode.window.showInformationMessage(`CodeLens action clicked with args=${args}`);
    });
}

export function deactivate() {}
