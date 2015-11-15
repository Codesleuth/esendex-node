import * as assert from 'assert'
import {isArray} from 'util'
import {EsendexFake} from './esendexfake'
import Esendex = require('../lib/index')

describe('Accounts Integration', function () {

  var esendexFake;
  var esendex;

  before(function (done) {
    var fakePort = process.env.PORT || 3000;
    esendexFake = new EsendexFake();

    esendexFake.listen(fakePort, function () {
      esendex = Esendex({
        host: 'localhost',
        port: fakePort,
        https: false
      });
      done();
    });
  });

  after(function () {
    esendexFake.close();
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
      assert.ok(isArray(accounts.account));
    });

    it('should return an at least one account', function () {
      assert.strictEqual(accounts.account.length, 1);
    });

    it('should return the expected account', function () {
      var account = accounts.account[0];
      assert.strictEqual(account.id, 'A00F0218-510D-423D-A74E-5A65342FE070');
      assert.strictEqual(account.uri, 'http://api.esendex.com/v1.0/accounts/A00F0218-510D-423D-A74E-5A65342FE070');
      assert.strictEqual(account.reference, 'EX0000000');
      assert.strictEqual(account.label, 'EX0000000');
      assert.strictEqual(account.address, '447700900654');
      assert.strictEqual(account.type, 'Professional');
      assert.strictEqual(account.messagesremaining, '2000');
      assert.strictEqual(account.expireson, '2999-02-25T00:00:00');
      assert.strictEqual(account.role, 'PowerUser');
      assert.strictEqual(account.settings.uri, 'http://api.esendex.com/v1.0/accounts/A00F0218-510D-423D-A74E-5A65342FE070/settings');
    });
  });

  describe('get single account', function () {

    var account;

    before(function (done) {
      esendex.accounts.get({ id: '01234567-89AB-CDEF-0123-456789ABCDEF' }, function (err, response) {
        if (err) return done(err);
        account = response;
        done();
      });
    });

    it('should return the expected account', function () {
      assert.strictEqual(account.id, 'D35FA8EB-3C12-4E8E-8DEC-8568B2F35890');
      assert.strictEqual(account.uri, 'http://api.esendex.com/v1.0/accounts/D35FA8EB-3C12-4E8E-8DEC-8568B2F35890');
      assert.strictEqual(account.reference, 'EX0000000');
      assert.strictEqual(account.label, 'EX0000000');
      assert.strictEqual(account.address, '447700900654');
      assert.strictEqual(account.type, 'Professional');
      assert.strictEqual(account.messagesremaining, '2000');
      assert.strictEqual(account.expireson, '2999-02-25T00:00:00');
      assert.strictEqual(account.role, 'PowerUser');
      assert.strictEqual(account.settings.uri, 'http://api.esendex.com/v1.0/accounts/A00F0218-510D-423D-A74E-5A65342FE070/settings');
    });
  });

});