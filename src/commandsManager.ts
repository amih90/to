import * as vscode from 'vscode';
import { Transformer } from "./transformers/transformer";
import { Utility } from "./utilities/utility";

export class CommandsManager {

    public static registerCommands(context: vscode.ExtensionContext, transformers: Transformer[], utilities: Utility[]) {
        CommandsManager.registerTransformers(context, transformers);
        CommandsManager.registerUtilities(context, utilities);
    }

    private static registerTransformers(context: vscode.ExtensionContext, transformers: Transformer[]) {
        transformers.forEach(transformer => {
            const disposable = vscode.commands.registerTextEditorCommand(`to.${transformer.name}`, function (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
                if (!textEditor) {
                    return;
                }

                const document = textEditor.document;

                textEditor.edit(editBuilder  => {
                    textEditor.selections.forEach(selection => {
                        const token = document.getText(selection);
                        editBuilder.replace(selection, transformer.encode(token));
                    });

                });
            });

            context.subscriptions.push(disposable);
        });
    }

    private static registerUtilities(context: vscode.ExtensionContext, utilities: Utility[]) {
        utilities.forEach(utility => {
            // retrieve class methods
            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(utility)).filter(p => p !== "constructor");

            // iterate over instance methods
            for (const key of methods) {
                const disposable = vscode.commands.registerTextEditorCommand(`to.${utility.name}.${key}`, function (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
                    if (!textEditor) {
                        return;
                    }

                    const document = textEditor.document;

                    textEditor.edit(editBuilder  => {
                        textEditor.selections.forEach(selection => {
                            const token = document.getText(selection);
                            editBuilder.replace(selection,  (<any>utility)[key](token));
                        });
                    });
                });

                context.subscriptions.push(disposable);
            }
        });
    }
}
