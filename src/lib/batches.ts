import {Client} from './client'
import {XmlParser} from './xmlparser'
import {XmlBuilder} from './xmlbuilder'
import {format} from 'util'

export class Batches {
  private client: Client;
  private builder: XmlBuilder;
  private parser: XmlParser;
  
  constructor(client: Client) {
    this.client = client;
    this.builder = new XmlBuilder('messagebatch');
    this.parser = new XmlParser();
  }

  get(options, callback) {
    this.client.requesthandler.request('GET', '/v1.0/messagebatches', options, null, 200, (err, response) => {
      if (err) return callback(err);
  
      this.parser.parseString(response, function (err, result) {
        if (err) return callback(err);
        callback(null, result.messagebatches);
      });
    });
  };

  cancel(batchId, callback) {
    let path = format('/v1.0/messagebatches/%s', batchId);
  
    this.client.requesthandler.request('DELETE', path, null, null, 204, callback);
  };
  
  rename(options, callback) {
    let path = format('/v1.1/messagebatches/%s', options.id);
    let requestObject = {
      '$': {
        xmlns: 'http://api.esendex.com/ns/'
      },
      name: options.name
    };
    let xml = this.builder.build(requestObject);
  
    this.client.requesthandler.request('PUT', path, null, xml, 204, callback);
  };
}