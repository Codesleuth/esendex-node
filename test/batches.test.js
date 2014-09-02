var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('Batches', function () {

  describe('constructor', function () {

    var esendex;
    var batches;

    before(function () {
      esendex = {};
      var Batches = proxyquire('../lib/batches', {});
      batches = Batches(esendex);
    });

    it('should create an instance of the batches api', function () {
      assert.notEqual(batches, null);
      assert.equal(typeof batches, 'object');
    });

    it('should expose the esendex api', function () {
      assert.equal(batches.esendex, esendex);
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
      requestStub = sinon.stub().callsArgWith(5, null, responseXml);
      var esendexFake = {
        requesthandler: {
          request: requestStub
        }
      };
      options = { plane: 'boat' };
      callbackSpy = sinon.spy();
      responseObject = { messagebatches: 'messagebatches' };
      parserStub = sinon.stub().callsArgWith(1, null, responseObject);

      var Batches = proxyquire('../lib/batches', { './xmlparser': sinon.stub().returns(parserStub) });
      var batches = Batches(esendexFake);
      batches.get(options, callbackSpy);
    });

    it('should call the messagebatches endpoint', function () {
      sinon.assert.calledWith(requestStub, 'GET', '/v1.0/messagebatches', options, null, 200, sinon.match.func);
    });

    it('should parse the xml response', function () {
      sinon.assert.calledWith(parserStub, responseXml, sinon.match.func);
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

      var Batches = proxyquire('../lib/batches', { './xmlparser': sinon.stub() });
      var batches = Batches(esendexFake);
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

      var parserStub = sinon.stub().callsArgWith(1, parserError);

      var Batches = proxyquire('../lib/batches', { './xmlparser': sinon.stub().returns(parserStub) });
      var batches = Batches(esendexFake);
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

      var Batches = proxyquire('../lib/batches', {});
      var batches = Batches(esendexFake);
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

      var Batches = proxyquire('../lib/batches', {});
      var batches = Batches(esendexFake);
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
    var buildObjectStub;
    var builderStub;

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
      buildObjectStub = sinon.stub().returns(requestXml);
      builderStub = sinon.stub().returns(buildObjectStub);

      var Batches = proxyquire('../lib/batches', { './xmlbuilder': builderStub });
      var batches = Batches(esendexFake);
      batches.rename(options, callbackSpy);
    });

    it('should create an xml builder with the messagebatch root element', function () {
      sinon.assert.calledWith(builderStub, 'messagebatch');
    });

    it('should build the message batch rename request xml', function () {
      sinon.assert.calledWith(buildObjectStub, sinon.match({
        '$': {
          xmlns: 'http://api.esendex.com/ns/'
        },
        name: options.name
      }));
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

      var Batches = proxyquire('../lib/batches', { './xmlbuilder': sinon.stub().returns(buildObjectStub) });
      var batches = Batches(esendexFake);
      batches.rename('asdaaggadsgwq', callbackSpy);
    });

    it('should call the callback with the error', function () {
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

});