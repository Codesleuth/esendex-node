var RequestHandler = require('./requesthandler'),
    Messages = require('./messages'),
    Accounts = require('./accounts'),
    Inbox = require('./inbox');

function Esendex(options) {
  this.requesthandler = RequestHandler(options);
  this.messages = new Messages(this);
  this.accounts = new Accounts(this);
  this.inbox = new Inbox(this);
}

module.exports = function (options) {
  return new Esendex(options);
};