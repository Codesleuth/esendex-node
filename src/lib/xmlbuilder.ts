import {Builder} from 'xml2js';

export class XmlBuilder {
  private builder: Builder;
  
  constructor(rootName: string) {
    this.builder = new Builder({ 
      rootName: rootName,
      xmldec: {
        standalone: null,
        version: '1.0',
        encoding: 'UTF-8'
      }
    });
  }
  
  build(rootObj): string {
    return this.builder.buildObject(rootObj);
  }
}