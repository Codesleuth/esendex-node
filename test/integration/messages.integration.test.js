var assert = require('assert'),
    util = require('util'),
    esendexSandbox = require('esendex-sandbox'),
    Esendex = require('../../');

describe('Messages Integration', function () {

  var sandbox;
  var esendex;

  before(function (done) {
    var sandboxPort = process.env.PORT || 3000;
    var sandboxApp = esendexSandbox.create();

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
      assert.ok(util.isArray(messages.messageheader));
    });
  });

  describe('send a message', function () {

    var response;

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