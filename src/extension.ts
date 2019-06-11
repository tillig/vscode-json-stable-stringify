import * as vscode from 'vscode';
import { formatTextEditorCommand } from './formatTextEditorCommand';

export function activate(context: vscode.ExtensionContext) {
  // tslint:disable-next-line:no-console
  console.info('[vscode-json-stable-stringify] activated!');
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.vscode-json-stable-stringify.jsonStableSort', formatTextEditorCommand));
}

// tslint:disable-next-line:no-empty
export function deactivate() {}
