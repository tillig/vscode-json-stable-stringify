import * as vscode from 'vscode';
import { StringifyResult } from './stringifyResult';
import stringify from 'json-stable-stringify';
import JSON5 from 'json5';

export function formatTextEditorCommand(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  const outputChannel = vscode.window.createOutputChannel('Sort JSON (Stable)')
  try {
    if (!sortAndReplace(textEditor, edit, outputChannel)) {
      outputChannel.show(true);
      vscode.window.showErrorMessage('Error during JSON sort. See output window for details.');
    }
  } finally {
    outputChannel.dispose();
  }
}

function sortAndReplace(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, outputChannel: vscode.OutputChannel): boolean {
  let error: boolean = false;
  if (textEditor.selections.length === 1 && textEditor.selections[0].isEmpty) {
    // There's no selection - do the whole doc.
    const text: string = textEditor.document.getText();
    if (text.length < 2) {
      // All JSON is at least two characters, even empty string/object. If it's a single-digit number,
      // there's arguably nothing to sort anyway.
      return true;
    }

    const sorted: StringifyResult = sortJson(text, textEditor.options, new vscode.Position(1, 1), outputChannel);
    error = !sorted.success;
    if (sorted.success) {
      const lastLine: number = textEditor.document.lineCount - 1;
      const textRange: vscode.Range = new vscode.Range(0,
        textEditor.document.lineAt(0).range.start.character,
        lastLine,
        textEditor.document.lineAt(lastLine).range.end.character);
      edit.replace(textRange, sorted.result);
    }
  }
  else {
    // There are selections - iterate through each.
    for (const selection of textEditor.selections) {
      if (selection.isEmpty) {
        // No text to transform.
        continue;
      }

      const text: string = textEditor.document.getText(selection);
      if (text.length < 2) {
        // All JSON is at least two characters, even empty string/object. If it's a single-digit number,
        // there's arguably nothing to sort anyway.
        continue;
      }

      const sorted: StringifyResult = sortJson(text, textEditor.options, selection.start, outputChannel);
      if (!sorted.success) {
        error = true;
        continue;
      }

      edit.replace(selection, sorted.result);
    }
  }

  return !error;
}

function sortJson(original: string, editorOptions: vscode.TextEditorOptions, start: vscode.Position, outputChannel: vscode.OutputChannel): StringifyResult {
  const opts: stringify.Options = {
    space: editorOptions.insertSpaces ? editorOptions.tabSize : '\t',
  };

  let sorted: string = '';
  let success: boolean = false;
  try {
    sorted = stringify(JSON5.parse(original), opts);
    success = true;
  } catch (e) {
    // Basic error message to output window.
    const message = 'Error doing stable stringify of the JSON content which starts at line ' + start.line + ', char ' + start.character + '.'
    outputChannel.appendLine(message);
    outputChannel.appendLine(e.message);
    outputChannel.appendLine('Sort errors usually are from malformed JSON - missing comma, extra comma, etc.');

    // Details with stack trace to the JS console.
    console.error(message);
    console.error(e);
  }

  return new StringifyResult(success, sorted);
}

