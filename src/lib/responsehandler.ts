import * as http from 'http'

export class ResponseHandler {
  handle(res: http.IncomingMessage, expectedStatus: number, callback: (err: any, responseData?: string) => void) {
    var responseData = '';
    res.on('data', function (chunk) {
      responseData += chunk;
    });
    res.on('end', function () {
      if (res.statusCode !== expectedStatus)
        return callback(new Error('Unexpected API response (' + res.statusCode + '): ' + responseData));
  
      callback(null, responseData);
    });
  }
}