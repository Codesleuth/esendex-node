var assert = require('assert'),
    sinon = require('sinon')
var Parser = require('../lib/parser');

describe('Parser', function () {

  var parseStringFake;
  var parserStub;
  var xml2jsFake;
  var result;

  before(function () {
    parseStringFake = 'this is the parse string method';
    parserStub = sinon.stub().returns({ parseString: parseStringFake });
    xml2jsFake = { Parser: parserStub };

    var requireStub = sinon.stub().returns(xml2jsFake);
    result = Parser(requireStub);
  });

  it('should create a parser with the expected options', function () {
    sinon.assert.calledWith(parserStub, { explicitArray: false, mergeAttrs: true });
  });

  it('should create an xml parser', function () {
    assert.equal(result, parseStringFake);
  });

});