import Client  from '../src/client.js';
import Config  from '../src/config.js';
import Emitter from '../src/emitter.js';
import Nexmo   from 'nexmo';

import { expect } from 'chai';
import sinon      from 'sinon';
import sinonTest  from 'sinon-test';
const test = sinonTest(sinon);

describe('Client', () => {
  it('should export a Client object', () => {
    expect(Client).to.not.be.null;
    expect(Client.name).to.equal('Client');
  });

  describe('.instance', () => {
    it('should initialize the library of the filesystem', test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);

      config.read.returns({ credentials: { api_key: '123', api_secret: 'abc'}});

      const client = new Client(config, emitter);
      const nexmo = client.instance();

      expect(nexmo).to.be.an.instanceof(Nexmo);
    }));

    it('should allow for debugging', test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);

      config.read.returns({ credentials: { api_key: '123', api_secret: 'abc'}});
      emitter.debugging = true;

      const client = new Client(config, emitter);
      const nexmo = client.instance();

      expect(nexmo.options.debug).to.be.true;
    }));

    it('should pass along the user agent to the nexmo client', test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);

      config.read.returns({ credentials: { api_key: '123', api_secret: 'abc'}});

      const client = new Client(config, emitter);
      const nexmo = client.instance();

      expect(nexmo.options.userAgent).to.match(/^nexmo-node\/[\d.]* node\/[\d.]* nexmo-cli\/[\d.]*$/);
    }));

  });

  describe('.instanceWith', () => {
    it('should initialize a new library of the given credentials', test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);

      const client = new Client(config, emitter);
      const nexmo = client.instanceWith(123, 234);

      expect(nexmo).to.be.an.instanceof(Nexmo);
    }));
  });

  describe('.definition', () => {
    it('should return the Nexmo definition', test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);
      let client = new Client(config, emitter);

      const definition = client.definition();
      expect(definition).to.equal(Nexmo);
    }));
  });

});
