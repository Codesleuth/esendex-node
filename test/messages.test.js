var assert = require('assert'),
    sinon = require('sinon'),
    isArray = require('util').isArray,
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

  describe('get all', function () {

    var responseXml;
    var requestStub;
    var options;
    var callbackSpy;
    var responseObject;
    var parserStub;

    before(function () {
      responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { dog: 'cat' };
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: { messageheader: ['messageheaders'] } };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
      messages.get(options, callbackSpy);
    });

    it('should call the messageheaders endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/messageheaders', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messageheaders response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheaders);
    });

  });

  describe('get all with one message returned', function () {

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
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: { messageheader: 'not an array' } };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
      messages.get({}, callbackSpy);
    });

    it('should return an array of a single message header', function () {
      sinon.assert.calledWith(callbackSpy, null, { messageheader: sinon.match.array.and(sinon.match.has("length", 1)) });
    });

  });

  describe('get specific message', function () {

    var responseXml;
    var requestStub;
    var options;
    var expectedPath;
    var callbackSpy;
    var responseObject;
    var parserStub;

    before(function () {
      responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { id: '6aa73324-1ac6-4f6f-b5df-9dec5bdd5d64', piano: 'violin' };
      expectedPath = '/v1.0/messageheaders/' + options.id;
      callbackSpy = sinon.spy();
      responseObject = { messageheader: 'messageheader' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
      messages.get(options, callbackSpy);
    });

    it('should call the messageheaders endpoint with the specific message id', function () {
      sinon.assert.calledWith(requestStub, 'GET', expectedPath, sinon.match({ id: undefined }), null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messageheader response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheader);
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
          request: sinon.stub().callsArgWith(5, null, 'some response data')
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

  describe('send returns a single message', function () {

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
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: { messageheader: 'a single message header' } };
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
      sinon.assert.calledWith(requestStub, 'POST', '/v1.0/messagedispatcher', null, requestXml, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messagedispatcher response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheaders);
    });

    it('should return an array of a single sent message header', function () {
      sinon.assert.calledWith(callbackSpy, null, { messageheader: sinon.match.array.and(sinon.match.has("length", 1)) });
    });

  });

  describe('send returns multiple messages', function () {

    var callbackSpy;

    before(function () {
      var esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some message headers response')
        }
      };
      callbackSpy = sinon.spy();
      var responseObject = { messageheaders: { messageheader: ['an array of message header'] } };
      var buildObjectStub = sinon.stub().returns('could be anything really');
      var parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Messages = proxyquire('../lib/messages', { 
        './xmlparser': sinon.stub().returns(parserStub),
        './xmlbuilder': sinon.stub().returns(buildObjectStub)
      });
      var messages = Messages(esendexFake);
      messages.send({}, callbackSpy);
    });

    it('should return an array of a single sent message header', function () {
      sinon.assert.calledWith(callbackSpy, null, { messageheader: sinon.match.array.and(sinon.match.has("length", 1)) });
    });

  });

  describe('send when request error', function () {

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
          request: sinon.stub().callsArgWith(5, null, 'some response data')
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
    var expectedPath;
    var callbackSpy;
    var responseObject;
    var parserStub;

    before(function () {
      responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      var messageId = 'e0ad7982-2670-4a91-9ab9-12687eaacb96';
      expectedPath = '/v1.0/messageheaders/' + messageId + '/body';
      callbackSpy = sinon.spy();
      responseObject = { messagebody: 'messagebody' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Messages = proxyquire('../lib/messages', { './xmlparser': sinon.stub().returns(parserStub) });
      var messages = Messages(esendexFake);
      messages.getBody(messageId, callbackSpy);
    });

    it('should call the messageheader body endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', expectedPath, null, null, 200, sinon.match.func);
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
          request: sinon.stub().callsArgWith(5, requestError)
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
          request: sinon.stub().callsArgWith(5, null, 'some response data')
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