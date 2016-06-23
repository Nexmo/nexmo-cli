import Client  from '../src/client.js';
import Config  from '../src/config.js';
import Emitter from '../src/emitter.js';
import Nexmo from 'nexmo';

import { expect } from 'chai';
import sinon      from 'sinon';

describe('Client', () => {
  it('should export a Client object', () => {
    expect(Client).to.not.be.null;
    expect(Client.name).to.equal('Client');
  });

  describe('.instance', () => {
    it('should initialize the library', sinon.test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);

      config.read.returns({ credentials: { api_key: '123', api_secret: 'abc'}});

      let client = new Client(config, emitter);
      let nexmo = client.instance();

      expect(nexmo).to.be.an.instanceof(Nexmo);
    }));

    it('should allow for debugging', sinon.test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);

      config.read.returns({ credentials: { api_key: '123', api_secret: 'abc'}});
      emitter.debugging = true;

      let client = new Client(config, emitter);
      let nexmo = client.instance();

      expect(nexmo._options.debug).to.be.true;
    }));
  });
});
