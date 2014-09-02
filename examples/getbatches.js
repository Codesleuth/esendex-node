var config = require('./config'),
    format = require('util').format,
    esendex = require('../')(config);

var options = {
  startIndex: 0,
  count: 2,
  accountreference: config.accountreference
};

esendex.batches.get(options, function (err, batches) {
  if (err) return console.log(err);

  batches.messagebatch.map(function (batch, index) {
    console.log(batch);

    var newBatchName = format('My new name! (batch %d) %s', index, new Date());
    esendex.batches.rename({ id: batch.id, name: newBatchName }, function (err) {
      if (err) return console.log(err);

      console.log('Batch renamed to: %s', newBatchName);
    });
  });
});