var xmlparser = require('./xmlparser'),
    format = require('util').format;

function Batches(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
}

Batches.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.requesthandler.request('GET', '/v1.0/messagebatches', options, null, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messagebatches);
    });
  });
};

Batches.prototype.cancel = function (batchId, callback) {
  var path = format('/v1.0/messagebatches/%s', batchId);

  this.esendex.requesthandler.request('DELETE', path, null, null, 204, function (err) {
    callback(err);
  });
};

module.exports = function (esendex) {
  return new Batches(esendex);
};