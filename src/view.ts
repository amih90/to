import * as vscode from 'vscode';
import * as path from 'path';
import { copyToClipboard, getNonce } from './utils';


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

        this.panel.iconPath = this.getResourcesUri('webview-icon.svg');

        // Dispose this View when the Webview is disposed
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.html = this.getHtmlForWebview();
    }

    public dispose() {
        this.panel.dispose();
        this.disposables.forEach((disposable) => disposable.dispose());
        this.disposables = [];

    }

    private getHtmlForWebview() {
        const nonce = getNonce();

        let body;

        body = `<body>
            <h2>View</h2>
            <p>view view</p>
            </body>`;

        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${standardiseCspSource(this.panel.webview.cspSource)} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src data:;">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="${this.getMediaUri('out.min.css')}">
                    <title>Git Graph</title>
                </head>
                ${body}
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

/**
 * Standardise the CSP Source provided by Visual Studio Code for use with the Webview. It is idempotent unless called with http/https URI's, in which case it keeps only the authority portion of the http/https URI. This is necessary to be compatible with some web browser environments.
 * @param cspSource The value provide by Visual Studio Code.
 * @returns The standardised CSP Source.
 */
export function standardiseCspSource(cspSource: string) {
    if (cspSource.startsWith('http://') || cspSource.startsWith('https://')) {
        const pathIndex = cspSource.indexOf('/', 8), queryIndex = cspSource.indexOf('?', 8), fragmentIndex = cspSource.indexOf('#', 8);
        let endOfAuthorityIndex = pathIndex;
        if (queryIndex > -1 && (queryIndex < endOfAuthorityIndex || endOfAuthorityIndex === -1)) endOfAuthorityIndex = queryIndex;
        if (fragmentIndex > -1 && (fragmentIndex < endOfAuthorityIndex || endOfAuthorityIndex === -1)) endOfAuthorityIndex = fragmentIndex;
        return endOfAuthorityIndex > -1 ? cspSource.substring(0, endOfAuthorityIndex) : cspSource;
    } else {
        return cspSource;
    }
}
