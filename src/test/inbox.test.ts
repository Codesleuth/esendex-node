import assert = require('assert')
import sinon = require('sinon')
import _proxyquire = require('proxyquire')
import {Inbox} from '../lib/inbox'
let proxyquire = _proxyquire.noCallThru()

describe('Inbox', function () {

  describe('get', function () {

    var responseXml;
    var requestStub;
    var options;
    var callbackSpy;
    var expectedMessageHeaders;
    var parseStringStub;
    var xmlParserStub;

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
      expectedMessageHeaders = 'messageheaders';
      let responseObject = { messageheaders: expectedMessageHeaders };
      
      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      var module = proxyquire('../lib/inbox', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      var inbox: Inbox = new module.Inbox(esendexFake);
      inbox.get(options, callbackSpy);
    });

    it('should create an instance of the XmlParser', function () {
      sinon.assert.calledOnce(xmlParserStub);
      sinon.assert.calledWithNew(xmlParserStub);
    });

    it('should call the inbox endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/inbox/messages', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed inbox response', function () {
      sinon.assert.calledWith(callbackSpy, null, expectedMessageHeaders);
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
      
      var module = proxyquire('../lib/inbox', {
        './xmlparser': { XmlParser: sinon.stub() }
      });
      var inbox: Inbox = new module.Inbox(esendexFake);
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

      let parseStringStub = sinon.stub().callsArgWith(1, parserError)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      var module = proxyquire('../lib/inbox', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      var inbox: Inbox = new module.Inbox(esendexFake);
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
    var parseStringStub;

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
      
      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      var module = proxyquire('../lib/inbox', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      var inbox: Inbox = new module.Inbox(esendexFake);
      inbox.get(options, callbackSpy);
    });

    it('should call the inbox endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/inbox/EX00PEAR/messages', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
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

      var module = proxyquire('../lib/inbox', {});
      var inbox: Inbox = new module.Inbox(esendexFake);
      inbox.update(options, callbackSpy);
    });

    it('should call the inbox message endpoint', function () {
      sinon.assert.calledWith(requestStub, 'PUT', expectedPath, { action: 'read' }, null, 200, sinon.match.func);
    });

    it('should call the callback without a response', function () {
      sinon.assert.calledWith(callbackSpy, null);
    });

  });

  describe('mark unread status', function () {

    var requestStub;
    var options;
    var expectedPath;
    var callbackSpy;

    before(function () {
      requestStub = sinon.stub().callsArgWith(5, null, '');
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { id: 'b13bf37b-9196-4837-8eaf-edd4bc2a7021', read: false };
      expectedPath = '/v1.0/inbox/messages/' + options.id;
      callbackSpy = sinon.spy();

      var module = proxyquire('../lib/inbox', {});
      var inbox: Inbox = new module.Inbox(esendexFake);
      inbox.update(options, callbackSpy);
    });

    it('should call the inbox message endpoint', function () {
      sinon.assert.calledWith(requestStub, 'PUT', expectedPath, { action: 'unread' }, null, 200, sinon.match.func);
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

      var module = proxyquire('../lib/inbox', {});
      var inbox: Inbox = new module.Inbox(esendexFake);
      inbox.update({ id: 'sdfsf', read: false }, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

  describe('delete inbox message', function () {

    var requestStub;
    var expectedPath;
    var callbackSpy;

    before(function () {
      requestStub = sinon.stub().callsArgWith(5, null, '');
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      var id = 'b13bf37b-9196-4837-8eaf-edd4bc2a7021';
      expectedPath = '/v1.0/inbox/messages/' + id;
      callbackSpy = sinon.spy();

      var module = proxyquire('../lib/inbox', {});
      var inbox: Inbox = new module.Inbox(esendexFake);
      inbox.delete(id, callbackSpy);
    });

    it('should call the inbox message endpoint', function () {
      sinon.assert.calledWith(requestStub, 'DELETE', expectedPath, null, null, 200, sinon.match.func);
    });

    it('should call the callback without a response', function () {
      sinon.assert.calledWith(callbackSpy, null);
    });

  });

  describe('delete inbox message when request error', function () {

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

      var module = proxyquire('../lib/inbox', {});
      var inbox: Inbox = new module.Inbox(esendexFake);
      inbox.delete('sdfsdsdfds', callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

});