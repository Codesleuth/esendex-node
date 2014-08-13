var RequestHandler = require('./requesthandler'),
    Messages = require('./messages'),
    Accounts = require('./accounts');

function Esendex(options) {
  this.requesthandler = RequestHandler(options);
  this.messages = new Messages(this);
  this.accounts = new Accounts(this);
}

module.exports = function (options) {
  return new Esendex(options);
};