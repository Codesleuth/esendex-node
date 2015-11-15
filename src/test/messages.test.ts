import assert = require('assert')
import sinon = require('sinon')
import _proxyquire = require('proxyquire')
import {Messages} from '../lib/messages'
let proxyquire = _proxyquire.noCallThru()

describe('Messages', function () {

  describe('get all', function () {

    var responseXml;
    var requestStub;
    var options;
    var callbackSpy;
    var responseObject;
    var parseStringStub;
    var xmlParserStub;

    before(function () {
      responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { dog: 'cat' };
      callbackSpy = sinon.spy();
      responseObject = { messageheaders: { messageheader: ['messageheaders'] } };
      
      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      let messages: Messages = new module.Messages(esendexFake);
      messages.get(options, callbackSpy);
    });

    it('should create an instance of the XmlParser', function () {
      sinon.assert.calledOnce(xmlParserStub);
      sinon.assert.calledWithNew(xmlParserStub);
    });

    it('should call the messageheaders endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/messageheaders', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messageheaders response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messageheaders);
    });

  });

  describe('get all with one message returned', function () {

    var expectedMessageHeader;
    var callbackSpy;

    before(function () {
      let responseXml = 'jargon';
      let requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      callbackSpy = sinon.spy();
      expectedMessageHeader = 'not an array';
      let responseObject = { messageheaders: { messageheader: expectedMessageHeader } };
      
      let parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      let messages: Messages = new module.Messages(esendexFake);
      messages.get({}, callbackSpy);
    });

    it('should return an array of a single message header', function () {
      sinon.assert.calledWith(callbackSpy, null, { messageheader: [expectedMessageHeader] });
    });

  });

  describe('get specific message', function () {

    var requestStub;
    var expectedPath;
    var callbackSpy;
    var expectedMessageHeader;

    before(function () {
      let responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      let options = { id: '6aa73324-1ac6-4f6f-b5df-9dec5bdd5d64', piano: 'violin' };
      expectedPath = '/v1.0/messageheaders/' + options.id;
      callbackSpy = sinon.spy();
      expectedMessageHeader = 'messageheader';
      let responseObject = { messageheader: expectedMessageHeader };
      
      let parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      let messages: Messages = new module.Messages(esendexFake);
      messages.get(options, callbackSpy);
    });

    it('should call the messageheaders endpoint with the specific message id', function () {
      sinon.assert.calledWith(requestStub, 'GET', expectedPath, sinon.match({ id: undefined }), null, 200, sinon.match.func);
    });

    it('should call the callback with the parsed messageheader response', function () {
      sinon.assert.calledWith(callbackSpy, null, expectedMessageHeader);
    });

  });

  describe('get when request error', function () {

    var requestError;
    var callbackSpy;

    before(function () {
      requestError = new Error('some request error');
      let esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, requestError)
        }
      };
      callbackSpy = sinon.spy();

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: sinon.stub() }
      });
      let messages: Messages = new module.Messages(esendexFake);
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
      let esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some response data')
        }
      };
      callbackSpy = sinon.spy();

      let parseStringStub = sinon.stub().callsArgWith(1, parserError)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      let messages = new module.Messages(esendexFake);
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
    var expectedMessageHeader;
    var messagesToSend;
    var parseStringStub;
    var xmlParserStub;
    var xmlBuilderStub;

    before(function () {
      requestXml = 'could be anything really';
      responseXml = 'some message headers response';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      callbackSpy = sinon.spy();
      expectedMessageHeader = 'a single message header';
      let responseObject = { messageheaders: { messageheader: expectedMessageHeader } };

      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let buildStub = sinon.stub().returns(requestXml);
      xmlBuilderStub = sinon.stub().returns({ build: buildStub });

      messagesToSend = { some: 'messages' };

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub },
        './xmlbuilder': { XmlBuilder: xmlBuilderStub }
      });
      let messages = new module.Messages(esendexFake);
      messages.send(messagesToSend, callbackSpy);
    });

    it('should create an xml builder with the messages root element', function () {
      sinon.assert.calledOnce(xmlBuilderStub);
      sinon.assert.calledWithNew(xmlBuilderStub);
      sinon.assert.calledWith(xmlBuilderStub, 'messages');
    });

    it('should call the messagedispatcher endpoint', function () {
      sinon.assert.calledWith(requestStub, 'POST', '/v1.0/messagedispatcher', null, requestXml, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messagedispatcher response', function () {
      sinon.assert.calledWith(callbackSpy, null, { messageheader: [expectedMessageHeader] });
    });

  });

  describe('send returns multiple messages', function () {

    var firstMessageHeader;
    var secondMessageHeader;
    var callbackSpy;

    before(function () {
      let esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some message headers response')
        }
      };
      callbackSpy = sinon.spy();
      firstMessageHeader = 'firstMessageHeader';
      secondMessageHeader = 'secondMessageHeader';
      let responseObject = { messageheaders: { messageheader: [firstMessageHeader, secondMessageHeader] } };

      let parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let buildStub = sinon.stub().returns('could be anything really');
      let xmlBuilderStub = sinon.stub().returns({ build: buildStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub },
        './xmlbuilder': { XmlBuilder: xmlBuilderStub }
      });
      let messages = new module.Messages(esendexFake);
      messages.send({}, callbackSpy);
    });

    it('should return all dispatched message header responses', function () {
      sinon.assert.calledWith(callbackSpy, null, { messageheader: [firstMessageHeader, secondMessageHeader] });
    });

  });

  describe('send when request error', function () {

    var requestError;
    var callbackSpy;

    before(function () {
      requestError = new Error('some request error');
      let esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, requestError)
        }
      };
      callbackSpy = sinon.spy();

      let buildStub = sinon.stub().returns('akjshdjsahd');
      let xmlBuilderStub = sinon.stub().returns({ build: buildStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: sinon.stub() },
        './xmlbuilder': { XmlBuilder: xmlBuilderStub }
      });
      let messages = new module.Messages(esendexFake);
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
      let esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some response data')
        }
      };
      callbackSpy = sinon.spy();

      let parseStringStub = sinon.stub().callsArgWith(1, parserError)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let buildStub = sinon.stub().returns('akjshdjsahd');
      let xmlBuilderStub = sinon.stub().returns({ build: buildStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub },
        './xmlbuilder': { XmlBuilder: xmlBuilderStub }
      });
      let messages = new module.Messages(esendexFake);
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
    var expectedMessageBody;
    var parseStringStub;
    var xmlParserStub;

    before(function () {
      responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      let messageId = 'e0ad7982-2670-4a91-9ab9-12687eaacb96';
      expectedPath = '/v1.0/messageheaders/' + messageId + '/body';
      callbackSpy = sinon.spy();
      expectedMessageBody = 'messagebody';
      let responseObject = { messagebody: expectedMessageBody };

      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      let messages = new module.Messages(esendexFake);
      messages.getBody(messageId, callbackSpy);
    });

    it('should create an xml parser', function () {
      sinon.assert.calledOnce(xmlParserStub);
      sinon.assert.calledWithNew(xmlParserStub);
    });

    it('should call the messageheader body endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', expectedPath, null, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messagebody response', function () {
      sinon.assert.calledWith(callbackSpy, null, expectedMessageBody);
    });

  });

  describe('getBody when request error', function () {

    var requestError;
    var callbackSpy;

    before(function () {
      requestError = new Error('some request error');
      let esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, requestError)
        }
      };
      callbackSpy = sinon.spy();

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: sinon.stub() }
      });
      let messages = new module.Messages(esendexFake);
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
      let esendexFake = {
        requesthandler: {
          request: sinon.stub().callsArgWith(5, null, 'some response data')
        }
      };
      callbackSpy = sinon.spy();

      let parseStringStub = sinon.stub().callsArgWith(1, parserError)
      let xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let module = proxyquire('../lib/messages', {
        './xmlparser': { XmlParser: xmlParserStub }
      });
      let messages = new module.Messages(esendexFake);
      messages.getBody(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

});