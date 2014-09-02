var config = require('./config'),
    esendex = require('../')(config);

var options = {
  startIndex: 0,
  count: 2,
  accountreference: config.accountreference
};

console.log('Getting message headers for account %s...', config.accountreference);
esendex.messages.get(options, function (err, messages) {
  if (err) return console.log(err);

  console.log('%d message headers found', messages.totalcount);
  messages.messageheader.map(function (messageheader) {

    console.log('Getting message %s...', messageheader.id);
    esendex.messages.get({ id: messageheader.id }, function (err, message) {
      if (err) return console.log(err);

      console.log('Got message, getting body...');
      esendex.messages.getBody(message.id, function (err, body) {
        if (err) return console.log(err);

        message.body = body;
        console.log(message);
      });
    });
  });
});