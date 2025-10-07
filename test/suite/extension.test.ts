import * as assert from 'assert';
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension test suite', () => {
  suiteSetup(async () => {
    vscode.window.showInformationMessage('Start all tests.');
    await vscode.extensions
      .getExtension('TravisIllig.vscode-json-stable-stringify')
      ?.activate();
  });

  test('should be present', () => {
    assert.ok(
      vscode.extensions.getExtension('TravisIllig.vscode-json-stable-stringify')
    );
  });

  test('should activate', () => {
    return vscode.extensions
      .getExtension('TravisIllig.vscode-json-stable-stringify')
      ?.activate()
      .then(() => {
        assert.ok(true);
      });
  });

  test('command is registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.notStrictEqual(
      -1,
      commands.indexOf('extension.vscode-json-stable-stringify.jsonStableSort')
    );
  });
});
