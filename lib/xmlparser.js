var _require = require;

module.exports = function (require) {
  require = require || _require;
  var xml2js = require('xml2js');
  return xml2js.Parser({explicitArray: false, mergeAttrs: true}).parseString;
};