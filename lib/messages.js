var xmlparser = require('./xmlparser'),
    xmlbuilder = require('./xmlbuilder');

function Messages(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
  this.xmlbuilder = xmlbuilder('messages');
}

Messages.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.requesthandler.request('GET', '/v1.0/messageheaders', options, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messageheaders);
    });
  });
};

Messages.prototype.send = function (messages, callback) {
  var self = this;
  var xml = this.xmlbuilder(messages);

  this.esendex.requesthandler.request('POST', '/v1.0/messagedispatcher', xml, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messageheaders);
    });
  });
};

module.exports = function (esendex) {
  return new Messages(esendex);
};