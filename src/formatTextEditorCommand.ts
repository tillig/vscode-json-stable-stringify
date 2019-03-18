import * as vscode from 'vscode';
import { StringifyResult } from './stringifyResult';
import * as stringify from 'json-stable-stringify';

export function formatTextEditorCommand(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit){
  let error: boolean = false;
  if(textEditor.selections.length === 1 && textEditor.selections[0].isEmpty) {
    // TODO: There's no selection - do the whole doc.
    let text: string = textEditor.document.getText();
    if (text.length < 2) {
      // All JSON is at least two characters, even empty string/object.
      return;
    }

    let sorted: StringifyResult = sortJson(text, textEditor.options, new vscode.Position(1, 1));
    error = !sorted.success;
    if (sorted.success) {
      let lastLine: number = textEditor.document.lineCount - 1;
      let textRange: vscode.Range = new vscode.Range(0,
        textEditor.document.lineAt(0).range.start.character,
        lastLine,
        textEditor.document.lineAt(lastLine).range.end.character);
      edit.replace(textRange, sorted.result);
    }
  }
  else {
    // There are selections - iterate through each.
    for(var selectionIndex = 0; selectionIndex < textEditor.selections.length; selectionIndex++) {
      let selection: vscode.Selection = textEditor.selections[selectionIndex];
      if(selection.isEmpty) {
        // No text to transform.
        continue;
      }

      let text: string = textEditor.document.getText(selection);
      if(text.length < 2) {
        // All JSON is at least two characters, even empty string/object.
        continue;
      }

      let sorted: StringifyResult = sortJson(text, textEditor.options, selection.start);
      if (!sorted.success) {
        error = true;
        continue;
      }

      edit.replace(selection, sorted.result);
    }
  }

  if (error) {
    vscode.window.showErrorMessage("Error during JSON sort. See console for details.");
  }
}

function sortJson(original: string, editorOptions: vscode.TextEditorOptions, start: vscode.Position) : StringifyResult {
  let opts: stringify.Options = {
    "space": editorOptions.insertSpaces ? editorOptions.tabSize : '\t'
  };

  let sorted: string = "";
  let success: boolean = false;
  try {
    sorted = stringify(JSON.parse(original), opts);
    success = true;
  } catch (e) {
    console.log("Error doing stable stringify of JSON content at line {0}, char {1}:", start.line, start.character);
    console.log(e.Message);
    console.log("Content:");
    console.log(original);
  }

  return new StringifyResult(success, sorted);
}

