var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('Request', function () {

  describe('constructor with defaults', function () {

    var request;

    before(function () {
      var RequestHandler = proxyquire('../lib/requesthandler', {});
      request = RequestHandler();
    });

    it('should create an instance of the request module', function () {
      assert.notEqual(request, null);
      assert.equal(typeof request, 'object');
    });

    it('should expose the default options', function () {
      var actualOptions = request.options;
      assert.equal(actualOptions.host, 'api.esendex.com');
      assert.equal(actualOptions.port, 443);
      assert.equal(actualOptions.https, true);
      assert.equal(actualOptions.timeout, 30000);
      assert.equal(actualOptions.username, undefined);
      assert.equal(actualOptions.password, undefined);
    });

  });

  describe('constructor with all options specified', function () {

    var options;
    var request;

    before(function () {
      options = {
        host: 'asdadasdds',
        port: 24324,
        https: false,
        timeout: 43243,
        username: 'asdasdads',
        password: 'sdfsdffs'
      };
      var RequestHandler = proxyquire('../lib/requesthandler', {});
      request = RequestHandler(options);
    });

    it('should expose the specified options', function () {
      var actualOptions = request.options;
      assert.equal(actualOptions.host, options.host);
      assert.equal(actualOptions.port, options.port);
      assert.equal(actualOptions.https, options.https);
      assert.equal(actualOptions.timeout, options.timeout);
      assert.equal(actualOptions.username, options.username);
      assert.equal(actualOptions.password, options.password);
    });

  });

  describe('constructor with partial options specified', function () {

    var options;
    var request;

    before(function () {
      options = {
        host: 'sdfsdf',
        password: 'sdfsdffs'
      };
      var RequestHandler = proxyquire('../lib/requesthandler', {});
      request = RequestHandler(options);
    });

    it('should expose the partially specified options', function () {
      var actualOptions = request.options;
      assert.equal(actualOptions.host, options.host);
      assert.equal(actualOptions.password, options.password);
    });

    it('should expose the default unspecified actualOptions', function () {
      var actualOptions = request.options;
      assert.equal(actualOptions.port, 443);
      assert.equal(actualOptions.https, true);
      assert.equal(actualOptions.timeout, 30000);
      assert.equal(actualOptions.username, undefined);
    });

  });

  describe('with no request body', function () {

    var options;
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
    var responseHandlerFake;
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

      var socketFake = { setTimeout: sinon.stub(), on: sinon.stub(), listeners: sinon.stub().returns([]) };

      requestFake = { on: sinon.stub(), end: sinon.expectation.create().once() };
      requestFake.on.withArgs('socket').callsArgWith(1, socketFake);

      responseFake = 'This is a fake response object';

      requestStub = sinon.expectation.create().once();
      requestStub.callsArgWith(1, responseFake);
      requestStub.returns(requestFake);

      responseHandlerFake = { handle: sinon.expectation.create().once().callsArgWith(2, null, responseBody) };

      stringifyStub = sinon.stub().returns(querystring);

      callback = sinon.expectation.create().once();

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        'querystring': { stringify: stringifyStub },
        './responsehandler': responseHandlerFake
      });
      var request = RequestHandler(options);
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
        'User-Agent': 'github.com/codesleuth/esendex-node'
      }}));
    });

    it('should end the request', function () {
      requestFake.end.verify();
    });

    it('should call the response handler to handle the response', function () {
      sinon.assert.calledWith(responseHandlerFake.handle, responseFake, expectedStatus, sinon.match.func);
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
    var responseHandlerFake;
    var callback;

    before(function () {
      path = '1/2/3/4';
      body = 'some xml body';
      responseBody = 'This is the response body content';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.expectation.create().once() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      responseHandlerFake = { handle: sinon.stub().callsArgWith(2, null, responseBody) };

      callback = sinon.expectation.create().once();

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './responsehandler': responseHandlerFake
      });
      var request = RequestHandler(null);
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
    var responseHandlerFake;
    var callback;

    before(function () {
      path = '1/2/3/4';
      responseBody = 'This is the response body content';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.expectation.create().once() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      responseHandlerFake = { handle: sinon.stub().callsArgWith(2, null, responseBody) };

      callback = sinon.expectation.create().once();

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './responsehandler': responseHandlerFake
      });
      var request = RequestHandler(null);
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
    var responseHandlerFake;
    var callback;

    before(function () {
      path = 'who/do/we/appreciate';
      body = 'I am xml body';
      responseBody = 'I am response body';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.expectation.create().once() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      responseHandlerFake = { handle: sinon.stub().callsArgWith(2, null, responseBody) };

      callback = sinon.expectation.create().once();

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub },
        './responsehandler': responseHandlerFake
      });
      var request = RequestHandler(null);
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

      var requestStub = sinon.stub().returns(requestFake);

      callback = sinon.expectation.create().once();

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub }
      });
      var request = RequestHandler(null);
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

      var requestStub = sinon.stub().returns(requestFake);

      callback = sinon.expectation.create().never();

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub }
      });
      var request = RequestHandler({ timeout: timeout });
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

      var requestFake = { on: sinon.stub(), end: sinon.stub(), abort: sinon.expectation.create().once() };
      requestFake.on.withArgs('socket').callsArgWith(1, socketFake);

      var requestStub = sinon.stub().returns(requestFake);

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'https': { request: requestStub }
      });
      var request = RequestHandler({ timeout: timeout });
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
      var requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.stub() };

      requestStub = sinon.expectation.create().once().returns(requestFake);

      var RequestHandler = proxyquire('../lib/requesthandler', {
        'http': { request: requestStub }
      });
      var request = RequestHandler({ https: false });
      request.request('PUT', '/290348nj', {}, 215, sinon.spy());
    });

    it('should have called request on the http module', function () {
      requestStub.verify();
    });

  });

});