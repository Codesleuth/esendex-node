import assert = require('assert')
import sinon = require('sinon')
import _proxyquire = require('proxyquire')
import {Client} from '../lib/client'
let proxyquire = _proxyquire.noCallThru()

describe('Client', function () {

  describe('expose all public apis', function () {

    var options;
    var requestHandlerFake;
    var messagesFake;
    var accountsFake;
    var inboxFake;
    var batchesFake;
    var requestHandlerStub;
    var messagesStub;
    var accountsStub;
    var inboxStub;
    var batchesStub;
    var client: Client;

    before(function () {
      options = {
        some: 'option',
        other: 'yes'
      };
      
      requestHandlerFake = {};
      messagesFake = {};
      accountsFake = {};
      inboxFake = {};
      batchesFake = {};

      requestHandlerStub = sinon.stub().returns(requestHandlerFake);
      messagesStub = sinon.stub().returns(messagesFake);
      accountsStub = sinon.stub().returns(accountsFake);
      inboxStub = sinon.stub().returns(inboxFake);
      batchesStub = sinon.stub().returns(batchesFake);

      var module = proxyquire('../lib/client', {
        './requesthandler': { RequestHandler: requestHandlerStub },
        './messages': { Messages: messagesStub },
        './accounts': { Accounts: accountsStub },
        './inbox': { Inbox: inboxStub },
        './batches': { Batches: batchesStub },
      });
      
      client = new module.Client(options);
    });

    it('should create an instance of the request handler api', function () {
      sinon.assert.calledWithNew(requestHandlerStub);
      sinon.assert.calledWith(requestHandlerStub, options);
    });

    it('should create an instance of the messages api', function () {
      sinon.assert.calledWithNew(messagesStub);
    });

    it('should create an instance of the accounts api', function () {
      sinon.assert.calledWithNew(accountsStub);
    });

    it('should create an instance of the inbox api', function () {
      sinon.assert.calledWithNew(inboxStub);
    });

    it('should create an instance of the batches api', function () {
      sinon.assert.calledWithNew(batchesStub);
    });

    it('should expose all expected apis', function () {
      assert.strictEqual(client.requesthandler, requestHandlerFake);
      assert.strictEqual(client.messages, messagesFake);
      assert.strictEqual(client.accounts, accountsFake);
      assert.strictEqual(client.inbox, inboxFake);
      assert.strictEqual(client.batches, batchesFake);
    });

  });

});