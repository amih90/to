import * as vscode from 'vscode';
import { CommandsManager } from './commandsManager';
import { CodelensProvider } from './codelensProvider';
import { Transformer } from './transformers/transformer';
import {
    Base64Transformer,
    FlatbuffersTransformer,
    ReverseWordTransformer,
    UrlencodeTransformer,
} from './transformers/transformers';


const transformers: Transformer[] = [
    new Base64Transformer(),
    new ReverseWordTransformer(),
    new UrlencodeTransformer(),
    // new FlatbuffersTransformer()
];

export function activate(context: vscode.ExtensionContext) {


    const codelensProvider = new CodelensProvider(transformers);
    vscode.languages.registerCodeLensProvider("*", codelensProvider);

    CommandsManager.registerCommands(context, transformers);

    vscode.commands.registerCommand("to.enableCodeLens", () => {
        vscode.workspace.getConfiguration("to").update("enableCodeLens", true, true);
    });

    vscode.commands.registerCommand("to.disableCodeLens", () => {
        vscode.workspace.getConfiguration("to").update("enableCodeLens", false, true);
    });

    vscode.commands.registerCommand("to.codelensAction", (args: any) => {
        vscode.window.showInformationMessage(`CodeLens action clicked with args=${args}`);
    });
}

export function deactivate() {}
