var config = require('./config'),
    esendex = require('../')(config);

var options = {
  startIndex: 0,
  count: 3,
  accountreference: config.accountreference
};

esendex.batches.get(options, function (err, batches) {
  if (err) return console.log(err);

  batches.messagebatch.map(function (batch) {
    console.log(batch);
  });
});