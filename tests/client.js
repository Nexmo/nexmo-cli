import Client  from '../source/client.js';
import Config  from '../source/config.js';
import Emitter from '../source/emitter.js';
import easynexmo from 'easynexmo';

import { expect } from 'chai';
import sinon      from 'sinon';



describe('Client', () => {
  it('should export a Client object', () => {
    expect(Client).to.not.be.null;
    expect(Client.name).to.equal('Client');
  });

  describe('.instance', () => {
    it('should initialize the SDK', sinon.test(function () {
      let emitter = sinon.createStubInstance(Emitter);
      let config = sinon.createStubInstance(Config);
      let nexmo = this.stub(easynexmo);

      config.read.returns({ credentials: { api_key: '123', api_secret: 'abc'}});

      let client = new Client(config, emitter);
      client.instance();

      expect(nexmo.initialize).to.have.been.called;
    }));
  });
});
