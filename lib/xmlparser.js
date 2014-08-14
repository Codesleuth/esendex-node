var xml2js = require('xml2js');

module.exports = function () {
  return xml2js.Parser({explicitArray: false, mergeAttrs: true}).parseString;
};