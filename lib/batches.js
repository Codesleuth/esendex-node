var xmlparser = require('./xmlparser');

function Batches(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
}

Batches.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.requesthandler.request('GET', '/v1.0/messagebatches', options, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.messagebatches);
    });
  });
};

module.exports = function (esendex) {
  return new Batches(esendex);
};