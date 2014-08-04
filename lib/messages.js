var _require = require;

function Messages(esendex, require) {
  this.esendex = esendex;
  this.parser = require('./parser');
  this.builder = require('./builder')('messages');
}

Messages.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.api.request('GET', "/v1.0/messageheaders", options, 200, function (err, response) {
    if (err) return callback(err);

    self.parser(response, function (err, result) {
      callback(err, result.messageheaders);
    });
  });
};

Messages.prototype.send = function (messages, callback) {
  var self = this;
  var xml = this.builder(messages);

  this.esendex.api.request('POST', "/v1.0/messagedispatcher", xml, 200, function (err, response) {
    if (err) return callback(err);

    self.parser(response, function (err, result) {
      callback(err, result.messageheaders);
    });
  });
};

module.exports = function (esendex, require) {
  return new Messages(esendex, require || _require);
};