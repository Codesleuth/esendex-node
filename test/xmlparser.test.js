var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('XML Parser', function () {

  var parseStringFake;
  var parserStub;
  var xml2jsFake;
  var result;

  before(function () {
    parseStringFake = 'this is the parse string method';
    parserStub = sinon.stub().returns({ parseString: parseStringFake });
    xml2jsFake = { Parser: parserStub };

    var XmlParser = proxyquire('../lib/xmlparser', { 'xml2js': xml2jsFake });
    result = XmlParser();
  });

  it('should create a parser with the expected options', function () {
    sinon.assert.calledWith(parserStub, { explicitArray: false, mergeAttrs: true });
  });

  it('should return the parseString property', function () {
    assert.equal(result, parseStringFake);
  });

});