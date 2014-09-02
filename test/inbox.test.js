var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('Inbox', function () {

  describe('constructor', function () {

    var esendex;
    var inbox;

    before(function () {
      esendex = {};
      var Inbox = proxyquire('../lib/inbox', { './xmlparser': sinon.stub().returns(sinon.spy()) });
      inbox = Inbox(esendex);
    });

    it('should create an instance of the inbox api', function () {
      assert.notEqual(inbox, null);
      assert.equal(typeof inbox, 'object');
    });

    it('should expose the esendex api', function () {
      assert.equal(inbox.esendex, esendex);
    });

  });

  describe('get', function () {

    var responseXml;
    var requestStub;
    var options;
    var callbackSpy;
    var responseObject;
    var parserStub;

    before(function () {
      responseXml = 'not actually xml here';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { banana: 'pineapple' };
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: 'messageheaders' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub().returns(parserStub) });
      var inbox = Inbox(esendexFake);
      inbox.get(options, callbackSpy);
    });

    it('should call the inbox endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/inbox/messages', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed inbox response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheaders);
    });

  });

  describe('get when request error', function () {

    var requestError;
    var callbackSpy;

    before(function () {
      requestError = new Error('some request error');
      var esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, requestError)
        }
      };
      callbackSpy = sinon.spy();

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub() });
      var inbox = Inbox(esendexFake);
      inbox.get(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

  describe('get when parser error', function () {

    var parserError;
    var callbackSpy;

    before(function () {
      parserError = new Error('some parser error');
      var esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some response data')
        }
      };
      callbackSpy = sinon.spy();

      var parserStub = sinon.stub().callsArgWith(1, parserError);

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub().returns(parserStub) });
      var inbox = Inbox(esendexFake);
      inbox.get(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

  describe('get for specific account', function () {

    var responseXml;
    var requestStub;
    var options;
    var callbackSpy;
    var responseObject;
    var parserStub;

    before(function () {
      responseXml = 'jargon';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { accountreference: 'EX00PEAR', banana: 'pineapple' };
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: 'messageheaders' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub().returns(parserStub) });
      var inbox = Inbox(esendexFake);
      inbox.get(options, callbackSpy);
    });

    it('should call the inbox endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/inbox/EX00PEAR/messages', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed inbox response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheaders);
    });

  });

  describe('mark read status', function () {

    var responseXml;
    var requestStub;
    var options;
    var expectedPath;
    var callbackSpy;
    var parserStub;

    before(function () {
      responseXml = 'jargon';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { id: 'd0c8c6f0-6e8b-4ec7-8ad3-c1f8109e753e', read: true };
      expectedPath = '/v1.0/inbox/messages/' + options.id;
      callbackSpy = sinon.spy();
      parserStub = sinon.stub().callsArgWith(1, null, '');

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub().returns(parserStub) });
      var inbox = Inbox(esendexFake);
      inbox.update(options, callbackSpy);
    });

    it('should call the inbox message endpoint', function () {
      sinon.assert.calledWith(requestStub, 'PUT', expectedPath, { action: 'read' }, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback without a response', function () {
      sinon.assert.calledWith(callbackSpy, null);
    });

  });

  describe('mark unread status', function () {

    var responseXml;
    var requestStub;
    var options;
    var expectedPath;
    var callbackSpy;
    var parserStub;

    before(function () {
      responseXml = 'jargon';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { id: 'b13bf37b-9196-4837-8eaf-edd4bc2a7021', read: false };
      expectedPath = '/v1.0/inbox/messages/' + options.id;
      callbackSpy = sinon.spy();
      parserStub = sinon.stub().callsArgWith(1, null, '');

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub().returns(parserStub) });
      var inbox = Inbox(esendexFake);
      inbox.update(options, callbackSpy);
    });

    it('should call the inbox message endpoint', function () {
      sinon.assert.calledWith(requestStub, 'PUT', expectedPath, { action: 'unread' }, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback without a response', function () {
      sinon.assert.calledWith(callbackSpy, null);
    });

  });

  describe('mark read or unread when request error', function () {

    var requestError;
    var callbackSpy;

    before(function () {
      requestError = new Error('some request error');
      var esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, requestError)
        }
      };
      callbackSpy = sinon.spy();

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub() });
      var inbox = Inbox(esendexFake);
      inbox.update({ id: 'fsf', read: false }, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

  describe('mark read or unread when parser error', function () {

    var parserError;
    var callbackSpy;

    before(function () {
      parserError = new Error('some parser error');
      var esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some response data')
        }
      };
      callbackSpy = sinon.spy();

      var parserStub = sinon.stub().callsArgWith(1, parserError);

      var Inbox = proxyquire('../lib/inbox', {'./xmlparser': sinon.stub().returns(parserStub) });
      var inbox = Inbox(esendexFake);
      inbox.update({ id: 'asda', read: true }, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

});