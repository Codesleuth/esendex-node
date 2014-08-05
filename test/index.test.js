var assert = require('assert'),
    sinon = require('sinon');
var Esendex = require('../');

describe('Esendex', function () {

  describe('constructor', function () {

    var esendex;

    before(function () {
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

      var requireStub = sinon.stub();
      requireStub.withArgs('./requesthandler').returns(requestSpy);
      requireStub.returns(function () {});

      Esendex(options, requireStub);
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

      var requireStub = sinon.stub();
      requireStub.withArgs('./messages').returns(messagesSpy);
      requireStub.returns(function () {});

      esendex = Esendex(null, requireStub);
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
      
      var requireStub = sinon.stub();
      requireStub.withArgs('./accounts').returns(accountsSpy);
      requireStub.returns(function () {});

      esendex = Esendex(null, requireStub);
    });

    it('should expose an instance of the accounts api', function () {
      sinon.assert.called(accountsSpy);
    });

    it('should pass through itself to the accounts api', function () {
      sinon.assert.calledWith(accountsSpy, esendex);
    });

  });

});