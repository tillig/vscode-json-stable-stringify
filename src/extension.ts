import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // TODO: Include version in the activation message.
    console.log('[vscode-json-stable-stringify] activated!');

    let disposable = vscode.commands.registerCommand('extension.jsonStableSort', () => {
        // TODO: If the document isn't JSON, don't allow the command.
        // TODO: If there is a selection, execute the stringify on the selection.
        // TODO: If there is no selection, execute the stringify on the whole document.
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
