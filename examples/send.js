var config = require('./config'),
    esendex = require('../')(config);

var messages = {
  accountreference: config.accountreference,
  message: [{
    to: "07896563254",
    body: "Every message matters!"
  }]
};

esendex.messages.send(messages, function (err, response) {
  if (err) return console.log('error: ', err);
  console.dir(response);
});