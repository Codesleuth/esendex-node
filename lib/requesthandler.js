var http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    responsehandler = require('./responsehandler');

var defaultOptions = {
  host: 'api.esendex.com',
  port: 443,
  https: true,
  timeout: 30000,
  username: undefined,
  password: undefined
};

function Request(options) {
  this.options = {};

  for (var option in defaultOptions) {
    this.options[option] = options && option in options ? options[option] : defaultOptions[option];
  }
}

Request.prototype.request = function (method, path, query, data, expectedStatus, callback) {
  var self = this;

  var isPost = /(POST|PUT)/.test(method),
      headers = {
        'Accept': 'application/xml',
        'User-Agent': 'github.com/codesleuth/esendex-node'
      },
      options = {
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
  var req = proto.request(options, function (res) {
    responsehandler.handle(res, expectedStatus, callback);
  });

  req.on('socket', function (socket) {
    if (self.options.timeout) {
      socket.setTimeout(self.options.timeout);
      socket.on('timeout', function () {
        req.abort();
      });
    }
  });

  req.on('error', function (err) {
    callback(err);
  });

  if (isPost && data) req.write(data);
  req.end();
};

module.exports = function (options) {
  return new Request(options);
};