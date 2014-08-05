var _require = require;

function Esendex(options, require) {
  this.requesthandler = require('./requesthandler')(options);
  this.messages = new (require('./messages'))(this);
  this.accounts = new (require('./accounts'))(this);
}

module.exports = function (options, require) {
  return new Esendex(options, require || _require);
};