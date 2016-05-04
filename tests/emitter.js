import Emitter   from '../source/emitter.js';

import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';

chai.use(sinonChai);

let emitter;

describe('Emitter', () => {
  beforeEach(() => {
    emitter = new Emitter();
  });

  it('should export a Emitter object', () => {
    expect(Emitter).to.not.be.null;
    expect(Emitter.name).to.equal('Emitter');
  });

  describe('.quiet', () => {
    it('should disable debug logs', sinon.test(function() {
      let log = this.stub(console, 'log');
      emitter.quiet();
      emitter.log('foobar');
      expect(log).not.to.have.been.called;
    }));
  });

  describe('.verbose', () => {
    it('should enable verbose logs', sinon.test(function() {
      let log = this.stub(console, 'log');
      emitter.verbose();
      emitter.log('message', 'verbose message');
      expect(log).to.have.been.calledWith('verbose message');
    }));
  });

  describe('.log', () => {
    it('should put debug logs to console.log', sinon.test(function() {
      let log = this.stub(console, 'log');
      emitter.log('foobar');
      expect(log).to.have.been.calledWith('foobar');
    }));
  });

  describe('.warn', () => {
    it('should put warn logs to console.warn', sinon.test(function() {
      let warn = this.stub(console, 'warn');
      emitter.warn('foobar');
      expect(warn).to.have.been.calledWith('foobar');
    }));
  });

  describe('.error', () => {
    it('should put error logs to console.error', sinon.test(function() {
      let error = this.stub(console, 'error');
      let exit = this.stub(process, 'exit');
      emitter.error('foobar');
      expect(error).to.have.been.calledWith('foobar');
      expect(exit).to.have.been.calledWith(1);
    }));
  });

  describe('.table', () => {
    it('should output a table representation of the data');
  });
});
