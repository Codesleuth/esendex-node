var xmlparser = require('./xmlparser');

function Accounts(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
}

Accounts.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.requesthandler.request('GET', '/v1.0/accounts', options, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);
      callback(err, result.accounts);
    });
  });
};

module.exports = function (esendex) {
  return new Accounts(esendex);
};