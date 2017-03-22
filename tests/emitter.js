import Emitter   from '../src/emitter.js';

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

  describe('.debug', () => {
    it('should enable debug logs', sinon.test(function() {
      let log = this.stub(console, 'log');
      emitter.debug();
      emitter.debugger('message');
      expect(log).to.have.been.calledWith('message');
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

  describe('.debugger', () => {
    it('should not output anything in normal mode', sinon.test(function() {
      let log = this.stub(console, 'log');
      emitter.debugger('message');
      expect(log).not.to.have.been.called;
    }));
  });

  describe('.table', () => {
    it('should output a table representation of the data', sinon.test(function() {
      let log = this.stub(console, 'log');
      let data = [{name: 'foo', count: 1}, {name: 'bar', count: 2}];
      let keys = ['name'];
      let verbose_keys = ['name', 'count'];

      emitter.table(data, keys, verbose_keys);
      expect(log).to.have.been.calledTwice;
      expect(log).to.have.been.calledWith('foo');
      expect(log).to.have.been.calledWith('bar');
    }));

    it('should support a verbose table', sinon.test(function() {
      let log = this.stub(console, 'log');
      let data = [{name: 'foo', count: 1}, {name: 'bar', count: 2}];
      let keys = ['name'];
      let verbose_keys = ['name', 'count'];

      emitter.verbose();
      emitter.table(data, keys, verbose_keys);
      expect(log.callCount).to.equal(4);
      expect(log).to.have.been.calledWith('name | count');
      expect(log).to.have.been.calledWith('------------');
      expect(log).to.have.been.calledWith('foo  | 1    ');
      expect(log).to.have.been.calledWith('bar  | 2    ');
    }));
  });

  describe('.list', () => {
    it('should output message in regular mode', sinon.test(function() {
      let log = this.stub(console, 'log');
      let data = {name: 'foo', count: 1};
      let message = 'foobar';

      emitter.list(message, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));

    it('should output a list in verbose mode', sinon.test(function() {
      let log = this.stub(console, 'log');
      let data = {name: 'foo', count: 1};
      let message = 'foobar';

      emitter.verbose();
      emitter.list(message, data);
      expect(log).to.have.been.calledOnce;
      expect(log).not.to.have.been.calledWith(message);
    }));
  });

  describe('.pagination', () => {
    it('should output the current page', sinon.test(function() {
      let log = this.stub(console, 'log');
      let data = { count: 2 };
      let flags = {};
      
      let message = 'Item 1-2 of 2\n';

      emitter.verbose();
      emitter.pagination(flags, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));

    it('should handle different pages', sinon.test(function() {
      let log = this.stub(console, 'log');
      let data = { count: 102 };
      let flags = { page: 2 };
      
      let message = 'Item 101-102 of 102\n';

      emitter.verbose();
      emitter.pagination(flags, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));

    it('should handle different page sizes', sinon.test(function() {
      let log = this.stub(console, 'log');
      let data = { count: 102 };
      let flags = { page: 4, size: 25 };
      
      let message = 'Item 76-100 of 102\n';

      emitter.verbose();
      emitter.pagination(flags, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));
  });
});
