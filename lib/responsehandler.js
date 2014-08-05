module.exports.handle = function (res, expectedStatus, callback) {
  var responseData = '';
  res.on('data', function (chunk) {
    responseData += chunk;
  });
  res.on('end', function () {
    if (res.statusCode !== expectedStatus)
      return callback(new Error('Unexpected API response (' + res.statusCode + '): ' + responseData));

    callback(null, responseData);
  });
};