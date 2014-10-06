var assert = require('assert'),
    util = require('util'),
    Esendex = require('../'),
    config = require('./config.integration.test');

describe('Accounts Integration', function () {

  var esendex;
  var accountId;

  before(function () {
    esendex = Esendex(config);
  });

  describe('get all accounts', function () {

    var accounts;

    before(function (done) {
      esendex.accounts.get(null, function (err, response) {
        if (err) return done(err);
        accounts = response;
        done();
      });
    });

    it('should return an array of accounts', function () {
      assert.ok(util.isArray(accounts.account));
    });

    it('should return an at least one account', function () {
      assert.ok(accounts.account.length > 0);
    });

    after(function () {
      accounts.account.some(function (account) {
        if (account.reference === config.accountreference) {
          accountId = account.id;
          return true;
        }
      });
    });
  });

  describe('get specific account', function () {

    var account;

    before(function (done) {
      esendex.accounts.get({ id: accountId }, function (err, response) {
        if (err) return done(err);
        account = response;
        done();
      });
    });

    it('should return a single account', function () {
      assert.ok(!util.isArray(account));
    });

    it('should return the expected account', function () {
      assert.equal(account.reference, config.accountreference);
    });
  });

});