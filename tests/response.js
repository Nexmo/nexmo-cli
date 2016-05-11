import Response  from '../source/response.js';
import Validator from '../source/validator.js';
import Emitter   from '../source/emitter.js';

import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';

chai.use(sinonChai);


describe('Response', () => {
  let validator;
  let emitter;
  let response;

  beforeEach(() => {
    validator = sinon.createStubInstance(Validator);
    emitter = sinon.createStubInstance(Emitter);
    response = new Response(validator, emitter);
  });

  it('should export a Response object', () => {
    expect(Response).to.not.be.null;
    expect(Response.name).to.equal('Response');
  });

  describe('.accountBalance', () => {
    it('should validate the response and emit the result', sinon.test(function() {
      response.accountBalance(null, { value: 123 });
      expect(validator.response).to.have.been.calledWith(null, { value: 123});
      expect(emitter.log).to.have.been.calledWith('123 EUR');
    }));
  });

  describe('.numbersList', () => {
    it('should print a list of numbers', () => {
      let data = {'count':1,'numbers':[{'country':'ES','msisdn':'34911067000','type':'landline','features':['SMS']}]};
      response.numbersList(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.table).to.have.been.calledWith([{ country: 'ES', features: ['SMS'], msisdn: '34911067000', type: 'landline' }], ['msisdn'], ['msisdn', 'country', 'type', 'features', 'voiceCallbackType', 'voiceCallbackValue']);
    });

    it('should warn if no numbers found', () => {
      response.numbersList(null, { numbers: []});
      expect(emitter.warn).to.have.been.called;
    });
  });

  describe('.numberSearch', () => {
    it('should print a list of numbers', () => {
      let data = {'count':1,'numbers':[{'country':'ES','msisdn':'34911067000','type':'landline','features':['SMS']}]};
      response.numberSearch(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.table).to.have.been.calledWith([{ country: 'ES', features: ['SMS'], msisdn: '34911067000', type: 'landline' }], ['msisdn'], ['msisdn', 'country', 'cost', 'type', 'features']);
    });

    it('should warn if no numbers found', () => {
      response.numberSearch(null, { numbers: []});
      expect(emitter.warn).to.have.been.called;
    });
  });

  describe('.numberBuyFromNumber', () => {
    it('should print the response', () => {
      let data = 'response';
      response.numberBuyFromNumber(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.log).to.have.been.calledWith('Number purchased');
    });
  });

  describe('.numberBuyFromPattern', () => {
    it('should call the callback', (done) => {
      let method = response.numberBuyFromPattern(() => {
        done();
      });

      expect(method).to.be.a('function');
      method(null, { numbers: [{msisdn: '123'}]});
    });
  });

  describe('.numberCancel', () => {
    it('should print the response', () => {
      let data = 'response';
      response.numberCancel(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.log).to.have.been.calledWith('Number cancelled');
    });
  });

  describe('.numberInsight', () => {
    it('should call the callback', (done) => {
      let method = response.numberInsight(() => {
        done();
      });

      expect(method).to.be.a('function');
      method(null, {});
    });
  });

  describe('.applicationsList', () => {
    it('should print a list of application', () => {
      let data = {'_embedded':{'applications':[{'id':123}]}};
      response.applicationsList(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.table).to.have.been.calledWith([{'id':123}], ['id', 'name'], ['id', 'name']);
    });

    it('should warn if no applications found', () => {
      response.applicationsList(null, {'_embedded':{'applications':[]}});
      expect(emitter.warn).to.have.been.called;
    });
  });

  describe('.applicationCreate', () => {
    it('should print the response', () => {
      let data = { id: 123 };
      response.applicationCreate(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.list).to.have.been.calledWith('Application created: 123', data);
    });
  });

  describe('.applicationShow', () => {
    it('should print the response', () => {
      let data = { id: 123 };
      response.applicationShow(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.list).to.have.been.calledWith(null, data);
    });
  });

  describe('.applicationUpdate', () => {
    it('should print the response', () => {
      let data = { id: 123 };
      response.applicationUpdate(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.list).to.have.been.calledWith('Application updated: 123', data);
    });
  });

  describe('.applicationDelete', () => {
    it('should print the response', () => {
      let data = { id: 123 };
      response.applicationDelete(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.log).to.have.been.calledWith('Application deleted');
    });
  });

  describe('.linkCreate', () => {
    it('should print the response', () => {
      let data = 'response';
      response.linkCreate(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.log).to.have.been.calledWith('Number linked');
    });
  });

  describe('.linkDelete', () => {
    it('should print the response', () => {
      let data = 'response';
      response.linkDelete(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.log).to.have.been.calledWith('Number unlinked');
    });
  });
});
