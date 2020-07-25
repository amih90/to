import * as vscode from 'vscode';
import ITransformer from './iTransformer';


export class Base64Transformer implements ITransformer  {

    private regex: RegExp;

    constructor() {
        this.regex = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");
    }

    public match(input: string): boolean {
        return this.regex.test(input);
    }

    public encode(input: string): string {
        return Buffer.from(input, 'utf8').toString('base64');
    }

    public decode(input: string): string {
        return Buffer.from(input, 'base64').toString('utf8');
    }
}

const base64encodeDisposable = vscode.commands.registerTextEditorCommand('to.base64', function (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    if (!textEditor) {
        return;
    }

    const document = textEditor.document;
    const selection = textEditor.selection;

    const word = document.getText(selection);
    const base64Encoded = new Base64Transformer().encode(word);

    textEditor.edit(editBuilder  => {
        editBuilder.replace(selection, base64Encoded);
    });
});

export {
    base64encodeDisposable as base64Disposable
};