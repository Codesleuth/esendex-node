var RequestHandler = require('./requesthandler'),
    Messages = require('./messages'),
    Accounts = require('./accounts'),
    Inbox = require('./inbox'),
    Batches = require('./batches');

function Esendex(options) {
  this.requesthandler = RequestHandler(options);
  this.messages = new Messages(this);
  this.accounts = new Accounts(this);
  this.inbox = new Inbox(this);
  this.batches = new Batches(this);
}

module.exports = function (options) {
  return new Esendex(options);
};