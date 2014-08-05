var _require = require;

function Accounts(esendex, require) {
  this.esendex = esendex;
  this.xmlparser = require('./xmlparser')();
}

Accounts.prototype.get = function (options, callback) {
  var self = this;

  this.esendex.requesthandler.request('GET', '/v1.0/accounts', options, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      callback(err, result.accounts);
    });
  });
};

module.exports = function (esendex, require) {
  return new Accounts(esendex, require || _require);
};