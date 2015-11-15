import sinon = require('sinon')
import * as _proxyquire from 'proxyquire'
import {XmlParser} from '../lib/xmlparser'
let proxyquire = _proxyquire.noCallThru();

describe('XmlParser', function () {

  let parsedObject: Object;
  let parseStringStub: Sinon.SinonStub;
  let parserStub;
  let callbackSpy: Sinon.SinonSpy;
  let stringToParse: string;

  before(function () {
    parsedObject = {};
    parseStringStub = sinon.stub().callsArgWith(1, null, parsedObject);
    parserStub = sinon.stub().returns({ parseString: parseStringStub});
    
    let xml2js = { Parser: parserStub };
    
    callbackSpy = sinon.spy();
    
    stringToParse = 'string to parse';
    
    let Parser = proxyquire('../lib/xmlparser', { 'xml2js': xml2js }).XmlParser;
    let parser: XmlParser = new Parser();
    parser.parseString(stringToParse, callbackSpy);
  });

  it('should create a parser with the expected options', function () {
    sinon.assert.calledWithNew(parserStub, { explicitArray: false, mergeAttrs: true });
  });
  
  it('should parse the string', function () {
    sinon.assert.calledWith(parseStringStub, stringToParse, callbackSpy);
  });
  
  it('should call the callback with the parsed object', function () {
    sinon.assert.calledWith(callbackSpy, null, parsedObject);
  });

});