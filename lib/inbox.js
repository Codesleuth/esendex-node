var xmlparser = require('./xmlparser');

function Inbox(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
}

Inbox.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.requesthandler.request('GET', '/v1.0/inbox/messages', options, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messageheaders);
    });
  });
};

module.exports = function (esendex) {
  return new Inbox(esendex);
};