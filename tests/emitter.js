import Emitter   from '../src/emitter.js';

import chai, { expect } from 'chai';
import sinon            from 'sinon';
import sinonChai        from 'sinon-chai';
import sinonTest        from 'sinon-test';
const test = sinonTest(sinon);

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
    it('should disable debug logs', test(function() {
      const log = this.stub(console, 'log');
      emitter.quiet();
      emitter.log('foobar');
      expect(log).not.to.have.been.called;
    }));
  });

  describe('.verbose', () => {
    it('should enable verbose logs', test(function() {
      const log = this.stub(console, 'log');
      emitter.verbose();
      emitter.log('message', 'verbose message');
      expect(log).to.have.been.calledWith('verbose message');
    }));
  });

  describe('.debug', () => {
    it('should enable debug logs', test(function() {
      const log = this.stub(console, 'log');
      emitter.debug();
      emitter.debugger('message');
      expect(log).to.have.been.calledWith('message');
    }));
  });

  describe('.log', () => {
    it('should put debug logs to console.log', test(function() {
      const log = this.stub(console, 'log');
      emitter.log('foobar');
      expect(log).to.have.been.calledWith('foobar');
    }));
  });

  describe('.warn', () => {
    it('should put warn logs to console.warn', test(function() {
      const warn = this.stub(console, 'warn');
      emitter.warn('foobar');
      expect(warn).to.have.been.calledWith('foobar');
    }));
  });

  describe('.error', () => {
    it('should put error logs to console.error', test(function() {
      const error = this.stub(console, 'error');
      const exit = this.stub(process, 'exit');
      emitter.error('foobar');
      expect(error).to.have.been.calledWith('foobar');
      expect(exit).to.have.been.calledWith(1);
    }));
  });

  describe('.debugger', () => {
    it('should not output anything in normal mode', test(function() {
      const log = this.stub(console, 'log');
      emitter.debugger('message');
      expect(log).not.to.have.been.called;
    }));
  });

  describe('.table', () => {
    it('should output a table representation of the data', test(function() {
      const log = this.stub(console, 'log');
      const data = [{name: 'foo', count: 1}, {name: 'bar', count: 2}];
      const keys = ['name'];
      const verbose_keys = ['name', 'count'];

      emitter.table(data, keys, verbose_keys);
      expect(log).to.have.been.calledTwice;
      expect(log).to.have.been.calledWith('foo');
      expect(log).to.have.been.calledWith('bar');
    }));

    it('should support a verbose table', test(function() {
      const log = this.stub(console, 'log');
      const data = [{name: 'foo', count: 1}, {name: 'bar', count: 2}];
      const keys = ['name'];
      const verbose_keys = ['name', 'count'];

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
    it('should output message in regular mode', test(function() {
      const log = this.stub(console, 'log');
      const data = {name: 'foo', count: 1};
      const message = 'foobar';

      emitter.list(message, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));

    it('should output a list in verbose mode', test(function() {
      const log = this.stub(console, 'log');
      const data = {name: 'foo', count: 1};
      const message = 'foobar';

      emitter.verbose();
      emitter.list(message, data);
      expect(log).to.have.been.calledOnce;
      expect(log).not.to.have.been.calledWith(message);
    }));
  });

  describe('.pagination', () => {
    it('should output the current page', test(function() {
      const log = this.stub(console, 'log');
      const data = { count: 2 };
      const flags = {};
      
      const message = 'Item 1-2 of 2\n';

      emitter.verbose();
      emitter.pagination(flags, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));

    it('should handle different pages', test(function() {
      const log = this.stub(console, 'log');
      const data = { count: 102 };
      const flags = { page: 2 };
      
      const message = 'Item 101-102 of 102\n';

      emitter.verbose();
      emitter.pagination(flags, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));

    it('should handle different page sizes', test(function() {
      const log = this.stub(console, 'log');
      const data = { count: 102 };
      const flags = { page: 4, size: 25 };
      
      const message = 'Item 76-100 of 102\n';

      emitter.verbose();
      emitter.pagination(flags, data);
      expect(log).to.have.been.calledOnce;
      expect(log).to.have.been.calledWith(message);
    }));
  });
});
