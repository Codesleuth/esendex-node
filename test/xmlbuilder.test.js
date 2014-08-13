var assert = require('assert'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

describe('XML Builder', function () {

  var rootName;
  var expectedXml;
  var objectToBuild;
  var buildObjectStub;
  var builderStub;
  var xml2jsFake;
  var result;

  before(function () {
    rootName = 'xml root name';
    expectedXml = 'xml <> things';
    objectToBuild = { object: 'to build' };
    buildObjectStub = sinon.stub().returns(expectedXml);
    builderStub = sinon.stub().returns({ buildObject: buildObjectStub });
    xml2jsFake = { Builder: builderStub };

    var XmlBuilder = proxyquire('../lib/xmlbuilder', { 'xml2js': xml2jsFake });
    var buildObjectFunc = XmlBuilder(rootName);
    result = buildObjectFunc(objectToBuild);
  });

  it('should create a builder with the expected options', function () {
    sinon.assert.calledWithNew(builderStub);
    sinon.assert.calledWith(builderStub, { 
      rootName: rootName,
      xmldec: {
        standalone: null,
        version: '1.0',
        encoding: 'UTF-8'
      }
    });
  });

  it('should call the builder function', function () {
    sinon.assert.called(buildObjectStub, objectToBuild);
  });

  it('should return the expected xml', function () {
    assert.equal(result, expectedXml);
  });

});