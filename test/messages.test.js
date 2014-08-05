var assert = require('assert'),
    sinon = require('sinon');
var Messages = require('../lib/messages');

describe('Messages', function () {

  describe('constructor', function () {

    var esendex;
    var messages;

    before(function () {
      esendex = {};
      messages = Messages(esendex);
    });

    it('should create an instance of the messages api', function () {
      assert.notEqual(messages, null);
      assert.equal(typeof messages, 'object');
    });

    it('should expose the esendex api', function () {
      assert.equal(messages.esendex, esendex);
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
      responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(4, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { dog: 'cat' };
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: 'messageheaders' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var requireStub = sinon.stub();
      requireStub.withArgs('./xmlparser').returns(sinon.stub().returns(parserStub));
      requireStub.returns(sinon.spy());

      var messages = Messages(esendexFake, requireStub);
      messages.get(options, callbackSpy);
    });

    it('should call the messageheaders endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/messageheaders', options, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messageheaders response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheaders);
    });

  });

  describe('send', function () {

    var requestXml;
    var responseXml;
    var requestStub;
    var callbackSpy;
    var responseObject;
    var buildObjectStub;
    var parserStub;
    var builderStub;
    var messagesToSend;

    before(function () {
      requestXml = 'could be anything really';
      responseXml = 'some message headers response';
      requestStub = sinon.stub().callsArgWith(4, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: 'messageheaders' };
      buildObjectStub = sinon.stub().returns(requestXml);
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);
      builderStub = sinon.stub().returns(buildObjectStub);

      var requireStub = sinon.stub();
      requireStub.withArgs('./xmlparser').returns(sinon.stub().returns(parserStub));
      requireStub.withArgs('./xmlbuilder').returns(builderStub);

      messagesToSend = { some: 'messages' };

      var messages = Messages(esendexFake, requireStub);
      messages.send(messagesToSend, callbackSpy);
    });

    it('should create an xml builder with the messages root element', function () {
      sinon.assert.calledWith(builderStub, 'messages');
    });

    it('should call the messagedispatcher endpoint', function () {
      sinon.assert.calledWith(requestStub, 'POST', '/v1.0/messagedispatcher', requestXml, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messagedispatcher response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheaders);
    });

  });

});