import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { assert } from 'chai';
import * as entry from '../src/extension';

describe("Entry point", function () {
  context('ensures that', function(){
    let sandbox: sinon.SinonSandbox;
    let extensionContext: vscode.ExtensionContext = <vscode.ExtensionContext>{ };
    let subscriptions: { dispose(): any }[] = [];

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      subscriptions.length = 0;
      extensionContext.subscriptions = subscriptions;
    });

    afterEach(function () {
      sandbox.restore();
    });

    context('when activated', function () {
      let infoStub: sinon.SinonStub<any, any>;
      let registerStub: sinon.SinonStub<any, any>;

      beforeEach(function () {
        infoStub = sandbox.stub(console, 'info');
        registerStub = sandbox.stub(vscode.commands, 'registerTextEditorCommand');
      });

      it('activates the extension', function () {
        entry.activate(extensionContext);
        assert.equal(1, extensionContext.subscriptions.length);
        assert.isTrue(registerStub.calledOnceWithExactly('extension.jsonStableSort', sinon.match.any));
      });

      it('prints an activation informative message', function () {
        entry.activate(extensionContext);
        assert.isTrue(infoStub.calledOnceWithExactly('[vscode-json-stable-stringify] activated!'));
      });
    });

    context('when deactivated', function () {
      it('does nothing', function () {
        return entry.deactivate();
      });
    });
  })
});
