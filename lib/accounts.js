var xmlparser = require('./xmlparser'),
    isArray = require('util').isArray,
    format = require('util').format;

function Accounts(esendex) {
  this.esendex = esendex;
  this.xmlparser = xmlparser();
}

Accounts.prototype.get = function (options, callback) {
  var self = this;
  var path = '/v1.0/accounts';

  var accountId = options && options.id || null;
  if (accountId) {
    path = format('%s/%s', path, accountId);
    delete options.id;
  }

  this.esendex.requesthandler.request('GET', path, options, null, 200, function (err, response) {
    if (err) return callback(err);

    self.xmlparser(response, function (err, result) {
      if (err) return callback(err);

      if (accountId) return callback(null, result.account);
      
      var accounts = result.accounts;

      if (!isArray(accounts.account))
        accounts.account = [accounts.account];

      callback(null, accounts);
    });
  });
};

module.exports = function (esendex) {
  return new Accounts(esendex);
};