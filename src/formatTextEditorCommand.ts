import * as vscode from 'vscode';
import { StringifyResult } from './stringifyResult';
import stringify from 'json-stable-stringify';
import JSON5 from 'json5';

/**
 * Handles the command that executes formatting.
 * @param {vscode.TextEditor} textEditor - The text editor instance with the document to format.
 * @param {vscode.TextEditorEdit} edit - Object for handling text editing transactions.
 */
export function formatTextEditorCommand(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): void {
  const outputChannel = vscode.window.createOutputChannel('Sort JSON (Stable)');
  try {
    if (!sortAndReplace(textEditor, edit, outputChannel)) {
      outputChannel.show(true);
      vscode.window.showErrorMessage('Error during JSON sort. See output window for details.');
    }
  } finally {
    outputChannel.dispose();
  }
}

/**
 * Sorts JSON and replaces the original content with the sorted content.
 * @param {vscode.TextEditor} textEditor - The text editor instance with the document to format.
 * @param {vscode.TextEditorEdit} edit - Object for handling text editing transactions.
 * @param {vscode.OutputChannel} outputChannel - Output for errors and warnings.
 * @return {boolean} True if the operation succeeded; false if an error was shown.
 */
function sortAndReplace(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, outputChannel: vscode.OutputChannel): boolean {
  let error = false;
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
  } else {
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

/**
 * Executes the actual sort operation on JSON - deserialize, sort, serialize. Reports errors to the output channel.
 * @param {string} original - The original text containing JSON.
 * @param {vscode.TextEditorOptions} editorOptions - The options for the editor, used for formatting information.
 * @param {vscode.Position} start - The position at which the JSON starts, used for reporting errors.
 * @param {vscode.OutputChannel} outputChannel - The output channel where errors should be written.
 * @return {StringifyResult} The result of the sorting operation.
 */
function sortJson(original: string, editorOptions: vscode.TextEditorOptions, start: vscode.Position, outputChannel: vscode.OutputChannel): StringifyResult {
  const opts: stringify.Options = {
    space: editorOptions.insertSpaces ? editorOptions.tabSize : '\t',
  };

  let sorted = '';
  let success = false;
  try {
    sorted = stringify(JSON5.parse(original), opts);
    success = true;
  } catch (e) {
    var error = "[unknown error]";
    if (typeof e === "string") {
      error = e;
    } else if (e instanceof Error) {
      error = e.message;
    }

    // Basic error message to output window.
    const message = 'Error doing stable stringify of the JSON content which starts at line ' + start.line + ', char ' + start.character + '.';
    outputChannel.appendLine(message);
    outputChannel.appendLine(error);
    outputChannel.appendLine('Sort errors usually are from malformed JSON - missing comma, extra comma, etc.');

    // Details with stack trace to the JS console.
    console.error(message);
    console.error(e);
  }

  return new StringifyResult(success, sorted);
}
