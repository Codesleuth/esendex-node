var _require = require;

var defaultOptions = {
  host: 'api.esendex.com',
  port: 443,
  https: true,
  timeout: 30,
  username: undefined,
  password: undefined
};

function Request(options, require) {
  this.options = {};

  for (var option in defaultOptions) {
    this.options[option] = options && option in options ? options[option] : defaultOptions[option];
  }

  this.http = require('http');
  this.https = require('https');
  this.querystring = require('querystring');
  this.responsehandler = require('./responsehandler');
}

Request.prototype.request = function (method, path, data, expectedStatus, callback) {
  var self = this;

  var isPost = /(POST|PUT)/.test(method),
      headers = {
        'Accept': 'application/xml',
        'User-Agent': 'github.com/codesleuth/esendex-node'
      },
      options = {
        host: this.options.host,
        port: this.options.port,
        path: path + (isPost ? '' : (data ? '?' + this.querystring.stringify(data) : '')),
        method: method,
        headers: headers,
        auth: this.options.username + ':' + this.options.password
      };

  if (isPost) {
    headers['Content-Type'] = 'application/xml';
    headers['Content-Length'] = data.length;
  }

  var proto = this.options.https ? this.https : this.http;
  var req = proto.request(options, function (res) {
    self.responsehandler.handle(res, expectedStatus, callback);
  });

  req.on('socket', function (socket) {
    if (options.timeout) {
      socket.setTimeout(options.timeout);
      socket.on('timeout', function () {
        req.abort();
      });
    }
  });

  req.on('error', function (err) {
    callback(err);
  });

  if (isPost) req.write(data);
  req.end();
};

module.exports = function (options, require) {
  return new Request(options, require || _require);
};