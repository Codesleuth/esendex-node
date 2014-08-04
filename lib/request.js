var http = require('http'),
    https = require('https'),
    querystring = require('querystring');

function Request(options) {
  this.options = {
    host: options && options.host || 'api.esendex.com',
    port: options && options.port || 443,
    https: options && options.https || true,
    timeout: options && options.timeout || 30,
    username: options && options.username,
    password: options && options.password
  };
}

Request.prototype.request = function (method, path, data, expectedStatus, callback) {
  var isPost = /(POST|PUT)/.test(method),
      headers = {
        'Accept': 'application/xml',
        'User-Agent': 'github.com/codesleuth/esendex-node'
      },
      options = {
        host: this.options.host,
        port: this.options.port,
        path: path + (isPost ? '' : (data ? '?' + querystring.stringify(data) : '')),
        method: method,
        headers: headers,
        auth: this.options.username + ':' + this.options.password
      };

  if (isPost) {
    headers['Content-Type'] = 'application/xml';
    headers['Content-Length'] = data.length;
  }

  var proto = this.options.https ? https : http;
  var req = proto.request(options, function (res) {

    if (res.statusCode !== expectedStatus) {
      req.abort(); // TODO: solve why this is needed?!
      return callback('Unexpected API response: ' + res.statusCode);
    }

    var responseData = '';
    res.on('data', function (chunk) {
      responseData += chunk;
    });
    res.on('end', function () {
      callback(null, responseData);
    });

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

module.exports = function (options) {
  return new Request(options);
};