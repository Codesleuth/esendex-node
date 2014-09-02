var config = require('./config'),
    esendex = require('../')(config);

var options = {
  startIndex: 0,
  count: 3
};

esendex.inbox.get(options, function (err, messages) {
  if (err) return console.log(err);

  messages.messageheader.map(function (msg) {
    console.log(msg);
  });
});


options.accountreference = config.accountreference;

esendex.inbox.get(options, function (err, messages) {
  if (err) return console.log(err);

  messages.messageheader.map(function (msg) {
    console.log(msg);
  });
});