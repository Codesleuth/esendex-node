import * as http from 'http'
import * as https from 'https'
import * as querystring from 'querystring'
import {ResponseHandler} from './responsehandler'
import {UserAgentBuilder} from './useragentbuilder'

export declare interface RequestHandlerOptions {
  host?: string
  port?: number
  https?: boolean
  timeout?: number
  username?: string
  password?: string
}

let defaultOptions : RequestHandlerOptions = {
  host: 'api.esendex.com',
  port: 443,
  https: true,
  timeout: 30000
};

function onSocketTimeout() {
  this._req.abort();
}

export class RequestHandler {
  public options: RequestHandlerOptions;
  private responseHandler: ResponseHandler;
  private userAgent: string;
  
  constructor(options: RequestHandlerOptions) {
    this.options = {
      host: options && options.host !== undefined ? options.host : defaultOptions.host,
      port: options && options.port !== undefined  ? options.port : defaultOptions.port,
      https: options && options.https !== undefined  ? options.https : defaultOptions.https,
      timeout: options && options.timeout !== undefined  ? options.timeout : defaultOptions.timeout,
      username: options && options.username !== undefined  ? options.username : defaultOptions.username,
      password: options && options.password !== undefined  ? options.password : defaultOptions.password
    };
    this.responseHandler = new ResponseHandler();
    this.userAgent = UserAgentBuilder.Build();
  }

  request(method: string, path: string, query: Object, data: string, expectedStatus: number, callback: (err: any, responseData?: string) => void) {
    let isPost = /(POST|PUT)/.test(method);
    let headers = {
      'Accept': 'application/xml',
      'User-Agent': this.userAgent
    };
    let options = {
      host: this.options.host,
      port: this.options.port,
      path: path + (query ? '?' + querystring.stringify(query) : ''),
      method: method,
      headers: headers,
      auth: this.options.username + ':' + this.options.password
    };
  
    if (isPost) {
      headers['Content-Type'] = 'application/xml';
      headers['Content-Length'] = data ? data.length : 0;
    }
  
    var proto = this.options.https ? https : http;
    var req = proto.request(options, (res) => {
      this.responseHandler.handle(res, expectedStatus, callback);
    });
  
    req.on('socket', (socket) => {
      socket._req = req;
      if (this.options.timeout) {
        socket.setTimeout(this.options.timeout);
        if (socket.listeners('timeout').length === 0) {
          socket.on('timeout', onSocketTimeout);
        }
      }
    });
  
    req.on('error', function (err) {
      callback(err);
    });
  
    if (isPost && data) req.write(data);
    req.end();
  }
}

