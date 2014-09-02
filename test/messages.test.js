var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('Messages', function () {

  describe('constructor', function () {

    var esendex;
    var messages;

    before(function () {
      esendex = {};
      var Messages = proxyquire('../lib/messages', {});
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

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
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

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub() });
      var messages = Messages(esendexFake);
      messages.get(null, callbackSpy);
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

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
      messages.get(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
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

      messagesToSend = { some: 'messages' };

      var Messages = proxyquire('../lib/messages', { 
        './xmlparser': sinon.stub().returns(parserStub),
        './xmlbuilder': builderStub
      });
      var messages = Messages(esendexFake);
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

  describe('send when request error', function () {

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

      var builderStub = sinon.stub().returns(sinon.stub().returns('akjshdjsahd'));

      var Messages = proxyquire('../lib/messages', { 
        './xmlparser': sinon.stub(),
        './xmlbuilder': builderStub
      });
      var messages = Messages(esendexFake);
      messages.send('asdsadd', callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

  describe('send when parser error', function () {

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
      var builderStub = sinon.stub().returns(sinon.stub().returns('akjshdjsahd'));

      var Messages = proxyquire('../lib/messages', { 
        './xmlparser': sinon.stub().returns(parserStub),
        './xmlbuilder': builderStub
      });
      var messages = Messages(esendexFake);
      messages.send('dgdfg', callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

  describe('getBody', function () {

    var responseXml;
    var requestStub;
    var messageId;
    var expectedPath;
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
      messageId = 'e0ad7982-2670-4a91-9ab9-12687eaacb96';
      expectedPath = '/v1.0/messageheaders/' + messageId + '/body';
      callbackSpy = sinon.spy();
      responseObject = { messagebody: 'messagebody' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
      messages.getBody(messageId, callbackSpy);
    });

    it('should call the messageheader body endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', expectedPath, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messagebody response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messagebody);
    });

  });

  describe('getBody when request error', function () {

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

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub() });
      var messages = Messages(esendexFake);
      messages.getBody('adasdasd', callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

  describe('getBody when parser error', function () {

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

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
      messages.getBody(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

});