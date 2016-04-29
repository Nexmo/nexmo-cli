import Emitter   from '../source/emitter.js';

import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';

chai.use(sinonChai);

let emitter;
let _console;

describe("Emitter", () => {
  beforeEach(() => {
    emitter = new Emitter();
    _console = { log: function() {}, warn: function() {}, error: function() {} };
    emitter.setOutput(_console);
  });

  it("should export a Emitter object", () => {
    expect(Emitter).to.not.be.null;
    expect(Emitter.name).to.equal("Emitter");
  });

  describe(".silence", () => {
    it("should disable debug logs", () => {
      let stub = sinon.stub(_console, 'log');
      emitter.silence();
      emitter.emit('log', 'foobar');
      emitter.silence(false);

      expect(stub).not.to.be.called;
    });
  });

  describe(".emit", () => {
    it("should put debug logs to console.log", () => {
      let stub = sinon.stub(_console, 'log');
      emitter.emit('log', 'foobar');

      expect(stub).to.be.called;
      expect(stub).to.be.calledWith('foobar');
    });

    it("should put warn logs to console.warn", () => {
      let stub = sinon.stub(_console, 'warn');
      emitter.emit('warn', 'foobar');

      expect(stub).to.be.called;
      expect(stub).to.be.calledWith('foobar');
    });

    it("should put error logs to console.error", () => {
      let stub = sinon.stub(_console, 'error');
      emitter.emit('error', 'foobar');

      expect(stub).to.be.called;
      expect(stub).to.be.calledWith('foobar');
    });

  });
});
