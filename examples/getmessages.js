var config = require('./config'),
    esendex = require('../')(config);

var options = {
  startIndex: 1,
  count: 3,
  accountreference: config.accountreference
};

esendex.messages.get(options, function (err, messages) {
  if (err) return console.log(err);

  messages.messageheader.map(function (msg) {
    console.log(msg);
  });
});