import * as assert from 'assert';
import * as vscode from 'vscode';

const COMMAND_ID = 'extension.vscode-json-stable-stringify.jsonStableSort';
const EXTENSION_ID = 'TravisIllig.vscode-json-stable-stringify';

async function createDocumentWithContent(
  content: string
): Promise<vscode.TextEditor> {
  const doc = await vscode.workspace.openTextDocument({
    content,
    language: 'json'
  });
  const editor = await vscode.window.showTextDocument(doc);
  editor.options = { tabSize: 2, insertSpaces: true };
  return editor;
}

suite('Extension test suite', () => {
  suiteSetup(async () => {
    await vscode.extensions.getExtension(EXTENSION_ID)?.activate();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('should be present', () => {
    assert.ok(vscode.extensions.getExtension(EXTENSION_ID));
  });

  test('should activate', () => {
    return vscode.extensions
      .getExtension(EXTENSION_ID)
      ?.activate()
      .then(() => {
        assert.ok(true);
      });
  });

  test('command is registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.notStrictEqual(-1, commands.indexOf(COMMAND_ID));
  });

  test('sorts object keys alphabetically', async () => {
    const input = '{"zebra": 1, "apple": 2, "mango": 3}';
    const expected = '{\n  "apple": 2,\n  "mango": 3,\n  "zebra": 1\n}';

    const editor = await createDocumentWithContent(input);
    await vscode.commands.executeCommand(COMMAND_ID);

    const result = editor.document.getText();
    assert.strictEqual(result, expected);
  });

  test('sorts nested objects recursively', async () => {
    const input = '{"b": {"z": 1, "a": 2}, "a": 1}';
    const expected = '{\n  "a": 1,\n  "b": {\n    "a": 2,\n    "z": 1\n  }\n}';

    const editor = await createDocumentWithContent(input);
    await vscode.commands.executeCommand(COMMAND_ID);

    const result = editor.document.getText();
    assert.strictEqual(result, expected);
  });

  test('sorts only selected text when selection exists', async () => {
    const input = '{"z": 1, "a": 2}\n{"y": 3, "b": 4}';

    const editor = await createDocumentWithContent(input);
    // Select only the first line
    editor.selection = new vscode.Selection(0, 0, 0, 17);
    await vscode.commands.executeCommand(COMMAND_ID);

    const result = editor.document.getText();
    assert.strictEqual(result, '{\n  "a": 2,\n  "z": 1\n}\n{"y": 3, "b": 4}');
  });

  test('handles JSON with comments (JSON5)', async () => {
    const input = '{\n  // a comment\n  "b": 2,\n  "a": 1\n}';
    const expected = '{\n  "a": 1,\n  "b": 2\n}';

    const editor = await createDocumentWithContent(input);
    await vscode.commands.executeCommand(COMMAND_ID);

    const result = editor.document.getText();
    assert.strictEqual(result, expected);
  });
});
