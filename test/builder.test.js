var assert = require('assert'),
    sinon = require('sinon')
var Builder = require('../lib/builder');

describe('Builder', function () {

  var rootName;
  var buildObjectFake;
  var builderStub;
  var xml2jsFake;
  var result;

  before(function () {
    rootName = 'xml root name';
    buildObjectFake = 'this is the build object method';
    builderStub = sinon.stub().returns({ buildObject: buildObjectFake });
    xml2jsFake = { Builder: builderStub };

    var requireStub = sinon.stub().returns(xml2jsFake);
    result = Builder(rootName, requireStub);
  });

  it('should create a builder with the expected options', function () {
    sinon.assert.calledWithNew(builderStub);
    sinon.assert.calledWith(builderStub, { 
      rootName: rootName,
      xmldec: {
        standalone: null,
        version: "1.0",
        encoding: "UTF-8"
      }
    });
  });

  it('should create an xml builder', function () {
    assert.equal(result, buildObjectFake);
  });

});