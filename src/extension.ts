import * as vscode from 'vscode';
import { CommandsManager } from './commandsManager';
import { CodelensProvider } from './codelensProvider';
import { Transformer } from './transformers/transformer';
import {
    Base32Transformer,
    Base64Transformer,
    BinaryTransformer,
    // FlatbuffersTransformer,
    DateTransformer,
    HexTransformer,
    UrlencodeTransformer
} from './transformers/transformers';
import { Utility } from './utilities/utility';
import { StringUtils } from './utilities/utilities';

// Order is important for complexity and reliability
const transformers: Transformer[] = [
    new BinaryTransformer(),
    new UrlencodeTransformer(),
    new HexTransformer(),
    new Base32Transformer(),
    new Base64Transformer(),
    new DateTransformer(),
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

    vscode.commands.registerCommand('to.codelensAction', (arg: any) => {
      vscode.env.clipboard
        .writeText(arg)
        .then(() =>
          vscode.window.showInformationMessage(
            'Copied decoded text to clipboard!'
          )
        );
    });
}

export function deactivate() {}
