var config = require('./config'),
    Esendex = require('../');
    
var esendex = new Esendex(config);

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
    esendex.inbox.update({ id: msg.id, read: false }, function (err) {
      if (err) return console.log(err);
      console.log('Marked message %s as read!', msg.id);

      esendex.inbox.update({ id: msg.id, read: true }, function (err) {
        if (err) return console.log(err);
        console.log('Marked message %s as unread!', msg.id);
      });

      // esendex.inbox.delete(msg.id, function (err) {
      //   if (err) return console.log(err);
      //   console.log('Deleted message %s!', msg.id);
      // });
    });
  });
});