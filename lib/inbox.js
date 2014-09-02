var xmlparser = require('./xmlparser'),
    format = require('util').format;

function Inbox(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
}

Inbox.prototype.get = function (options, callback) {
  var self = this;

  var ref = options && options.accountreference || null;
  var path = ref ? format('/v1.0/inbox/%s/messages', ref) : '/v1.0/inbox/messages';

  this.esendex.requesthandler.request('GET', path, options, null, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messageheaders);
    });
  });
};

Inbox.prototype.update = function (options, callback) {
  var path = format('/v1.0/inbox/messages/%s', options.id);
  var query = { action: options.read ? 'read' : 'unread' };

  this.esendex.requesthandler.request('PUT', path, query, null, 200, function (err) {
    callback(err);
  });
};

Inbox.prototype.delete = function (id, callback) {
  var path = format('/v1.0/inbox/messages/%s', id);

  this.esendex.requesthandler.request('DELETE', path, null, null, 200, function (err) {
    callback(err);
  });
};

module.exports = function (esendex) {
  return new Inbox(esendex);
};