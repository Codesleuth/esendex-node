import * as assert from 'assert'
import {isArray} from 'util'
import {EsendexFake} from './esendexfake'
import Esendex = require('../lib/index')

describe('Messages Integration', function () {

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

  describe('get latest sent messages', function () {

    var messages;

    before(function (done) {
      var options = { count: 3 };

      esendex.messages.get(options, function (err, messageheaders) {
        if (err) return done(err);
        messages = messageheaders;
        done();
      });
    });

    it('should return the count of returned sent messages', function () {
      assert.ok(messages.count);
    });

    it('should return the total count of sent messages', function () {
      assert.ok(messages.totalcount);
    });

    it('should return an array of messageheader', function () {
      assert.ok(isArray(messages.messageheader));
    });
  });

  describe('send a message', function () {

    var response;
    var loggedRequest;

    before(function (done) {
      var messages = {
        accountreference: 'EX0123456',
        message: [{
          to: '447000000000',
          body: "Every message matters!"
        }]
      };

      esendex.messages.send(messages, function (err, res) {
        if (err) return done(err);
        response = res;
        loggedRequest = esendexFake.dispatcherRequests.length === 0 ? null :  esendexFake.dispatcherRequests[0];
        done();
      });
    });

    it('should return the batch ID of the sent message', function () {
      assert.strictEqual(response.batchid, 'F8BF9867-FF81-49E4-ACC5-774DE793B776');
    });

    it('should return the messageheader ID and uri of the sent message', function () {
      assert.strictEqual(response.messageheader[0].id, '1183C73D-2E62-4F60-B610-30F160BDFBD5');
      assert.strictEqual(response.messageheader[0].uri, 'https://api.esendex.com/v1.0/messageheaders/1183C73D-2E62-4F60-B610-30F160BDFBD5');
    });

    it('should return an array of sent message headers', function () {
      assert.ok(isArray(response.messageheader));
    });

    it('should return one sent message header', function () {
      assert.strictEqual(response.messageheader.length, 1);
    });
  });

});