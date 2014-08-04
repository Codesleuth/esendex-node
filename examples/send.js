var config = require('./config'),
    esendex = require('../')(config);

var messages = {
  accountreference: "DevTestLive",
  message: [{
    to: "04656698563",
    body: "something"
  }]
};

esendex.messages.send(messages, function (err, response) {
  if (err) return console.log('error: ', err);
  console.dir(response);
});