import * as vscode from 'vscode';
import { Transformer } from "./transformers/transformer";

export class CommandsManager {

    public static registerCommands(context: vscode.ExtensionContext, transformers: Transformer[]) {
        transformers.forEach(transformer => {
            const disposable = vscode.commands.registerTextEditorCommand(`to.${transformer.name}`, function (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
                if (!textEditor) {
                    return;
                }

                const document = textEditor.document;
                const selection = textEditor.selection;

                const word = document.getText(selection);
                const base64Encoded = transformer.encode(word);

                textEditor.edit(editBuilder  => {
                    editBuilder.replace(selection, base64Encoded);
                });
            });

            context.subscriptions.push(disposable);
        });
    }
}
