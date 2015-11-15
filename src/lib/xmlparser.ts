import {Parser} from 'xml2js';

export class XmlParser {
  private parser: Parser;
  
  constructor() {
    this.parser = new Parser({ explicitArray: false, mergeAttrs: true });
  }
  
  parseString(str: string , cb?: Function) {
    this.parser.parseString(str, cb);
  }
}