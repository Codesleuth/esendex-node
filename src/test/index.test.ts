import * as assert from 'assert'
import sinon = require('sinon')
import _proxyquire = require('proxyquire')
import {Client} from '../lib/client'
let proxyquire = _proxyquire.noCallThru()

describe('Client', function () {

  describe('expose all public apis', function () {

    var options;
    var clientFake;
    var clientStub;
    var client: Client;

    before(function () {
      options = { Stuff: 'and things' };

      clientFake = {};
      clientStub = sinon.stub().returns(clientFake);

      let Esendex = proxyquire('../lib/', {
        './client': { Client: clientStub },
      });
      
      client = Esendex(options);
    });

    it('should create a client', function () {
      sinon.assert.calledWithNew(clientStub);
      sinon.assert.calledWith(clientStub, options);
    });

    it('should return the created client', function () {
      assert.strictEqual(client, clientFake);
    });

  });

});