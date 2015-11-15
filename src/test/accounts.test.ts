import {Client} from '../lib/client'
import * as assert from 'assert'
import sinon = require('sinon')
import _proxyquire = require('proxyquire')
let proxyquire = _proxyquire.noCallThru()

describe('Accounts', function () {

  describe('get all', function () {

    var responseXml;
    var requestStub;
    var options;
    var callbackSpy;
    var responseObject;
    var parseStringStub: Sinon.SinonStub;
    var xmlParserStub: Sinon.SinonStub;

    before(function () {
      responseXml = 'not actually xml here';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let client = { requesthandler: { request: requestStub } };
      options = { dog: 'cat' };
      callbackSpy = sinon.spy();
      responseObject = { accounts: { account: ['accounts'] } };
      
      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let Accounts = proxyquire('../lib/accounts', {
        './xmlparser': { XmlParser: xmlParserStub }
      }).Accounts;
      let accounts = new Accounts(client);
      accounts.get(options, callbackSpy);
    });

    it('should create an instance of the XmlParser', function () {
      sinon.assert.calledWithNew(xmlParserStub);
    });

    it('should call the accounts endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/accounts', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed accounts response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.accounts);
    });

  });

  describe('get all with one account returned', function () {

    var expectedAccount;
    var callbackSpy;

    before(function () {
      let client = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'not actually xml here')
        }
      };
      callbackSpy = sinon.spy();
      expectedAccount = 'not an array';
      let responseObject = { accounts: { account: expectedAccount } };
      
      let parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let Accounts = proxyquire('../lib/accounts', {
        './xmlparser': { XmlParser: xmlParserStub }
      }).Accounts;
      let accounts = new Accounts(client);
      accounts.get({}, callbackSpy);
    });

    it('should return an array of a single account', function () {
      sinon.assert.calledWith(callbackSpy, null, { account: [expectedAccount] });
    });

  });

  describe('get specific account', function () {

    var responseXml;
    var requestStub;
    var expectedPath;
    var callbackSpy;
    var expectedAccount;
    var parseStringStub: Sinon.SinonStub;

    before(function () {
      responseXml = 'not actually xml here';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let client = {
        requesthandler: {
          request: requestStub
        }
      };
      let options = { id: '1fecafcf-0c33-481c-bec8-7ca272ba71c3', crab: 'lobster' };
      expectedPath = '/v1.0/accounts/' + options.id;
      callbackSpy = sinon.spy();
      expectedAccount = { id: 'value' };
      let responseObject = { account: expectedAccount };
      
      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let Accounts = proxyquire('../lib/accounts', {
        './xmlparser': { XmlParser: xmlParserStub }
      }).Accounts;
      let accounts = new Accounts(client);
      accounts.get(options, callbackSpy);
    });

    it('should call the accounts endpoint with the specific message id', function () {
      sinon.assert.calledWith(requestStub, 'GET', expectedPath, sinon.match({ id: undefined }), null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed account response', function () {
      sinon.assert.calledWith(callbackSpy, null, expectedAccount);
    });

  });

  describe('get when request error', function () {

    var requestError;
    var callbackSpy;

    before(function () {
      requestError = new Error('some request error');
      let client = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, requestError)
        }
      };
      callbackSpy = sinon.spy();
      
      let Accounts = proxyquire('../lib/accounts', {
        './xmlparser': { XmlParser: sinon.stub() }
      }).Accounts;
      let accounts = new Accounts(client);
      accounts.get(null, callbackSpy);
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
      let client = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some response data')
        }
      };
      callbackSpy = sinon.spy();

      let parseStringStub = sinon.stub().callsArgWith(1, parserError)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let Accounts = proxyquire('../lib/accounts', {
        './xmlparser': { XmlParser: xmlParserStub }
      }).Accounts;
      let accounts = new Accounts(client);
      accounts.get(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

});