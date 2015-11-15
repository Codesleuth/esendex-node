import {Client} from './client'
import {XmlParser} from'./xmlparser'
import {XmlBuilder} from './xmlbuilder'
import {format, isArray} from 'util'

export declare interface MessagesGetOptions {
  id?: string
}

export class Messages {
  private client: Client;
  private builder: XmlBuilder;
  private parser: XmlParser;
  
  constructor (client: Client) {
    this.client = client;
    this.builder = new XmlBuilder('messages');
    this.parser = new XmlParser();
  }

  get(options: MessagesGetOptions, callback) {
    let path = '/v1.0/messageheaders';
  
    let messageId = options && options.id || null;
    if (messageId) {
      path = format('%s/%s', path, messageId);
      delete options.id;
    }
  
    this.client.requesthandler.request('GET', path, options, null, 200, (err, response) => {
      if (err) return callback(err);
  
      this.parser.parseString(response, function (err, result) {
        if (err) return callback(err);
        if (messageId) return callback(null, result.messageheader);
        
        let messageheaders = result.messageheaders;
  
        if (!isArray(messageheaders.messageheader))
          messageheaders.messageheader = [messageheaders.messageheader];
  
        callback(null, messageheaders);
      });
    });
  }

  send(messages, callback) {
    let xml = this.builder.build(messages);
  
    this.client.requesthandler.request('POST', '/v1.0/messagedispatcher', null, xml, 200, (err, response) => {
      if (err) return callback(err);
  
      this.parser.parseString(response, function (err, result) {
        if (err) return callback(err);
  
        let messageheaders = result.messageheaders;
  
        if (!isArray(messageheaders.messageheader))
          messageheaders.messageheader = [messageheaders.messageheader];
  
        callback(err, messageheaders);
      });
    });
  }

  getBody(messageId, callback) {
    let path = format('/v1.0/messageheaders/%s/body', messageId);
  
    this.client.requesthandler.request('GET', path, null, null, 200, (err, response) => {
      if (err) return callback(err);
  
      this.parser.parseString(response, function (err, result) {
        if (err) return callback(err);
        callback(err, result.messagebody);
      });
    });
  }
}