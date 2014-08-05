var assert = require('assert'),
    sinon = require('sinon')
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

  describe('GET http request', function () {

    var options;
    var expectedAuth;
    var method;
    var path;
    var data;
    var expectedStatus;
    var callbackSpy;
    var httpRequestStub;
    var querystring;
    var requestFake;
    var responseFake;
    var responseHandlerFake;

    before(function () {
      options = {
        host: 'some host',
        port: 6677,
        https: false,
        timeout: 321,
        username: 'user@host.com',
        password: 'wildermuth'
      };

      expectedAuth = options.username + ':' + options.password;

      method = 'BAM';
      path = '/some/path';
      data = {param1: 10, param2: 22};
      expectedStatus = 435;
      callbackSpy = sinon.spy();
      querystring = 'asdljhasdkljalkdjs';

      requestFake = { on: sinon.spy(), end: sinon.spy() };
      responseFake = { on: sinon.spy() };

      httpRequestStub = sinon.stub();
      httpRequestStub.callsArgWith(1, responseFake);
      httpRequestStub.returns(requestFake);

      var httpFake = { request: httpRequestStub };

      var stringifyStub = sinon.stub().returns(querystring);
      var querystringFake = { stringify: stringifyStub };
      responseHandlerFake = { handle: sinon.stub().callsArg(2) };

      var requireStub = sinon.stub();
      requireStub.withArgs('http').returns(httpFake);
      requireStub.withArgs('querystring').returns(querystringFake);
      requireStub.withArgs('./responsehandler').returns(responseHandlerFake);

      var request = RequestHandler(options, requireStub);
      request.request(method, path, data, expectedStatus, callbackSpy);
    });

    it('should call http.request once', function () {
      sinon.assert.calledOnce(httpRequestStub);
    });

    it('should call http.request with the expected host', function () {
      sinon.assert.calledWith(httpRequestStub, sinon.match({ host: options.host }));
    });

    it('should call http.request with the expected port', function () {
      sinon.assert.calledWith(httpRequestStub, sinon.match({ port: options.port }));
    });

    it('should call http.request with the expected path', function () {
      sinon.assert.calledWith(httpRequestStub, sinon.match({ path: path + '?' + querystring }));
    });

    it('should call http.request with the expected method', function () {
      sinon.assert.calledWith(httpRequestStub, sinon.match({ method: method }));
    });

    it('should call http.request with the expected auth', function () {
      sinon.assert.calledWith(httpRequestStub, sinon.match({ auth: expectedAuth }));
    });

    it('should call http.request with the expected headers', function () {
      sinon.assert.calledWith(httpRequestStub, sinon.match({ headers: {
        'Accept': 'application/xml',
        'User-Agent': 'github.com/codesleuth/esendex-node'
      }}));
    });

    it('should call end on the request', function () {
      sinon.assert.calledOnce(requestFake.end);
    });

    it('should call the response handler', function () {
      sinon.assert.calledOnce(responseHandlerFake.handle);
      sinon.assert.calledWith(responseHandlerFake.handle, responseFake, expectedStatus, callbackSpy);
    });

    it('should call the callback', function () {
      sinon.assert.calledOnce(callbackSpy);
    });

  });

});