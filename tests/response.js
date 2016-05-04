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
      expect(emitter.log).to.have.been.calledWith(123);
    }));
  });

  describe('.numbersList', () => {
    it('should print a list of numbers', () => {
      let data = {'count':1,'numbers':[{'country':'ES','msisdn':'34911067000','type':'landline','features':['SMS']}]};
      response.numbersList(null, data);
      expect(validator.response).to.have.been.calledWith(null, data);
      expect(emitter.table).to.have.been.calledWith([{ country: 'ES', features: ['SMS'], msisdn: '34911067000', type: 'landline' }], ['msisdn'], ['msisdn', 'country', 'type', 'features']);
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
});
