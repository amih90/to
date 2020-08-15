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

        // // Update the content based on view changes
        // this.panel.onDidChangeViewState(
        //     e => {
        //         if (this.panel.visible) {
        //             this._update();
        //         }
        //     },
        //     null,
        //     this.disposables
        // );

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this.disposables
        );
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
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this.getUri('resources', 'main.js'));
        // And the uri we use to load this script in the webview
        const scriptUri = this.panel.webview.asWebviewUri(scriptPathOnDisk);

        const stylePathOnDisk = vscode.Uri.joinPath(this.getUri('resources', 'main.css'));
        const styleUri = this.panel.webview.asWebviewUri(stylePathOnDisk);

        const prismCssPathOnDisk = vscode.Uri.joinPath(this.getUri('resources', 'prism.css'));
        const prismCssUri = this.panel.webview.asWebviewUri(prismCssPathOnDisk);
        const prismJsPathOnDisk = vscode.Uri.joinPath(this.getUri('resources', 'prism.js'));
        const prismJsUri = this.panel.webview.asWebviewUri(prismJsPathOnDisk);

        const nonce = getNonce();
        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Security-Policy" content="default-src * 'self' data: gap: content:; connect-src 'self'; font-src 'self'; style-src 'self' ${standardiseCspSource(this.panel.webview.cspSource)} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src 'self' data: *;">
                    <link rel="stylesheet" type="text/css" href="${prismCssUri}" />
                    <link rel="stylesheet" type="text/css" href="${styleUri}">
                    <title>View</title>
                </head>
                <body class="line-numbers">
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
                        <div style='display: flex; flex-direction: column;'>
                            <button id="button" onclick="setCaret()">focus</button>
                            <button>b</button>
                        </div>
                        <pre onPaste="setTimeout(function() {onPaste();}, 0)" id="editable" contenteditable>
                            <code id="yaml" class="language-yaml"></code>
                        </pre>
                    </div>

                    <script nonce="${nonce}" src="${scriptUri}"></script>
                    <script nonce="${nonce}" src="${prismJsUri}"></script>
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

