import * as assert from 'assert'
import sinon = require('sinon')
import _proxyquire = require('proxyquire')
let proxyquire = _proxyquire.noCallThru()

describe('Batches', function () {

  describe('get', function () {

    var responseXml;
    var requestStub;
    var options;
    var callbackSpy;
    var responseObject;
    var parseStringStub: Sinon.SinonStub;
    var xmlParserStub: Sinon.SinonStub;

    before(function () {
      responseXml = 'could be anything really';
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      let esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { plane: 'boat' };
      callbackSpy = sinon.spy();
      responseObject = { messagebatches: 'messagebatches' };
      
      parseStringStub = sinon.stub().callsArgWith(1, null, responseObject)
      xmlParserStub = sinon.stub().returns({ parseString: parseStringStub });

      let Batches = proxyquire('../lib/batches', {
        './xmlparser': { XmlParser: xmlParserStub }
      }).Batches;
      let batches = new Batches(esendexFake);
      batches.get(options, callbackSpy);
    });

    it('should create an instance of the XmlParser', function () {
      sinon.assert.calledWithNew(xmlParserStub);
    });

    it('should call the messagebatches endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/messagebatches', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parseStringStub, responseXml, sinon.match.func);
    });

    it('should call the callback with the parsed messagebatches response', function () {
      sinon.assert.calledWith(callbackSpy, null, responseObject.messagebatches);
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

      let Batches = proxyquire('../lib/batches', {
        './xmlparser': { XmlParser: sinon.stub() }
      }).Batches;
      var batches = new Batches(esendexFake);
      batches.get(null, callbackSpy);
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

      let Batches = proxyquire('../lib/batches', {
        './xmlparser': { XmlParser: xmlParserStub }
      }).Batches;
      var batches = new Batches(esendexFake);
      batches.get(null, callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, parserError);
    });

  });

  describe('cancel', function () {

    var requestStub;
    var id;
    var expectedPath;
    var callbackSpy;

    before(function () {
      requestStub = sinon.stub().callsArgWith(5, null, '');
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      id = '32c43729-6225-47f7-9359-521406fc29ac';
      expectedPath = '/v1.0/messagebatches/' + id;
      callbackSpy = sinon.spy();

      var Batches = proxyquire('../lib/batches', {}).Batches;
      var batches = new Batches(esendexFake);
      batches.cancel(id, callbackSpy);
    });

    it('should call the messagebatches endpoint', function () {
      sinon.assert.calledWith(requestStub, 'DELETE', expectedPath, null, null, 204, sinon.match.func);
    });

    it('should call the callback with the parsed messagebatches response', function () {
      sinon.assert.calledWith(callbackSpy, null);
    });

  });

  describe('cancel when request error', function () {

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

      var Batches = proxyquire('../lib/batches', {}).Batches;
      var batches = new Batches(esendexFake);
      batches.cancel('asdasdda', callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

  describe('rename', function () {

    var requestXml;
    var requestStub;
    var options;
    var expectedPath;
    var callbackSpy;
    var buildStub;
    var xmlBuilderStub;

    before(function () {
      requestXml = 'batch rename body';
      requestStub = sinon.stub().callsArgWith(5, null, '');
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { id: '32c43729-6225-47f7-9359-521406fc29ac', name: 'My new batch name!' };
      expectedPath = '/v1.1/messagebatches/' + options.id;
      callbackSpy = sinon.spy();
      
      buildStub = sinon.stub().returns(requestXml)
      xmlBuilderStub = sinon.stub().returns({ build: buildStub });

      let Batches = proxyquire('../lib/batches', {
        './xmlparser': { XmlParser: function () {} },
        './xmlbuilder': { XmlBuilder: xmlBuilderStub }
      }).Batches;
      var batches = new Batches(esendexFake);
      batches.rename(options, callbackSpy);
    });

    it('should create an xml builder with the messagebatch root element', function () {
      sinon.assert.calledOnce(xmlBuilderStub);
      sinon.assert.calledWithNew(xmlBuilderStub);
      sinon.assert.calledWith(xmlBuilderStub, 'messagebatch');
    });

    it('should build the message batch rename request xml', function () {
      sinon.assert.calledWith(buildStub, {
        '$': { xmlns: 'http://api.esendex.com/ns/' },
        name: options.name
      });
    });

    it('should call the messagebatches endpoint', function () {
      sinon.assert.calledWith(requestStub, 'PUT', expectedPath, null, requestXml, 204, sinon.match.func);
    });

    it('should call the callback with the parsed messagebatches response', function () {
      sinon.assert.calledWith(callbackSpy, null);
    });

  });

  describe('rename when request error', function () {

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
      var buildObjectStub = sinon.stub().returns('asdsadasd');
      
      let buildStub = sinon.stub().returns('asdsadasd')
      let xmlBuilderStub = sinon.stub().returns({ build: buildStub });

      let Batches = proxyquire('../lib/batches', {
        './xmlparser': { XmlParser: function () {} },
        './xmlbuilder': { XmlBuilder: xmlBuilderStub }
      }).Batches;
      var batches = new Batches(esendexFake);
      batches.rename('asdaaggadsgwq', callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

});