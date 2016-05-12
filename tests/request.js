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
        request.numbersList({});
        expect(nexmo.getNumbers).to.have.been.called;
      }));

      it('should parse a page flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numbersList({ page: 2 });
        expect(nexmo.getNumbers).to.have.been.calledWith({ index: 2 });
      }));

      it('should parse a size flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numbersList({ size: 25 });
        expect(nexmo.getNumbers).to.have.been.calledWith({ size: 25 });
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

      it('should parse a page flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', { page: 2 });
        expect(nexmo.searchNumbers).to.have.been.calledWith('GB', { features: [], index: 2 });
      }));

      it('should parse a size flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberSearch('GB', { size: 25 });
        expect(nexmo.searchNumbers).to.have.been.calledWith('GB', { features: [], size: 25 });
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

    describe('.numberBuy', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberBuy(null, { confirm: true, parent: { rawArgs: ['nb', '123'] } });
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));

      it('should handle search', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberBuy(null, { parent: { rawArgs: ['nb', 'GB', '123'] } });
        expect(nexmo.searchNumbers).to.have.been.called;
      }));
    });

    describe('.numberCancel', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.numberCancel('123', { confirm: true });
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));
    });

    describe('.applicationsList', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationsList({});
        expect(nexmo.getApplications).to.have.been.called;
      }));

      it('should parse a page flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationsList({ page: 2 });
        expect(nexmo.getApplications).to.have.been.calledWith({ index: 2 });
      }));

      it('should parse a size flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationsList({ size: 25 });
        expect(nexmo.getApplications).to.have.been.calledWith({ size: 25 });
      }));
    });

    describe('.applicationCreate', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', { type: 'voice' });
        expect(nexmo.createApplication).to.have.been.called;
      }));

      it('should parse a answer_method flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', { type: 'voice', answer_method: 'POST' });
        expect(nexmo.createApplication).to.have.been.calledWith('name', 'voice', 'answer_url', 'event_url', { answer_method : 'POST' });
      }));

      it('should parse a event_method flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', { type: 'voice', event_method: 'POST' });
        expect(nexmo.createApplication).to.have.been.calledWith('name', 'voice', 'answer_url', 'event_url', { event_method : 'POST' });
      }));
    });

    describe('.applicationShow', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationShow('app_id');
        expect(nexmo.getApplication).to.have.been.called;
      }));
    });

    describe('.applicationUpdate', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', { type: 'voice' });
        expect(nexmo.updateApplication).to.have.been.called;
      }));

      it('should parse a answer_method flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', { type: 'voice', answer_method: 'POST' });
        expect(nexmo.updateApplication).to.have.been.calledWith('app_id', 'name', 'voice', 'answer_url', 'event_url', { answer_method : 'POST' });
      }));

      it('should parse a event_method flag', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', { type: 'voice', event_method: 'POST' });
        expect(nexmo.updateApplication).to.have.been.calledWith('app_id', 'name', 'voice', 'answer_url', 'event_url', { event_method : 'POST' });
      }));
    });

    describe('.applicationDelete', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.applicationDelete('123', { confirm: true });
        expect(nexmo.deleteApplication).to.have.been.called;
      }));
    });

    describe('.linkApp', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.linkApp('123', 'abc');
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));
    });

    describe('.unlinkApp', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.unlinkApp('123');
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));
    });

    describe('.linkSms', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.linkSms('123', 'abc');
      }));
    });

    describe('.unlinkSms', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.unlinkSms('123');
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));
    });

    describe('.linkTel', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.linkTel('123', 'abc', {});
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));
    });

    describe('.unlinkTel', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.unlinkTel('123');
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));

      describe('.linkVxml', () => {
        it('should call the SDK', sinon.test(function() {
          nexmo = this.stub(easynexmo);
          client.instance.returns(nexmo);
          request.linkVxml('123', 'abc', {});
          expect(nexmo.numberInsightBasic).to.have.been.called;
        }));
      });

      describe('.unlinkVxml', () => {
        it('should call the SDK', sinon.test(function() {
          nexmo = this.stub(easynexmo);
          client.instance.returns(nexmo);
          request.unlinkVxml('123');
          expect(nexmo.numberInsightBasic).to.have.been.called;
        }));
      });

      describe('.linkSip', () => {
        it('should call the SDK', sinon.test(function() {
          nexmo = this.stub(easynexmo);
          client.instance.returns(nexmo);
          request.linkSip('123', 'abc', {});
          expect(nexmo.numberInsightBasic).to.have.been.called;
        }));
      });

      describe('.unlinkSip', () => {
        it('should call the SDK', sinon.test(function() {
          nexmo = this.stub(easynexmo);
          client.instance.returns(nexmo);
          request.unlinkSip('123');
          expect(nexmo.numberInsightBasic).to.have.been.called;
        }));
      });
    });

    describe('.insightBasic', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.insightBasic('4555555', { confirm: true });
        expect(nexmo.numberInsightBasic).to.have.been.called;
      }));
    });

    describe('.insightStandard', () => {
      it('should call the SDK', sinon.test(function() {
        nexmo = this.stub(easynexmo);
        client.instance.returns(nexmo);
        request.insightStandard('4555555', { confirm: true });
        expect(nexmo.numberInsightStandard).to.have.been.called;
      }));
    });
  });
});
