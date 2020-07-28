import * as vscode from 'vscode';
import { CommandsManager } from './commandsManager';
import { CodelensProvider } from './codelensProvider';
import { Transformer } from './transformers/transformer';
import {
    Base32Transformer,
    Base64Transformer,
    BinaryTransformer,
    FlatbuffersTransformer,
    HexTransformer,
    ReverseWordTransformer,
    UrlencodeTransformer,
} from './transformers/transformers';

// Order is important for complexity and reliability
const transformers: Transformer[] = [
    new BinaryTransformer(),
    new HexTransformer(),
    new Base32Transformer(),
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
