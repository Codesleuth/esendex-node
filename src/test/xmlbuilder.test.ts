import * as assert from 'assert'
import sinon = require('sinon')
import * as _proxyquire from 'proxyquire'
import {XmlBuilder} from '../lib/xmlbuilder'
let proxyquire = _proxyquire.noCallThru();

describe('XmlBuilder', function () {

  var rootName: string;
  var xmlString: string;
  var buildObjectStub: Sinon.SinonStub;
  var builderSpy: Sinon.SinonSpy;
  var objectToBuild: Object;
  var result: string;

  before(function () {
    rootName = 'this is the root object name';
    xmlString = 'I am totally some XML'
    
    buildObjectStub = sinon.stub().returns(xmlString);
    let xml2js = { Builder: function () { this.buildObject = buildObjectStub; } };
    builderSpy = sinon.spy(xml2js, 'Builder');
    
    
    objectToBuild = { Some: 'object' };
    
    let Builder = proxyquire('../lib/xmlbuilder', { 'xml2js': xml2js }).XmlBuilder;
    let builder: XmlBuilder = new Builder(rootName);
    result = builder.build(objectToBuild);
  });

  it('should create a builder with the expected options', function () {
    sinon.assert.calledOnce(builderSpy);
    sinon.assert.calledWithNew(builderSpy);
    sinon.assert.calledWith(builderSpy, sinon.match({ 
      rootName: rootName,
      xmldec: {
        standalone: null,
        version: '1.0',
        encoding: 'UTF-8'
      },
      allowSurrogateChars: true
    }));
  });
  
  it('should build the object to xml', function () {
    sinon.assert.calledWith(buildObjectStub, objectToBuild);
  });
  
  it('should return the built xml string', function () {
    assert.strictEqual(result, xmlString);
  });

});