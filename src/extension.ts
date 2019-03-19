import * as vscode from 'vscode';
import { formatTextEditorCommand } from './formatTextEditorCommand';

export function activate(context: vscode.ExtensionContext) {
  console.info('[vscode-json-stable-stringify] activated!');
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.vscode-json-stable-stringify.jsonStableSort', formatTextEditorCommand));
}

export function deactivate() {}
