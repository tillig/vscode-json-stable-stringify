import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // TODO: Include version in the activation message.
    console.log('[vscode-json-stable-stringify] activated!');

    let disposable = vscode.commands.registerCommand('extension.jsonStableSort', () => {
        // https://code.visualstudio.com/api/references/vscode-api
        // languages.registerDocumentRangeFormattingEditProvider('json', provider)
        // provider = provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>
        // TODO: Register a formatter for JSON documents - sections and entire docs.
        // TODO: Register a stable sort command for invoking the format on a selection in some other doc type.
        // TODO: If there is no selection, execute the stringify on the whole document.
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
