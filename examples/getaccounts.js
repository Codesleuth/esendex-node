var config = require('./config'),
    esendex = require('../')(config);

esendex.accounts.get(null, function (err, accounts) {
  if (err) return console.log(err);

  accounts.account.map(function (account) {
    console.log(account);
  });
});