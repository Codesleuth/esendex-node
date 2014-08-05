var assert = require('assert'),
    sinon = require('sinon');
var Accounts = require('../lib/accounts');

describe('Accounts', function () {

  describe('constructor', function () {

    var esendex;
    var accounts;

    before(function () {
      esendex = {};
      accounts = Accounts(esendex, sinon.stub().returns(sinon.spy()));
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

      var requireStub = sinon.stub();
      requireStub.withArgs('./xmlparser').returns(sinon.stub().returns(parserStub));

      var accounts = Accounts(esendexFake, requireStub);
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

});