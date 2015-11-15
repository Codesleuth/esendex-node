import * as express from 'express'
import {createReadStream} from 'fs'
import {join as joinPath} from 'path'
import * as bodyParser from 'body-parser'
    
function copy(source) {
  var origin = {};
  var keys = Object.keys(source);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = source[keys[i]];
  }
  return origin;
};

declare interface Loggedrequest {
  headers: Object
  body: string
}

export class EsendexFake {
  private server;
  private app: express.Application;
  private dispatcherRequests: Loggedrequest[];
  
  constructor() {
    this.app = express();
    
    this.dispatcherRequests = [];
    
    var textBodyParser = bodyParser.text();
    
    this.app.get('/v1.0/accounts', this.AccountsEndpoint.bind(this));
    this.app.get('/v1.0/accounts/01234567-89AB-CDEF-0123-456789ABCDEF', this.AccountEndpoint.bind(this));
    this.app.get('/v1.0/messageheaders', this.MessageHeadersEndpoint.bind(this));
    this.app.post('/v1.0/messagedispatcher', textBodyParser, this.MessageDispatcherEndpoint.bind(this));
  }
  
  listen(port, cb) {
    this.server = this.app.listen(port, cb);
  }
  
  close() {
    this.server.close();
  }
  
  private MessageDispatcherEndpoint(req: express.Request, res: express.Response) {
    this.dispatcherRequests.push({
      headers: copy(req.headers),
      body: req.body
    });
    res.status(200);
    res.set('Content-Type', 'application/xml');
    createReadStream(joinPath(__dirname, '..', '..', 'responses', 'messagedispatcher-post.xml')).pipe(res);
  }
  
  private MessageHeadersEndpoint(req: express.Request, res: express.Response) {
    res.status(200);
    res.set('Content-Type', 'application/xml');
    createReadStream(joinPath(__dirname, '..', '..', 'responses', 'messageheaders-get-all.xml')).pipe(res);
  }
  
  private AccountEndpoint(req: express.Request, res: express.Response) {
    res.status(200);
    res.set('Content-Type', 'application/xml');
    createReadStream(joinPath(__dirname, '..', '..', 'responses', 'accounts-get-single.xml')).pipe(res);
  }
  
  private AccountsEndpoint(req: express.Request, res: express.Response) {
    res.status(200);
    res.set('Content-Type', 'application/xml');
    createReadStream(joinPath(__dirname, '..', '..', 'responses', 'accounts-get-all.xml')).pipe(res);
  }
}