import assert = require('assert')
import sinon = require('sinon')
import _proxyquire = require('proxyquire')
import {RequestHandler, RequestHandlerOptions} from '../lib/requesthandler'
import {ResponseHandler} from '../lib/responsehandler'
let proxyquire = _proxyquire.noCallThru()

describe('RequestHandler', function () {

  describe('constructor with defaults', function () {

    var request: RequestHandler;

    before(function () {
      let Handlers = proxyquire('../lib/requesthandler', {});
      request = new Handlers.RequestHandler();
    });

    it('should create an instance of the request handler', function () {
      assert.notEqual(request, null);
      assert.equal(typeof request, 'object');
    });

    it('should expose the default options', function () {
      var actualOptions = request.options;
      assert.strictEqual(actualOptions.host, 'api.esendex.com');
      assert.strictEqual(actualOptions.port, 443);
      assert.strictEqual(actualOptions.https, true);
      assert.strictEqual(actualOptions.timeout, 30000);
      assert.strictEqual(actualOptions.username, undefined);
      assert.strictEqual(actualOptions.password, undefined);
    });

  });

  describe('constructor with all options specified', function () {

    var options;
    var request: RequestHandler;

    before(function () {
      options = {
        host: 'asdadasdds',
        port: 24324,
        https: false,
        timeout: 43243,
        username: 'asdasdads',
        password: 'sdfsdffs'
      };
      let Handlers = proxyquire('../lib/requesthandler', {});
      request = new Handlers.RequestHandler(options);
    });

    it('should expose the specified options', function () {
      let actualOptions = request.options;
      assert.strictEqual(actualOptions.host, options.host);
      assert.strictEqual(actualOptions.port, options.port);
      assert.strictEqual(actualOptions.https, options.https);
      assert.strictEqual(actualOptions.timeout, options.timeout);
      assert.strictEqual(actualOptions.username, options.username);
      assert.strictEqual(actualOptions.password, options.password);
    });

  });

  describe('constructor with partial options specified', function () {

    var options;
    var request: RequestHandler;

    before(function () {
      options = {
        host: 'sdfsdf',
        password: 'sdfsdffs'
      };
      let Handlers = proxyquire('../lib/requesthandler', {});
      request = new Handlers.RequestHandler(options);
    });

    it('should expose the partially specified options', function () {
      let actualOptions = request.options;
      assert.equal(actualOptions.host, options.host);
      assert.equal(actualOptions.password, options.password);
    });

    it('should expose the default unspecified actualOptions', function () {
      let actualOptions = request.options;
      assert.equal(actualOptions.port, 443);
      assert.equal(actualOptions.https, true);
      assert.equal(actualOptions.timeout, 30000);
      assert.equal(actualOptions.username, undefined);
    });

  });

  describe('with no request body', function () {

    var options: RequestHandlerOptions;
    var expectedAuth;
    var method;
    var path;
    var query;
    var expectedStatus;
    var callback;
    var requestStub;
    var querystring;
    var expectedPath;
    var responseBody;
    var requestFake;
    var responseFake;
    var responseHandlerStub: Sinon.SinonStub;
    var expectedUserAgent;
    var stringifyStub;

    before(function () {
      options = {
        host: 'some host',
        port: 6677,
        https: true,
        timeout: 321,
        username: 'user@host.com',
        password: 'wildermuth'
      };

      method = 'BAM';
      path = '/some/path';
      query = {param1: 10, param2: 22};
      expectedStatus = 435;
      querystring = 'asdljhasdkljalkdjs';
      expectedPath = path + '?' + querystring;
      responseBody = 'This was the response body';

      expectedAuth = options.username + ':' + options.password;

      let socketFake = { setTimeout: sinon.stub(), on: sinon.stub(), listeners: sinon.stub().returns([]) };

      requestFake = { on: sinon.stub(), end: sinon.expectation.create().once() };
      requestFake.on.withArgs('socket').callsArgWith(1, socketFake);

      responseFake = 'This is a fake response object';

      requestStub = sinon.expectation.create().once();
      requestStub.callsArgWith(1, responseFake);
      requestStub.returns(requestFake);
      
      let responseHandlerHandle = sinon.stub().callsArgWith(2, null, responseBody);
      responseHandlerStub = sinon.stub().returns({ handle: responseHandlerHandle })
      
      let userAgentBuilderFake = { Build: sinon.stub().returns(expectedUserAgent) }

      stringifyStub = sinon.stub().returns(querystring);

      callback = sinon.expectation.create().once();

      let Handlers = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        'querystring': { stringify: stringifyStub },
        './responsehandler': { ResponseHandler: responseHandlerStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request: RequestHandler = new Handlers.RequestHandler(options);
      request.request(method, path, query, null, expectedStatus, callback);
    });

    it('should stringify the query string', function () {
      sinon.assert.calledWith(stringifyStub, query);
    });

    it('should call http.request with the expected options', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ 
        host: options.host,
        port: options.port,
        path: expectedPath,
        method: method,
        auth: expectedAuth
      }));
    });

    it('should call http.request with the expected headers', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ headers: {
        'Accept': 'application/xml',
        'User-Agent': expectedUserAgent
      }}));
    });

    it('should end the request', function () {
      requestFake.end.verify();
    });

    it('should call the response handler to handle the response', function () {
      sinon.assert.calledOnce(responseHandlerStub);
      sinon.assert.calledWithNew(responseHandlerStub);
    });

    it('should have called the callback', function () {
      sinon.assert.calledWith(callback, null, responseBody);
    });

  });

  describe('POST with a request body', function () {

    var path;
    var body;
    var responseBody;
    var requestFake;
    var requestStub;
    var callback;

    before(function () {
      path = '1/2/3/4';
      body = 'some xml body';
      responseBody = 'This is the response body content';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.expectation.create().once() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      
      let responseHandlerHandle = sinon.stub().callsArgWith(2, null, responseBody);
      let responseHandlerStub = sinon.stub().returns({ handle: responseHandlerHandle })
      
      let userAgentBuilderFake = { Build: sinon.stub().returns('asdhjahsdj') }

      callback = sinon.expectation.create().once();

      let Handlers = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './responsehandler': { ResponseHandler: responseHandlerStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request: RequestHandler = new Handlers.RequestHandler(null);
      request.request('POST', path, null, body, 798, callback);
    });

    it('should call the request with the POST method option', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ method: 'POST' }));
    });

    it('should call the request with an unmodified path option', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ path: path }));
    });

    it('should call the request with body specific headers', function () {
      sinon.assert.calledWith(requestStub, sinon.match({
        headers: {
          'Content-Type': 'application/xml',
          'Content-Length': body.length
      }}));
    });

    it('should write the request body to the request', function () {
      sinon.assert.calledWith(requestFake.write, body);
    });

    it('should have called the callback', function () {
      sinon.assert.calledWith(callback, null, responseBody);
    });

  });

  describe('POST without a request body', function () {

    var path;
    var responseBody;
    var requestFake;
    var requestStub;
    var callback;

    before(function () {
      path = '1/2/3/4';
      responseBody = 'This is the response body content';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.expectation.create().once() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      
      let responseHandlerHandle = sinon.stub().callsArgWith(2, null, responseBody);
      let responseHandlerStub = sinon.stub().returns({ handle: responseHandlerHandle })
      
      let userAgentBuilderFake = { Build: sinon.stub().returns('asdhjahsdj') }

      callback = sinon.expectation.create().once();

      let Handlers = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './responsehandler': { ResponseHandler: responseHandlerStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request:RequestHandler = new Handlers.RequestHandler(null);
      request.request('POST', path, null, null, 798, callback);
    });

    it('should call the request with the POST method option', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ method: 'POST' }));
    });

    it('should call the request with an unmodified path option', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ path: path }));
    });

    it('should call the request with body specific headers', function () {
      sinon.assert.calledWith(requestStub, sinon.match({
        headers: {
          'Content-Type': 'application/xml',
          'Content-Length': 0
      }}));
    });

    it('should not write any request body', function () {
      sinon.assert.notCalled(requestFake.write);
    });

    it('should have called the callback', function () {
      sinon.assert.calledWith(callback, null, responseBody);
    });

  });

  describe('PUT with a request body', function () {

    var path;
    var body;
    var responseBody;
    var requestFake;
    var requestStub;
    var callback;

    before(function () {
      path = 'who/do/we/appreciate';
      body = 'I am xml body';
      responseBody = 'I am response body';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.expectation.create().once() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      
      let responseHandlerHandle = sinon.stub().callsArgWith(2, null, responseBody);
      let responseHandlerStub = sinon.stub().returns({ handle: responseHandlerHandle })
      
      let userAgentBuilderFake = { Build: sinon.stub().returns('asdhjahsdj') }

      callback = sinon.expectation.create().once();

      let Handlers = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './responsehandler': { ResponseHandler: responseHandlerStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request: RequestHandler = new Handlers.RequestHandler(null);
      request.request('PUT', path, null, body, 3132, callback);
    });

    it('should call the request with the POST method option', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ method: 'PUT' }));
    });

    it('should call the request with an unmodified path option', function () {
      sinon.assert.calledWith(requestStub, sinon.match({ path: path }));
    });

    it('should call the request with body specific headers', function () {
      sinon.assert.calledWith(requestStub, sinon.match({
        headers: {
          'Content-Type': 'application/xml',
          'Content-Length': body.length
      }}));
    });

    it('should write the request body to the request', function () {
      sinon.assert.calledWith(requestFake.write, body);
    });

    it('should have called the callback', function () {
      sinon.assert.calledWith(callback, null, responseBody);
    });

  });

  describe('with a request error', function () {

    var requestError;
    var requestFake;
    var callback;

    before(function () {
      requestError = 'an error';

      requestFake = { on: sinon.stub(), end: sinon.stub() };
      requestFake.on.withArgs('error').callsArgWith(1, requestError);

      let requestStub = sinon.stub().returns(requestFake);
      
      let userAgentBuilderFake = { Build: sinon.stub().returns('asdhjahsdj') }

      callback = sinon.expectation.create().once();

      let Handlers = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request: RequestHandler = new Handlers.RequestHandler(null);
      request.request('PLOP', '/path', null, null, 3132, callback);
    });

    it('should have called the callback with the expected error', function () {
      sinon.assert.calledWith(callback, requestError);
    });

  });

  describe('with socket timeout', function () {

    var timeout;
    var socketFake;
    var requestFake;
    var callback;

    before(function () {
      timeout = 243;

      socketFake = {
        setTimeout: sinon.spy(),
        on: sinon.stub(),
        listeners: sinon.stub().returns([])
      };
      socketFake.on.callsArgOn(1, socketFake);

      requestFake = {
        on: sinon.stub(),
        end: sinon.stub(),
        abort: sinon.expectation.create().once()
      };
      requestFake.on.withArgs('socket').callsArgWith(1, socketFake);

      let requestStub = sinon.stub().returns(requestFake);
      
      let userAgentBuilderFake = { Build: sinon.stub().returns('asdhjahsdj') }

      callback = sinon.expectation.create().never();

      let Handlers = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request: RequestHandler = new Handlers.RequestHandler({ timeout: timeout });
      request.request('asdkj', '/290348nj', null, null, 215, callback);
    });

    it('should have set a socket timeout value', function () {
      sinon.assert.calledWith(socketFake.setTimeout, timeout);
    });

    it('should have set a socket timeout listener', function () {
      sinon.assert.calledWith(socketFake.on, 'timeout', sinon.match.func);
    });

    it('should have called request.abort on socket timeout', function () {
      requestFake.abort.verify();
    });

    it('should have not called the callback', function () {
      callback.verify();
    });

  });

  describe('with existing socket timeout listener', function () {

    var timeout;
    var socketFake;

    before(function () {
      timeout = 64;

      socketFake = { 
        setTimeout: sinon.stub(),
        on: sinon.expectation.create().never(),
        listeners: sinon.stub().withArgs('timeout').returns([1])
      };

      let requestFake = { on: sinon.stub(), end: sinon.stub(), abort: sinon.expectation.create().once() };
      requestFake.on.withArgs('socket').callsArgWith(1, socketFake);
      
      let userAgentBuilderFake = { Build: sinon.stub().returns('asdhjahsdj') }

      let requestStub = sinon.stub().returns(requestFake);

      let Handlers = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request: RequestHandler = new Handlers.RequestHandler({ timeout: timeout });
      request.request('asdkj', '/290348nj', null, null, 215, sinon.spy());
    });

    it('should have set a socket timeout value', function () {
      sinon.assert.calledWithExactly(socketFake.setTimeout, timeout);
    });

    it('should not have set a socket timeout listener', function () {
      socketFake.on.verify();
    });

  });

  describe('with https disabled', function () {

    var requestStub;

    before(function () {
      let requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.stub() };
      
      let userAgentBuilderFake = { Build: sinon.stub().returns('asdhjahsdj') }

      requestStub = sinon.expectation.create().once().returns(requestFake);

      let Handlers = proxyquire('../lib/requesthandler', {
        'http': { request: requestStub },
        './useragentbuilder': { UserAgentBuilder: userAgentBuilderFake }
      });
      let request: RequestHandler = new Handlers.RequestHandler({ https: false });
      request.request('PUT', '/290348nj', {}, null, 215, sinon.spy());
    });

    it('should have called request on the http module', function () {
      requestStub.verify();
    });

  });

});