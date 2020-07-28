import * as vscode from 'vscode';
import { CommandsManager } from './commandsManager';
import { CodelensProvider } from './codelensProvider';
import { Transformer } from './transformers/transformer';
import {
    Base32Transformer,
    Base64Transformer,
    FlatbuffersTransformer,
    HexTransformer,
    UrlencodeTransformer,
} from './transformers/transformers';
import { Utility } from './utilities/utility';
import { StringUtils } from './utilities/utilities';


const transformers: Transformer[] = [
    new Base32Transformer(),
    new Base64Transformer(),
    new HexTransformer(),
    new UrlencodeTransformer(),
    // new FlatbuffersTransformer()
];

const utils: Utility[] = [
    new StringUtils(),
];

export function activate(context: vscode.ExtensionContext) {


    const codelensProvider = new CodelensProvider(transformers);
    vscode.languages.registerCodeLensProvider("*", codelensProvider);

    CommandsManager.registerCommands(context, transformers, utils);

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
