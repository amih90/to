import * as vscode from 'vscode';
import * as path from 'path';
import { copyToClipboard, getNonce, standardiseCspSource } from './utils';


export class View implements vscode.Disposable {
    private readonly extensionPath: string;
    private readonly panel: vscode.WebviewPanel;
    private disposables: vscode.Disposable[] = [];

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;

        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        this.panel = vscode.window.createWebviewPanel('view', 'View', column || vscode.ViewColumn.One, {
            enableScripts: true,
        });

        this.panel.iconPath = this.getResourcesUri('icon.svg');

        // Dispose this View when the Webview is disposed
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.html = this.getWebviewContent();
    }

    public dispose() {
        this.panel.dispose();
        this.disposables.forEach((disposable) => disposable.dispose());
        this.disposables = [];

    }

    //<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
    // <link rel="stylesheet" type="text/css" href="${this.getMediaUri('out.min.css')}">
    // <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:; connect-src 'self'; font-src 'self'; style-src ${standardiseCspSource(this.panel.webview.cspSource)} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src 'self' blob: data:;;">
    // <meta http-equiv="Content-Security-Policy" content="default-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src	'self' 'unsafe-inline' *; img-src 'self' data: *">

    private getWebviewContent() {
        const nonce = getNonce();
        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:; connect-src 'self'; font-src 'self'; style-src ${standardiseCspSource(this.panel.webview.cspSource)} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src 'self' data: *;">
                    <link rel="stylesheet" type="text/css" href="${this.getMediaUri('main.css')}">
                    <title>View</title>
                    <style>
                    pre {
                        background: #303030;
                        color: #f1f1f1;
                        padding: 10px 16px;
                        border-radius: 2px;
                        border-top: 4px solid #00aeef;
                        counter-reset: line;
                    }

                    pre span {
                        display: block;
                        line-height: 1.5rem;
                    }

                    pre span:before {
                        counter-increment: line;
                        content: counter(line);
                        display: inline-block;
                        border-right: 1px solid #ddd;
                        padding: 0 .5em;
                        margin-right: .5em;
                        color: #888
                    }
                    </style>
                </head>
                <body>
                    <h2>View</h2>
                    <p>view view</p>
                    <div style='display: flex; flex-direction: row;'>
                        <div>
                            <pre>
                                <span>lorem ipsum</span>
                                <span>&gt;&gt; lorem ipsum</span>
                                <span>lorem ipsum,\ </span>
                                <span>lorem ipsum.</span>
                                <span>&gt;&gt; lorem ipsum</span>
                                <span>lorem ipsum</span>
                                <span>lorem ipsum</span>
                                <span>lorem ipsum</span>
                            </pre>
                        </div>
                        <div>
                            <pre>
                                <span>lorem ipsum</span>
                                <span>&gt;&gt; lorem ipsum</span>
                                <span>lorem ipsum,\ </span>
                                <span>lorem ipsum.</span>
                                <span>&gt;&gt; lorem ipsum</span>
                                <span>lorem ipsum</span>
                                <span>lorem ipsum</span>
                                <span>lorem ipsum</span>
                            </pre>
                        </div>
                    </div>
                </body>
            </html>`;
    }

    private getMediaUri(file: string) {
        return this.panel.webview.asWebviewUri(this.getUri('media', file));
    }

    private getResourcesUri(file: string) {
        return this.getUri('resources', file);
    }

    private getUri(...pathComps: string[]) {
        return vscode.Uri.file(path.join(this.extensionPath, ...pathComps));
    }
}

