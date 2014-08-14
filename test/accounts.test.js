var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('Accounts', function () {

  describe('constructor', function () {

    var esendex;
    var accounts;

    before(function () {
      esendex = {};
      var Accounts = proxyquire('../lib/accounts', { './xmlparser': sinon.stub().returns(sinon.spy()) });
      accounts = Accounts(esendex);
    });

    it('should create an instance of the accounts api', function () {
      assert.notEqual(accounts, null);
      assert.equal(typeof accounts, 'object');
    });

    it('should expose the esendex api', function () {
      assert.equal(accounts.esendex, esendex);
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
      requestStub = sinon.stub().callsArgWith(4, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { dog: 'cat' };
      callbackSpy = sinon.spy();
      responseObject = { accounts: 'accounts' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Accounts = proxyquire('../lib/accounts', {'./xmlparser': sinon.stub().returns(parserStub) });
      var accounts = Accounts(esendexFake);
      accounts.get(options, callbackSpy);
    });

    it('should call the accounts endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/accounts', options, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed accounts response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.accounts);
    });

  });

  describe('get when request error', function () {

    var requestError;
    var callbackSpy;

    before(function () {
      requestError = new Error('some request error');
      var esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(4, requestError)
        }
      };
      callbackSpy = sinon.spy();

      var Accounts = proxyquire('../lib/accounts', {'./xmlparser': sinon.stub() });
      var accounts = Accounts(esendexFake);
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
      var esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(4, null, 'some response data')
        }
      };
      callbackSpy = sinon.spy();

      var parserStub = sinon.stub().callsArgWith(1, parserError);

      var Accounts = proxyquire('../lib/accounts', {'./xmlparser': sinon.stub().returns(parserStub) });
      var accounts = Accounts(esendexFake);
      accounts.get(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

});