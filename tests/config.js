import Config  from '../source/config.js';
import Emitter  from '../source/emitter.js';

import { expect } from 'chai';
import sinon      from 'sinon';
import mockfs     from 'mock-fs';
import fs         from 'fs';

describe('Config', () => {
  let emitter;
  let config;
  let ini_content;
  let credentials;

  beforeEach(() => {
    emitter = sinon.createStubInstance(Emitter);
    config = new Config(emitter);
    ini_content = `[credentials]
api_key=123
api_secret=abc
`;
    credentials = { credentials: { api_key: '123', api_secret: 'abc'}};
  });

  afterEach(() => {
    mockfs.restore();
  });

  it('should export a Config object', () => {
    expect(Config).to.not.be.null;
    expect(Config.name).to.equal('Config');
  });

  describe('.read', () => {
    it('should read out the file contents', () => {
      mockfs({
        '.nexmorc' : ini_content
      });
      let data = config.read();
      expect(data).to.eql(credentials);
    });
  });

  describe('.write', () => {
    it('should write out the data', () => {
      mockfs();
      config.write(credentials);
      expect(fs.readFileSync(config.readFilename(), 'utf-8')).to.equal(ini_content);
    });
  });

  describe('.readFilename', () => {
    it('should return the home path', () => {
      if (process.env == 'win32') {
        expect(config.readFilename()).to.have.string(process.env['USERPROFILE']);
      } else {
        expect(config.readFilename()).to.have.string(process.env['HOME']);
      }
    });

    it('should return the local path if a .nexmorc file exists locally', () => {
      let cwd = process.cwd();
      let options = {};
      options[`${cwd}/.nexmorc`] = 'empty content';
      mockfs(options);

      expect(config.readFilename()).to.have.string(cwd);
    });
  });

  describe('.writeFilename', () => {
    it('should return the home dir', () => {
      if (process.env == 'win32') {
        expect(config.writeFilename()).to.have.string(process.env['USERPROFILE']);
      } else {
        expect(config.writeFilename()).to.have.string(process.env['HOME']);
      }
    });

    it('should return the local path if specified', () => {
      expect(config.writeFilename(true)).to.have.string(process.cwd());
    });
  });

  describe('.putAndSave', () => {
    it('pending');
  });
});
