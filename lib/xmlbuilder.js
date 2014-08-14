var xml2js = require('xml2js');

module.exports = function (rootName) {
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