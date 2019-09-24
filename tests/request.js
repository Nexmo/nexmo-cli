import Client from '../src/client.js';
import Config from '../src/config.js';
import Request from '../src/request.js';
import Response from '../src/response.js';
import Emitter from '../src/emitter.js';

import Account from 'nexmo/lib/Account';
import App from 'nexmo/lib/App';
import Message from 'nexmo/lib/Message';
import Number from 'nexmo/lib/Number';
import NumberInsight from 'nexmo/lib/NumberInsight';
import Conversations from 'nexmo/lib/Conversations';
import Users from 'nexmo/lib/Users';
import Members from 'nexmo/lib/Members';

import fs from 'fs';

import chai, {
  expect
} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonTest from 'sinon-test';
const test = sinonTest(sinon);

chai.use(sinonChai);

describe('Request', () => {
  it('should export a Request object', () => {
    expect(Request).to.not.be.null;
    expect(Request.name).to.equal('Request');
  });

  describe('with an instance', () => {
    let client;
    let appConfig;
    let config;
    let nexmo;
    let request;
    let response;
    let emitter;

    beforeEach(() => {
      client = sinon.createStubInstance(Client);
      config = sinon.createStubInstance(Config);
      appConfig = sinon.createStubInstance(Config);
      response = sinon.createStubInstance(Response);
      request = new Request(config, appConfig, client, response, emitter);
      emitter = sinon.createStubInstance(Emitter);
    });

    describe('.accountSetup', () => {
      it('should verifiy the credentials', test(function() {
        nexmo = {};
        nexmo.account = sinon.createStubInstance(Account);
        client.instanceWith.returns(nexmo);
        response.accountSetup.returns(() => {});
        request.accountSetup('123', 'abc', false);
        expect(nexmo.account.checkBalance).to.have.been.called;
        expect(response.accountSetup).to.have.been.called;
      }));
    });

    describe('.accountSetup', () => {
      it('should verifiy the credentials', test(function() {
        nexmo = {};
        nexmo.account = sinon.createStubInstance(Account);
        client.instanceWith.returns(nexmo);
        response.accountSetup.returns(() => {});
        request.accountSetup('123', 'abc', false);
        expect(nexmo.account.checkBalance).to.have.been.called;
        expect(response.accountSetup).to.have.been.called;
      }));
    });

    describe('.accountInfo', () => {
      it('should read the credentials', test(function() {
        nexmo = {
          credentials: 'credentials'
        };
        client.instance.returns(nexmo);
        request.accountInfo();
        expect(response.accountInfo).to.have.been.calledWith({
          credentials: 'credentials'
        });
      }));
    });

    describe('.accountBalance', () => {
      it('should call nexmo.account.checkBalance', test(function() {
        nexmo = {};
        nexmo.account = sinon.createStubInstance(Account);
        client.instance.returns(nexmo);
        request.accountBalance();
        expect(nexmo.account.checkBalance).to.have.been.called;
      }));
    });

    describe('.priceVoice', () => {
      it('should call nexmo.number.getPhonePricing', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        request.priceVoice();
        expect(nexmo.number.getPhonePricing).to.have.been.called;
      }));

      it('should accept a + in the number', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        request.priceVoice('+123123123123');
        expect(nexmo.number.getPhonePricing).to.have.been.calledWith('voice', '123123123123');
      }));
    });

    describe('.priceSms', () => {
      it('should call nexmo.number.getPhonePricing', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        request.priceSms();
        expect(nexmo.number.getPhonePricing).to.have.been.called;
      }));
    });

    describe('.priceCountry', () => {
      it('should call nexmo.number.getPricing', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        request.priceCountry();
        expect(nexmo.number.getPricing).to.have.been.called;
      }));
    });

    describe('.numbersList', () => {
      it('should call nexmo.number.get', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numbersList.returns(() => {});
        request.numbersList({});
        expect(nexmo.number.get).to.have.been.called;
        expect(nexmo.number.get).to.have.been.calledWith({
          size: 100
        });
      }));

      it('should parse a page flag', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numbersList.returns(() => {});
        request.numbersList({
          page: 2
        });
        expect(nexmo.number.get).to.have.been.calledWith({
          index: 2,
          size: 100
        });
      }));

      it('should parse a size flag', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numbersList.returns(() => {});
        request.numbersList({
          size: 25
        });
        expect(nexmo.number.get).to.have.been.calledWith({
          size: 25
        });
      }));

      it('should handle search with a default search_pattern of 1', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numbersList.returns(() => {});

        const pattern = '123';
        request.numbersList({
          pattern: pattern
        });
        expect(nexmo.number.get).to.have.been.calledWith({
          pattern: pattern,
          search_pattern: 1,
          size: 100
        });
      }));

      it('should handle search with a search_pattern of 2 when * is the first pattern char', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numbersList.returns(() => {});

        const pattern = '*123';
        request.numbersList({
          pattern: pattern
        });
        expect(nexmo.number.get).to.have.been.calledWith({
          pattern: pattern,
          search_pattern: 2,
          size: 100
        });
      }));

      it('should handle search with a search_pattern of 0 when * is the last pattern char', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numbersList.returns(() => {});

        const pattern = '123*';
        request.numbersList({
          pattern: pattern
        });
        expect(nexmo.number.get).to.have.been.calledWith({
          pattern: pattern,
          search_pattern: 0,
          size: 100
        });
      }));
    });

    describe('.numberSearch', () => {
      it('should call nexmo.number.search', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {});
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: [],
          size: 100
        });
      }));

      it('should parse a voice flag', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {
          voice: true
        });
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: ['VOICE'],
          size: 100
        });
      }));

      it('should parse a sms flag', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {
          sms: true
        });
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: ['SMS'],
          size: 100
        });
      }));

      it('should parse both the sms and voice flag', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {
          sms: true,
          voice: true
        });
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: ['VOICE', 'SMS'],
          size: 100
        });
      }));

      it('should parse a page flag', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {
          page: 2
        });
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: [],
          index: 2,
          size: 100
        });
      }));

      it('should parse a size flag', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {
          size: 25
        });
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: [],
          size: 25
        });
      }));

      it('should pass the pattern flag without a wildcard', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {
          pattern: '020'
        });
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: [],
          pattern: '020',
          search_pattern: 1,
          size: 100
        });
      }));

      it('should pass the pattern flag with a start-of wildcard', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.numberSearch.returns(() => {});
        request.numberSearch('GB', {
          pattern: '*020'
        });
        expect(nexmo.number.search).to.have.been.calledWith('GB', {
          features: [],
          pattern: '*020',
          search_pattern: 2,
          size: 100
        });
      }));
    });

    describe('.numberBuy', () => {
      it('should call the library', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.numberBuy('123', {
          confirm: true
        });
        expect(nexmo.numberInsight.get).to.have.been.calledWith({
          level: 'basic',
          number: '123'
        });
      }));

      it('should handle search with a default search_pattern of 1', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);

        const country_code = 'GB';
        const pattern = '123';
        request.numberBuy(pattern, {
          country_code: country_code
        });
        expect(nexmo.number.search).to.have.been.calledWith(
          country_code, {
            features: ['VOICE'],
            pattern: pattern,
            search_pattern: 1
          }
        );
      }));

      it('should handle search with a search_pattern of 2 when * is the first pattern char', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);

        const country_code = 'GB';
        const pattern = '*123';
        request.numberBuy(pattern, {
          country_code: country_code
        });
        expect(nexmo.number.search).to.have.been.calledWith(
          country_code, {
            features: ['VOICE'],
            pattern: pattern,
            search_pattern: 2
          }
        );
      }));

      it('should handle search with a search_pattern of 0 when * is the last pattern char', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);

        const country_code = 'GB';
        const pattern = '123*';
        request.numberBuy(pattern, {
          country_code: country_code
        });
        expect(nexmo.number.search).to.have.been.calledWith(
          country_code, {
            features: ['VOICE'],
            pattern: pattern,
            search_pattern: 0
          }
        );
      }));

      it('should buy the first number only country_code flag is set', () => {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);

        const country_code = 'GB';
        request.numberBuy(null, {
          country_code: country_code
        });

        expect(nexmo.number.search).to.have.been.calledWith(
          country_code, {
            features: ['VOICE']
          }
        );
      });
    });

    describe('.numberCancel', () => {
      it('should call nexmo.numberInsight.get', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.numberCancel('123', {
          confirm: true
        });
        expect(nexmo.numberInsight.get).to.have.been.called;
      }));

      it('should call nexmo.number.cancel if the country code was forced', test(function() {
        nexmo = {};
        nexmo.number = sinon.createStubInstance(Number);
        nexmo.response = sinon.createStubInstance(Response);
        client.instance.returns(nexmo);
        response.numberCancel.returns(() => {});
        request.numberCancel('123', {
          country_code: 'GB',
          confirm: true
        });
        expect(nexmo.number.cancel).to.have.been.called;
      }));
    });

    describe('.applicationsList', () => {
      it('should call nexmo.applications.get', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        response.applicationsList.returns(() => {});
        request.applicationsList({});
        expect(nexmo.applications.get).to.have.been.calledWith({
          page_size: 100
        });
      }));

      it('should parse a page flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        response.applicationsList.returns(() => {});
        request.applicationsList({
          page: 2
        });
        expect(nexmo.applications.get).to.have.been.calledWith({
          index: 2,
          page_size: 100
        });
      }));

      it('should parse a size flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        response.applicationsList.returns(() => {});
        request.applicationsList({
          size: 25
        });
        expect(nexmo.applications.get).to.have.been.calledWith({
          page_size: 25
        });
      }));
    });

    describe('.applicationCreate', () => {
      it('should call nexmo.applications.create with a voice type', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', {
          type: 'voice'
        });
        expect(nexmo.applications.create).to.have.been.calledWith('name', 'voice', 'answer_url', 'event_url', {});
      }));

      it('should call nexmo.applications.create with a messages type', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', {
          type: 'messages'
        });
        expect(nexmo.applications.create).to.have.been.calledWith('name', 'messages', 'answer_url', 'event_url', { inbound_url: "answer_url", status_url: "event_url" });
      }));

      it('should call nexmo.applications.create with a rtc type', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', {
          type: 'artc'
        });
        expect(nexmo.applications.create).to.have.been.calledWith('name', 'rtc', 'answer_url', 'event_url', {});
      }));

      it('should parse a answer_method flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', {
          type: 'voice',
          answer_method: 'POST'
        });
        expect(nexmo.applications.create).to.have.been.calledWith('name', 'voice', 'answer_url', 'event_url', {
          answer_method: 'POST'
        });
      }));

      it('should parse a event_method flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', {
          type: 'voice',
          event_method: 'POST'
        });
        expect(nexmo.applications.create).to.have.been.calledWith('name', 'voice', 'answer_url', 'event_url', {
          event_method: 'POST'
        });
      }));

      it('should parse a capabilities flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationCreate('name', 'answer_url', 'event_url', {
          capabilities: 'vbc'
        });
        expect(nexmo.applications.create).to.have.been.calledWith({
          capabilities: {
            vbc: {}
          },
          name: 'name'
        });
      }));
    });

    describe('.applicationShow', () => {
      it('should call the library', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        response.applicationShow.returns(() => {});
        request.applicationShow('app_id', {
          v2: false
        });
        expect(nexmo.applications.get).to.have.been.called;
      }));
    });

    describe('.applicationSetup', () => {
      it('should verifiy the credentials', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instanceWithApp.returns(nexmo);
        response.applicationSetup.returns(() => {});
        request.applicationSetup('123', 'abc', false);
        expect(nexmo.applications.get).to.have.been.called;
        expect(response.applicationSetup).to.have.been.called;
      }));
    });

    describe('.applicationUpdate', () => {
      it('should call the library with the correct parameters for a voice application', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', {
          type: 'voice'
        });
        expect(nexmo.applications.update).to.have.been.calledWith('app_id', 'name', 'voice', 'answer_url', 'event_url', {});
      }));

      it('should call the library with the correct parameters for a messages application', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', {
          type: 'messages'
        });
        expect(nexmo.applications.update).to.have.been.calledWith('app_id', 'name', 'messages', 'answer_url', 'event_url', { inbound_url: "answer_url", status_url: "event_url" });
      }));

      it('should call the library with the correct parameters for a rtc application', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', {
          type: 'artc'
        });
        expect(nexmo.applications.update).to.have.been.calledWith('app_id', 'name', 'rtc', 'answer_url', 'event_url', {});
      }));

      it('should parse a answer_method flag', test(function() {
        nexmo = {};
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', {
          type: 'voice',
          answer_method: 'POST'
        });
        expect(nexmo.applications.update).to.have.been.calledWith('app_id', 'name', 'voice', 'answer_url', 'event_url', {
          answer_method: 'POST'
        });
      }));

      it('should parse a event_method flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', {
          type: 'voice',
          event_method: 'POST'
        });
        expect(nexmo.applications.update).to.have.been.calledWith('app_id', 'name', 'voice', 'answer_url', 'event_url', {
          event_method: 'POST'
        });
      }));

      it('should parse a capabilities flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationUpdate('app_id', 'name', 'answer_url', 'event_url', {
          capabilities: 'vbc'
        });
        expect(nexmo.applications.update).to.have.been.calledWith('app_id', {
          capabilities: {
            vbc: {}
          },
          name: 'name'
        });
      }));
    });

    describe('.applicationDelete', () => {
      it('should call the library', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        client.instance.returns(nexmo);
        request.applicationDelete('123', {
          confirm: true
        });
        expect(nexmo.applications.delete).to.have.been.called;
      }));
    });

    describe('._createApplicationPayload', () => {
      it('should emit error for unknown capability', test(function() {
        request._createApplicationPayload('name', {
          capabilities: "no"
        });
        expect(request.emitter.error).to.have.been.calledWith("Unsupported capability: no");
      }));

      it('should emit error for --keyfile and --public-keyfile at the same time', test(function() {
        request._createApplicationPayload('name', {
          capabilities: "voice",
          keyfile: "yes",
          publicKeyfile: __dirname + "/fixtures/public.key.pub"
        });
        expect(request.emitter.error).to.have.been.calledWith("You can't use --keyfile and --public-keyfile at the same time.");
      }));

      it('should emit error for missing --voice-answer-url when one of the capabilities is voice', test(function() {
        request._createApplicationPayload('name', {
          capabilities: "voice"
        });
        expect(request.emitter.error).to.have.been.calledWith("--voice-answer-url is a required flag.");
      }));

      it('should emit error for missing --voice-event-url when one of the capabilities is voice', test(function() {
        request._createApplicationPayload('name', {
          capabilities: "voice"
        });
        expect(request.emitter.error).to.have.been.calledWith("--voice-event-url is a required flag.");
      }));

      it('should emit error for missing --messages-inbound-url when one of the capabilities is messages', test(function() {
        request._createApplicationPayload('name', {
          capabilities: "messages"
        });
        expect(request.emitter.error).to.have.been.calledWith("--messages-inbound-url is a required flag.");
      }));

      it('should emit error for missing --messages-status-url when one of the capabilities is messages', test(function() {
        request._createApplicationPayload('name', {
          capabilities: "messages"
        });
        expect(request.emitter.error).to.have.been.calledWith("--messages-status-url is a required flag.");
      }));

      it('should emit error for missing --rtc-event-url when one of the capabilities is rtc', test(function() {
        request._createApplicationPayload('name', {
          capabilities: "rtc"
        });
        expect(request.emitter.error).to.have.been.calledWith("--rtc-event-url is a required flag.");
      }));

      it('should generate payload with public key', test(function() {
        const payload = request._createApplicationPayload('name', {
          capabilities: "vbc",
          publicKeyfile: __dirname + "/fixtures/public.key.pub"
        });
        expect(payload.keys.public_key).to.not.equal(undefined);
      }));

      it('should generate payload with default http methods', test(function() {
        const payload = request._createApplicationPayload('name', {
          capabilities: "voice,messages,rtc,vbc",
          voiceAnswerUrl: "example.com",
          voiceFallbackAnswerUrl: "example.com",
          voiceEventUrl: "example.com",
          messagesInboundUrl: "example.com",
          messagesStatusUrl: "example.com",
          rtcEventUrl: "example.com",
        });
        expect(fs.readFileSync(__dirname + "/fixtures/app-default-methods.json").toString()).to.include(JSON.stringify(payload));
      }));

      it('should generate payload with http methods', test(function() {
        const payload = request._createApplicationPayload('name', {
          capabilities: "voice,messages,rtc,vbc",
          voiceAnswerUrl: "example.com",
          voiceFallbackAnswerUrl: "example.com",
          voiceEventUrl: "example.com",
          messagesInboundUrl: "example.com",
          messagesStatusUrl: "example.com",
          rtcEventUrl: "example.com",
          voiceAnswerMethod: "PUT",
          voiceFallbackAnswerMethod: "PUT",
          voiceEventMethod: "PUT",
          rtcEventMethod: "PUT",
        });
        expect(fs.readFileSync(__dirname + "/fixtures/app-custom-methods.json").toString()).to.include(JSON.stringify(payload));
      }));
    });

    describe('.applicationNumbers', () => {
      it('should call nexmo.applications.get', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.applicationsList.returns(() => {});
        response.searchByPartialAppId.returns(() => {});
        response.applicationNumbers.returns(() => {});
        request.applicationNumbers('app_id', {});
        expect(nexmo.applications.get).to.have.been.calledWith({});
      }));

      it('should call nexmo.number.get', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.searchByPartialAppId.returns(() => {});
        response.applicationNumbers.returns(() => {});
        request.applicationNumbers('app_id', {});
        expect(nexmo.number.get).to.have.been.called;
      }));

      it('should parse a page flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.searchByPartialAppId.returns(() => {});
        response.applicationNumbers.returns(() => {});
        request.applicationNumbers('app_id', {
          page: 2
        });
        expect(nexmo.number.get).to.have.been.calledWith({
          index: 2
        });
      }));

      it('should parse a size flag', test(function() {
        nexmo = {};
        nexmo.applications = sinon.createStubInstance(App);
        nexmo.number = sinon.createStubInstance(Number);
        client.instance.returns(nexmo);
        response.searchByPartialAppId.returns(() => {});
        response.applicationNumbers.returns(() => {});
        request.applicationNumbers('app_id', {
          size: 25
        });
        expect(nexmo.number.get).to.have.been.calledWith({
          size: 25
        });
      }));
    });

    describe('.linkApp', () => {
      it('should call the nexmo.number.get({level:"basic"})', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.linkApp('123', 'abc');
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'basic'
        });
      }));
    });

    describe('.unlinkApp', () => {
      it('should call nexmo.numberInsight.get', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.unlinkApp('123');
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'basic'
        });
      }));
    });

    describe('.linkSms', () => {
      it('should call the library', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.linkSms('123', 'abc');
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'basic'
        });
      }));
    });

    describe('.unlinkSms', () => {
      it('should call nexmo.numberInsight.get', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.unlinkSms('123');
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'basic'
        });
      }));
    });

    describe('.linkTel', () => {
      it('should call nexmo.numberInsight.get', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.linkTel('123', 'abc', {});
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'basic'
        });
      }));
    });

    describe('.unlinkTel', () => {
      it('should call nexmo.numberInsight.get', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.unlinkTel('123');
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'basic'
        });
      }));

      describe('.linkSip', () => {
        it('should call nexmo.numberInsight.get', test(function() {
          nexmo = {};
          nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
          client.instance.returns(nexmo);
          request.linkSip('123', 'abc', {});
          expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
            level: 'basic'
          });
        }));
      });

      describe('.unlinkSip', () => {
        it('should call nexmo.numberInsight.get', test(function() {
          nexmo = {};
          nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
          client.instance.returns(nexmo);
          request.unlinkSip('123');
          expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
            level: 'basic'
          });
        }));
      });
    });

    describe('.insightBasic', () => {
      it('should call nexmo.numberInsight.get', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.insightBasic('4555555', {
          confirm: true
        });
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'basic'
        });
      }));
    });

    describe('.insightStandard', () => {
      it('should call nexmo.numberInsight.get', test(function() {
        nexmo = {};
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.insightStandard('4555555', {
          confirm: true
        });
        expect(nexmo.numberInsight.get).to.have.been.calledWithMatch({
          level: 'standard'
        });
      }));
    });

    describe('.sendSms', () => {
      it('should call nexmo.message.sendSms', test(function() {
        nexmo = {};
        nexmo.message = sinon.createStubInstance(Message);
        client.instance.returns(nexmo);
        request.sendSms('to', ['Hello', 'World'], {
          'from': 'from',
          'confirm': true
        });
        expect(nexmo.message.sendSms).to.have.been.calledWith('from', 'to', 'Hello World');
      }));
    });

    describe('.generateJwt', () => {
      it('should call Nexmo.generateJwt', test(function() {
        var Nexmo = {
          generateJwt: sinon.spy()
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', [], {});
        expect(Nexmo.generateJwt).to.have.been.calledWith('path/to/private.key');
      }));

      it('should deal with Nexmo.generateJwt with null claims', test(function() {
        var Nexmo = {
          generateJwt: sinon.spy()
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', [], {
          app_id: 'application_id'
        });
        expect(Nexmo.generateJwt).to.have.been.calledWith('path/to/private.key', {
          application_id: 'application_id'
        });
      }));

      it('should call Nexmo.generateJwt with additional claims', test(function() {
        var Nexmo = {
          generateJwt: sinon.spy()
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', ['subject=leggetter', 'jti=1475861732'], {
          app_id: 'application_id'
        });
        expect(Nexmo.generateJwt).to.have.been.calledWith('path/to/private.key', {
          application_id: 'application_id',
          subject: 'leggetter',
          jti: '1475861732'
        });
      }));

      it('should call Nexmo.generateJwt with the JSON acl claim if a valid JSON is passed', test(function() {
        var Nexmo = {
          generateJwt: sinon.spy()
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', ['acl={"paths": { "/**": {  } } }'], {
          app_id: 'application_id'
        });
        expect(Nexmo.generateJwt).to.have.been.calledWith('path/to/private.key', {
          acl: {
            paths: {
              '/**': {}
            }
          },
          application_id: 'application_id'
        });
      }));

      it('should call Nexmo.generateJwt with the original acl claim if invalid JSON is passed', test(function() {
        var Nexmo = {
          generateJwt: sinon.spy()
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', ['acl=notAnObject'], {
          app_id: 'application_id'
        });
        expect(Nexmo.generateJwt).to.have.been.calledWith('path/to/private.key', {
          acl: 'notAnObject',
          application_id: 'application_id'
        });
      }));

      it('should call pass generated token to response.generateJwt', test(function() {
        var Nexmo = {
          generateJwt: () => {
            return 'a token!';
          }
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', ['subject=leggetter', 'jti=1475861732'], {
          app_id: 'application_id'
        });
        expect(response.generateJwt).to.have.been.calledWith(null, 'a token!');
      }));

      it('should call response with an exception when singular values are provided for claims', test(function() {
        var Nexmo = {
          generateJwt: sinon.spy()
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', 'application_id', ['subject']);
        expect(response.generateJwt).to.have.been.calledWith(sinon.match.instanceOf(Error), null);
      }));

      it('should call response with an exception when more than one = is supplied', test(function() {
        var Nexmo = {
          generateJwt: sinon.spy()
        };
        client.definition.returns(Nexmo);

        request.generateJwt('path/to/private.key', 'application_id', ['subject=fish=monkey']);
        expect(response.generateJwt).to.have.been.calledWith(sinon.match.instanceOf(Error), null);
      }));

    });

    describe('.getCountryCode', () => {
      it('should return the country code if provided', test(function() {
        const callback = sinon.spy();
        request.getCountryCode('44555666777', {
          country_code: 'GB'
        }, callback);
        expect(callback).to.have.been.calledWith('GB');
      }));

      it('should call number insight if no country code was provided', test(function() {
        nexmo = {};
        const callback = sinon.spy();
        nexmo.numberInsight = sinon.createStubInstance(NumberInsight);
        client.instance.returns(nexmo);
        request.getCountryCode('44555666777', {}, callback);
        expect(nexmo.numberInsight.get).to.have.been.calledWith({
          level: 'basic',
          number: '44555666777'
        });
      }));
    });

    describe('.conversationCreate', () => {
      it('should call conversations.create', test(function() {
        nexmo = {};
        nexmo.conversations = sinon.createStubInstance(Conversations);
        client.instanceWithApp.returns(nexmo);
        request.conversationCreate([]);
        expect(nexmo.conversations.create).to.have.been.called;
      }));
    });

    describe('.userCreate', () => {
      it('should call users.create', test(function() {
        nexmo = {};
        nexmo.users = sinon.createStubInstance(Users);
        client.instanceWithApp.returns(nexmo);
        request.userCreate([]);
        expect(nexmo.users.create).to.have.been.called;
      }));
    });

    describe('.memberAdd', () => {
      it('should call conversations.members.add', test(function() {
        nexmo = {};
        nexmo.conversations = sinon.createStubInstance(Conversations);
        nexmo.conversations.members = sinon.createStubInstance(Members);
        client.instanceWithApp.returns(nexmo);
        request.memberAdd('def', []);
        expect(nexmo.conversations.members.add).to.have.been.called;
      }));
    });

    describe('.memberList', () => {
      it('should call conversations.members.get', test(function() {
        nexmo = {};
        nexmo.conversations = sinon.createStubInstance(Conversations);
        nexmo.conversations.members = sinon.createStubInstance(Members);
        client.instanceWithApp.returns(nexmo);
        request.memberList('def', []);
        expect(nexmo.conversations.members.get).to.have.been.calledWith('def', {});
      }));
    });
  });
});
