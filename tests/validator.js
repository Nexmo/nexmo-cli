import Validator from '../source/validator.js';
import Emitter   from '../source/emitter.js';

import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';

chai.use(sinonChai);

describe('Validator', () => {
  it('should export a response validator function object', () => {
    expect(Validator).to.not.be.null;
    expect(Validator.name).to.equal('Validator');
  });

  describe('.response', () => {
    describe('when no errors are present', () => {
      it('should fall through quietely', () => {
        let validator = new Validator();
        expect(validator.response(null, {})).to.be.undefined;
      });
    });

    describe('when errors are present', () => {
      describe('due to error objects', () => {
        it('should emit an error', sinon.test(function() {
          let emitter = new Emitter();
          let validator = new Validator();
          validator.emitter = emitter;

          let stub = this.stub(emitter, 'error');

          validator.response({ message: 'error'}, {});

          expect(stub).to.be.called;
          expect(stub).to.be.calledWith('error');
        }));
      });

      describe('due to error codes in response objects', () => {
        it('should emit an error', sinon.test(function() {
          let emitter = new Emitter();
          let validator = new Validator(emitter);

          let stub = this.stub(emitter, 'error');

          validator.response(null, {'error-code' : '500', 'error-code-label' : 'foobar'});

          expect(stub).to.be.called;
          expect(stub).to.be.calledWith('foobar');
        }));

        it('should ignore a 200 status', sinon.test(function() {
          let emitter = new Emitter();
          let validator = new Validator(emitter);

          let stub = this.stub(emitter, 'error');

          validator.response(null, {'error-code' : '200'});

          expect(stub).not.to.be.called;
        }));
      });
    });
  });
});
