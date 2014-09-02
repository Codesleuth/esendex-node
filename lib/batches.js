var xmlparser = require('./xmlparser'),
    xmlbuilder = require('./xmlbuilder'),
    format = require('util').format;

function Batches(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
  this.xmlbuilder = xmlbuilder('messagebatch')
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

Batches.prototype.rename = function (options, callback) {
  var path = format('/v1.1/messagebatches/%s', options.id);
  var xml = this.xmlbuilder({
    '$': {
      xmlns: 'http://api.esendex.com/ns/'
    },
    name: options.name
  });

  this.esendex.requesthandler.request('PUT', path, null, xml, 204, function (err) {
    callback(err);
  });
};

module.exports = function (esendex) {
  return new Batches(esendex);
};