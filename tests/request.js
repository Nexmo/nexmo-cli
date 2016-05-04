import Client   from '../source/client.js';
import Config   from '../source/config.js';
import easynexmo from 'easynexmo';
import Request  from '../source/request.js';
import Response from '../source/response.js';

import chai, { expect } from 'chai';
import sinon      from 'sinon';
import sinonChai  from 'sinon-chai';

chai.use(sinonChai);

describe('Request', () => {
  it('should export a Request object', () => {
    expect(Request).to.not.be.null;
    expect(Request.name).to.equal('Request');
  });

  describe('with an instance', () => {
    let client;
    let config;
    let nexmo;
    let request;
    let response;

    beforeEach(() => {
      client   = sinon.createStubInstance(Client);
      config   = sinon.createStubInstance(Config);
      response = sinon.createStubInstance(Response);
      request  = new Request(config, client, response);
    });

    describe('.accountSetup', () => {
      it('should call the Config', () => {
        request.accountSetup('123', 'abc', false);
        expect(config.putAndSave).to.have.been.called;
      });
    });

    describe('.accountBalance', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.accountBalance();
        expect(nexmo.checkBalance).to.have.been.called;
      }));
    });

    describe('.numbersList', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numbersList();
        expect(nexmo.getNumbers).to.have.been.called;
      }));
    });

    describe('.numberSearch', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', {});
        expect(nexmo.searchNumbers).to.have.been.called;
      }));

      it('should parse a voice flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', { voice: true });
        expect(nexmo.searchNumbers).to.have.been.calledWith('GB', { features: ['VOICE'] });
      }));

      it('should parse a sms flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', { sms: true });
        expect(nexmo.searchNumbers).to.have.been.calledWith('GB', { features: ['SMS'] });
      }));

      it('should parse both the sms and voice flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', { sms: true, voice: true });
        expect(nexmo.searchNumbers).to.have.been.calledWith('GB', { features: ['VOICE','SMS'] });
      }));

      it('should pass the pattern flag without a wildcard', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', { pattern: '020'});
        expect(nexmo.searchNumbers).to.have.been.calledWith('GB', { features: [], pattern: '020', search_pattern: 1 });
      }));

      it('should pass the pattern flag with a start-of wildcard', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', { pattern: '*020'});
        expect(nexmo.searchNumbers).to.have.been.calledWith('GB', { features: [], pattern: '*020', search_pattern: 2 });
      }));
    });
  });
});
