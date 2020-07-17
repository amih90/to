import * as vscode from 'vscode';
const { base64encode } = require('nodejs-base64');


export function activate(context: vscode.ExtensionContext) {

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

    const base64Disposable = vscode.commands.registerCommand('to.base64', function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            const word = document.getText(selection);
            const base64Encoded = base64encode(word);
            editor.edit(editBuilder => {
                editBuilder.replace(selection, base64Encoded);
            });
        }
    });

    context.subscriptions.push(base64Disposable);
}

export function deactivate() {}
