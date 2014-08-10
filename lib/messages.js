var _require = require;

function Messages(esendex, require) {
  this.esendex = esendex;
  this.parser = require('./xmlparser')();
  this.builder = require('./xmlbuilder')('messages');
}

Messages.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.requesthandler.request('GET', '/v1.0/messageheaders', options, 200, function (err, response) {
    if (err) return callback(err);

    self.parser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messageheaders);
    });
  });
};

Messages.prototype.send = function (messages, callback) {
  var self = this;
  var xml = this.builder(messages);

  this.esendex.requesthandler.request('POST', '/v1.0/messagedispatcher', xml, 200, function (err, response) {
    if (err) return callback(err);

    self.parser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messageheaders);
    });
  });
};

module.exports = function (esendex, require) {
  return new Messages(esendex, require || _require);
};