import sinon = require('sinon');
import {ResponseHandler} from '../lib/responsehandler'

describe('Response Handler', function () {

  describe('handle expected response', function () {

    var expectedStatus;
    var data;
    var responseFake;
    var callbackSpy;

    before(function () {
      expectedStatus = 345;
      responseFake = { 
        on: sinon.stub(),
        statusCode: expectedStatus
      };
      data = "data chunk";
      responseFake.on.withArgs('data').callsArgWith(1, data);
      responseFake.on.withArgs('end').callsArg(1);

      callbackSpy = sinon.spy();
      let handler = new ResponseHandler();
      handler.handle(responseFake, expectedStatus, callbackSpy);
    });

    it('should attach a data event to the response', function () {
      sinon.assert.calledWith(responseFake.on, 'data');
    });

    it('should attach an end event to the response', function () {
      sinon.assert.calledWith(responseFake.on, 'end');
    });

    it('should call the callback with no error and the response data', function () {
      sinon.assert.calledWith(callbackSpy, null, data);
    });

  });

  describe('handle unexpected response', function () {

    var responseFake;
    var callbackSpy;

    before(function () {
      var expectedStatus = 345;
      responseFake = { 
        on: sinon.stub(),
        statusCode: 123
      };
      responseFake.on.withArgs('data').callsArgWith(1, "other chunk");
      responseFake.on.withArgs('end').callsArg(1);

      callbackSpy = sinon.spy();
      let handler = new ResponseHandler();
      handler.handle(responseFake, expectedStatus, callbackSpy);
    });

    it('should call the callback with an error', function () {
      sinon.assert.calledWith(callbackSpy, sinon.match.instanceOf(Error));
    });

  });

});