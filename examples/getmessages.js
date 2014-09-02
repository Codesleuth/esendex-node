var config = require('./config'),
    esendex = require('../')(config);

var options = {
  startIndex: 0,
  count: 3,
  accountreference: config.accountreference
};

esendex.messages.get(options, function (err, messages) {
  if (err) return console.log(err);

  messages.messageheader.map(function (msg) {
    esendex.messages.getBody(msg.id, function (err, body) {
      if (err) return console.log(err);

      msg.body = body;
      console.log(msg);
    });
  });
});