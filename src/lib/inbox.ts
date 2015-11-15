import {Client} from './client'
import {XmlParser} from './xmlparser'
import {format} from 'util'

export declare interface InboxGetOptions {
  accountreference?: string
}

export declare interface InboxUpdateOptions {
  id: string
  read?: boolean
}

export class Inbox {
  private client: Client;
  private parser: XmlParser;
  
  constructor(client) {
    this.client = client;
    this.parser = new XmlParser();
  }

  get(options: InboxGetOptions, callback: (err: any, messageheaders?: any) => void) {
    var ref = options && options.accountreference || null;
    var path = ref ? format('/v1.0/inbox/%s/messages', ref) : '/v1.0/inbox/messages';
  
    this.client.requesthandler.request('GET', path, options, null, 200, (err, response) => {
      if (err) return callback(err);
  
      this.parser.parseString(response, function (err, result) {
        if (err) return callback(err);
        callback(null, result.messageheaders);
      });
    });
  }

  update(options: InboxUpdateOptions, callback: (err: any) => void) {
    var path = format('/v1.0/inbox/messages/%s', options.id);
    var query = { action: options.read ? 'read' : 'unread' };
  
    this.client.requesthandler.request('PUT', path, query, null, 200, callback);
  }

  delete(id, callback) {
    var path = format('/v1.0/inbox/messages/%s', id);
  
    this.client.requesthandler.request('DELETE', path, null, null, 200, callback);
  };
}