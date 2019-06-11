import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { assert } from 'chai';
import * as entry from '../src/extension';

describe('Entry point', () => {
  context('ensures that', () => {
    let sandbox: sinon.SinonSandbox;
    const extensionContext = { } as any as vscode.ExtensionContext;
    const subscriptions: Array<{ dispose(): any }> = [];

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      subscriptions.length = 0;
      extensionContext.subscriptions = subscriptions;
    });

    afterEach(() => {
      sandbox.restore();
    });

    context('when activated', () => {
      let infoStub: sinon.SinonStub<any, any>;
      let registerStub: sinon.SinonStub<any, any>;

      beforeEach(() => {
        infoStub = sandbox.stub(console, 'info');
        registerStub = sandbox.stub(vscode.commands, 'registerTextEditorCommand');
      });

      it('activates the extension', () => {
        entry.activate(extensionContext);
        assert.equal(1, extensionContext.subscriptions.length);
        assert.isTrue(registerStub.calledOnceWithExactly('extension.vscode-json-stable-stringify.jsonStableSort', sinon.match.any));
      });

      it('prints an activation informative message', () => {
        entry.activate(extensionContext);
        assert.isTrue(infoStub.calledOnceWithExactly('[vscode-json-stable-stringify] activated!'));
      });
    });

    context('when deactivated', () => {
      it('does nothing', () => {
        return entry.deactivate();
      });
    });
  })
});
