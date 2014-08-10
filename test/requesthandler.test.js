var assert = require('assert'),
    sinon = require('sinon');
var RequestHandler = require('../lib/requesthandler');

describe('Request', function () {

  describe('constructor with defaults', function () {

    var request;

    before(function () {
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
      assert.equal(actualOptions.timeout, 30);
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
      assert.equal(actualOptions.timeout, 30);
      assert.equal(actualOptions.username, undefined);
    });

  });

  describe('request with no request body', function () {

    var options;
    var expectedAuth;
    var method;
    var path;
    var data;
    var expectedStatus;
    var callbackSpy;
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
      data = {param1: 10, param2: 22};
      expectedStatus = 435;
      callbackSpy = sinon.spy();
      querystring = 'asdljhasdkljalkdjs';
      expectedPath = path + '?' + querystring;
      responseBody = 'This was the response body';

      expectedAuth = options.username + ':' + options.password;

      var socketFake = { setTimeout: sinon.stub(), on: sinon.stub() };

      requestFake = { on: sinon.stub(), end: sinon.spy() };
      requestFake.on.withArgs('socket').callsArgWith(1, socketFake);

      responseFake = 'This is a fake response object';

      requestStub = sinon.stub();
      requestStub.callsArgWith(1, responseFake);
      requestStub.returns(requestFake);

      responseHandlerFake = { handle: sinon.stub().callsArgWith(2, null, responseBody) };

      stringifyStub = sinon.stub().returns(querystring);

      var requireStub = sinon.stub();
      requireStub.withArgs('https').returns({ request: requestStub });
      requireStub.withArgs('querystring').returns({ stringify: stringifyStub });
      requireStub.withArgs('./responsehandler').returns(responseHandlerFake);

      var request = RequestHandler(options, requireStub);
      request.request(method, path, data, expectedStatus, callbackSpy);
    });

    it('should call http.request once', function () {
      sinon.assert.calledOnce(requestStub);
    });

    it('should stringify the query string', function () {
      sinon.assert.calledWith(stringifyStub, data);
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
      sinon.assert.calledOnce(requestFake.end);
    });

    it('should call the response handler to handle the response', function () {
      sinon.assert.calledOnce(responseHandlerFake.handle);
      sinon.assert.calledWith(responseHandlerFake.handle, responseFake, expectedStatus, sinon.match.func);
    });

    it('should have called the callback', function () {
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.calledWith(callbackSpy, null, responseBody);
    });

  });

  describe('POST request with a request body', function () {

    var path;
    var body;
    var responseBody;
    var requestFake;
    var requestStub;
    var responseHandlerFake;
    var callbackSpy;

    before(function () {
      path = '1/2/3/4';
      body = 'some xml body';
      responseBody = 'This is the response body content';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.spy() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      responseHandlerFake = { handle: sinon.stub().callsArgWith(2, null, responseBody) };

      var requireStub = sinon.stub();
      requireStub.withArgs('https').returns({ request: requestStub, on: sinon.stub() });
      requireStub.withArgs('./responsehandler').returns(responseHandlerFake);

      callbackSpy = sinon.spy();

      var request = RequestHandler(null, requireStub);
      request.request('POST', path, body, 798, callbackSpy);
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
      sinon.assert.calledOnce(requestFake.write);
      sinon.assert.calledWith(requestFake.write, body);
    });

    it('should have called the callback', function () {
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.calledWith(callbackSpy, null, responseBody);
    });

  });

  describe('PUT request with a request body', function () {

    var path;
    var body;
    var responseBody;
    var requestFake;
    var requestStub;
    var responseHandlerFake;
    var callbackSpy;

    before(function () {
      path = 'who/do/we/appreciate';
      body = 'I am xml body';
      responseBody = 'I am response body';

      requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.spy() };

      requestStub = sinon.stub().callsArg(1).returns(requestFake);
      responseHandlerFake = { handle: sinon.stub().callsArgWith(2, null, responseBody) };

      var requireStub = sinon.stub();
      requireStub.withArgs('https').returns({ request: requestStub, on: sinon.stub() });
      requireStub.withArgs('./responsehandler').returns(responseHandlerFake);

      callbackSpy = sinon.spy();

      var request = RequestHandler(null, requireStub);
      request.request('PUT', path, body, 3132, callbackSpy);
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
      sinon.assert.calledOnce(requestFake.write);
      sinon.assert.calledWith(requestFake.write, body);
    });

    it('should have called the callback', function () {
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.calledWith(callbackSpy, null, responseBody);
    });

  });

  describe('request with a request error', function () {

    var requestError;
    var requestFake;
    var callbackSpy;

    before(function () {
      requestError = 'an error';

      requestFake = { on: sinon.stub(), end: sinon.stub() };
      requestFake.on.withArgs('error').callsArgWith(1, requestError);

      var requestStub = sinon.stub().returns(requestFake);

      var requireStub = sinon.stub();
      requireStub.withArgs('https').returns({ request: requestStub, on: sinon.stub() });
      requireStub.withArgs('querystring').returns({ stringify: sinon.stub() });
      requireStub.withArgs('./responsehandler').returns(null);

      callbackSpy = sinon.spy();

      var request = RequestHandler(null, requireStub);
      request.request('PLOP', '/path', {}, 3132, callbackSpy);
    });

    it('should have called the callback with the expected error', function () {
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.calledWith(callbackSpy, requestError);
    });

  });

  describe('request with socket timeout', function () {

    var timeout;
    var socketFake;
    var requestFake;
    var callbackSpy;

    before(function () {
      timeout = 243;

      socketFake = { setTimeout: sinon.spy(), on: sinon.stub() };
      socketFake.on.withArgs('timeout').callsArg(1);

      requestFake = { on: sinon.stub(), end: sinon.stub(), abort: sinon.expectation.create().once() };
      requestFake.on.withArgs('socket').callsArgWith(1, socketFake);

      var requestStub = sinon.stub().returns(requestFake);

      var requireStub = sinon.stub();
      requireStub.withArgs('https').returns({ request: requestStub, on: sinon.stub() });
      requireStub.withArgs('querystring').returns({ stringify: sinon.stub() });
      requireStub.withArgs('./responsehandler').returns(null);

      callbackSpy = sinon.spy();

      var request = RequestHandler({ timeout: timeout }, requireStub);
      request.request('asdkj', '/290348nj', {}, 215, callbackSpy);
    });

    it('should have set a socket timeout value', function () {
      sinon.assert.calledWith(socketFake.setTimeout, timeout);
    });

    it('should have set a socket timeout event which calls abort', function () {
      sinon.assert.calledWith(socketFake.on, 'timeout');
      requestFake.abort.verify();
    });

    it('should have called the callback with a timeout error', function () {
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.calledWith(callbackSpy, sinon.match.instanceOf(Error));
    });

  });

  describe('request with https disabled', function () {

    var requestStub;

    before(function () {
      var requestFake = { on: sinon.stub(), end: sinon.stub(), write: sinon.stub() };

      requestStub = sinon.stub().returns(requestFake);

      var requireStub = sinon.stub();
      requireStub.withArgs('http').returns({ request: requestStub, on: sinon.stub() });
      requireStub.withArgs('./responsehandler').returns(null);

      var request = RequestHandler({ https: false }, requireStub);
      request.request('PUT', '/290348nj', {}, 215, sinon.spy());
    });

    it('should have called request on the http module', function () {
      sinon.assert.calledOnce(requestStub);
    });

  });

});