var assert = require('assert'),
    util = require('util'),
    esandex = require('esandex'),
    Esendex = require('../../');

describe('Accounts Integration', function () {

  var sandbox;
  var esendex;

  before(function (done) {
    var sandboxPort = process.env.PORT || 3000;
    var sandboxApp = esandex.create();

    setTimeout(function () {
      sandbox = sandboxApp.listen(sandboxPort, function () {
        esendex = Esendex({
          host: 'localhost',
          port: sandboxPort,
          https: false
        });
        done();
      });
    }, 500);
  });

  after(function () {
    sandbox.close();
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
  });

  describe('get specific account', function () {

    var account;

    before(function (done) {
      esendex.accounts.get({ id: '01234567-89AB-CDEF-0123-456789ABCDEF' }, function (err, response) {
        if (err) return done(err);
        account = response;
        done();
      });
    });

    it('should return a single account', function () {
      assert.ok(!util.isArray(account));
    });
  });

});