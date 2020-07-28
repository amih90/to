import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export type ErrorInfo = string | null; // null => no error, otherwise => error message

export function copyToClipboard(text: string): Thenable<ErrorInfo> {
    return vscode.env.clipboard.writeText(text).then(
        () => null,
        () => 'Visual Studio Code was unable to write to the Clipboard.'
    );
}

export function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}