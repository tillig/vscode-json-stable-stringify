/* eslint-disable @typescript-eslint/no-empty-function */
import * as vscode from 'vscode';
import { formatTextEditorCommand } from './formatTextEditorCommand';

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context The extension context with which commands may be registered.
 */
export function activate(context: vscode.ExtensionContext) : void {
  console.info('[vscode-json-stable-stringify] activated!');
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.vscode-json-stable-stringify.jsonStableSort', formatTextEditorCommand));
}

/**
 * Deactivates the extension.
 */
export function deactivate() : void {}
