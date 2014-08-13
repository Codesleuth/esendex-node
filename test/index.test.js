var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('Esendex', function () {

  describe('constructor', function () {

    var esendex;

    before(function () {
      var Esendex = proxyquire('../', {});
      esendex = Esendex();
    });

    it('should create an instance of the client library', function () {
      assert.notEqual(esendex, null);
      assert.equal(typeof esendex, 'object');
    });

  });

  describe('requesthandler module', function () {

    var options;
    var requestSpy;

    before(function () {
      options = {
        some: 'option',
        other: 'yes'
      };

      requestSpy = sinon.spy();

      var Esendex = proxyquire('../', { './requesthandler': requestSpy });
      Esendex(options);
    });

    it('should expose an instance of the request api', function () {
      sinon.assert.called(requestSpy);
    });

    it('should pass through the options to the request api', function () {
      sinon.assert.calledWith(requestSpy, options);
    });

  });

  describe('messages', function () {

    var esendex;
    var messagesSpy;

    before(function () {
      messagesSpy = sinon.spy();

      var Esendex = proxyquire('../', { './messages': messagesSpy });
      esendex = Esendex(null);
    });

    it('should expose an instance of the messages api', function () {
      sinon.assert.called(messagesSpy);
    });

    it('should pass through itself to the messages api', function () {
      sinon.assert.calledWith(messagesSpy, esendex);
    });

  });

  describe('accounts', function () {

    var esendex;
    var accountsSpy;

    before(function () {
      accountsSpy = sinon.spy();

      var Esendex = proxyquire('../', { './accounts': accountsSpy });
      esendex = Esendex(null);
    });

    it('should expose an instance of the accounts api', function () {
      sinon.assert.called(accountsSpy);
    });

    it('should pass through itself to the accounts api', function () {
      sinon.assert.calledWith(accountsSpy, esendex);
    });

  });

});