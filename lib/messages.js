var xmlparser = require('./xmlparser'),
    xmlbuilder = require('./xmlbuilder'),
    format = require('util').format,
    isArray = require('util').isArray;

function Messages(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
  this.xmlbuilder = xmlbuilder('messages');
}

Messages.prototype.get = function (options, callback) {
  var self = this;
  var path = '/v1.0/messageheaders';

  var messageId = options && options.id || null;
  if (messageId) {
    path = format('%s/%s', path, messageId);
    delete options.id;
  }

  this.esendex.requesthandler.request('GET', path, options, null, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);

      if (messageId) return callback(null, result.messageheader);
      
      var messageheaders = result.messageheaders;

      if (!isArray(messageheaders.messageheader))
        messageheaders.messageheader = [messageheaders.messageheader];

      callback(null, messageheaders);
    });
  });
};

Messages.prototype.send = function (messages, callback) {
  var self = this;
  var xml = this.xmlbuilder(messages);

  this.esendex.requesthandler.request('POST', '/v1.0/messagedispatcher', null, xml, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);

      var messageheaders = result.messageheaders;

      if (!isArray(messageheaders.messageheader))
        messageheaders.messageheader = [messageheaders.messageheader];

      callback(err, messageheaders);
    });
  });
};

Messages.prototype.getBody = function (messageId, callback) {
  var self = this;

  var path = format('/v1.0/messageheaders/%s/body', messageId);

  this.esendex.requesthandler.request('GET', path, null, null, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messagebody);
    });
  });
};

module.exports = function (esendex) {
  return new Messages(esendex);
};