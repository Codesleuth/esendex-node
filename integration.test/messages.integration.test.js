var assert = require('assert'),
    util = require('util'),
    Esendex = require('../'),
    config = require('./config.integration.test');

describe('Messages Integration', function () {

  var esendex;

  before(function () {
    esendex = Esendex(config);
  });

  describe('get latest three sent messages', function () {

    var messages;

    before(function (done) {
      var options = {
        count: 3
      };

      esendex.messages.get(options, function (err, messageheaders) {
        if (err) return done(err);
        messages = messageheaders;
        done();
      });
    });

    it('should return the count of returned sent messages', function () {
      assert.equal(messages.count, 3);
    });

    it('should return the total count of sent messages', function () {
      assert.ok(messages.totalcount);
    });

    it('should return an array of messageheader', function () {
      assert.ok(util.isArray(messages.messageheader));
    });

    it('should return three message headers', function () {
      assert.equal(messages.messageheader.length, 3);
    });
  });

  describe.skip('send a message', function () {

    var response;

    before(function (done) {
      var messages = {
        accountreference: config.accountreference,
        message: [{
          to: config.mobilenumber,
          body: "Every message matters!"
        }]
      };

      esendex.messages.send(messages, function (err, res) {
        if (err) return done(err);
        response = res;
        done();
      });
    });

    it('should return the batch ID of the sent message', function () {
      assert.ok(response.batchid);
    });

    it('should return one message header', function () {
      assert.ok(response.messageheader);
    });

    it('should return an array of sent message headers', function () {
      assert.ok(util.isArray(response.messageheader));
    });

    it('should return one sent message header', function () {
      assert.equal(response.messageheader.length, 1);
    });
  });

});