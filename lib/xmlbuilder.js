var _require = require;

module.exports = function (rootName, require) {
  require = require || _require;
  var xml2js = require('xml2js');
  var builder = new xml2js.Builder({ 
    rootName: rootName,
    xmldec: {
      standalone: null,
      version: '1.0',
      encoding: 'UTF-8'
    }
  });
  return function (obj) {
    return builder.buildObject(obj);
  };
};