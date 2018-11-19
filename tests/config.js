import Config  from '../src/config.js';
import Emitter  from '../src/emitter.js';

import { expect } from 'chai';
import sinon      from 'sinon';
import fs         from 'fs';
import os from 'os';

describe('Config', () => {
  let emitter;
  let config;
  let ini_content;
  let credentials;

  beforeEach(() => {
    emitter = sinon.createStubInstance(Emitter);
    config = new Config(emitter);
    ini_content = [
      '[credentials]', 
      'api_key=123', 
      'api_secret=abc',
      ''
    ].join(os.EOL);
    credentials = { credentials: { api_key: '123', api_secret: 'abc'}};
  });

  it('should export a Config object', () => {
    expect(Config).to.not.be.null;
    expect(Config.name).to.equal('Config');
  });

  describe('.read', () => {
    it('should read out the file contents', () => {
      const readFileSync = fs.readFileSync;
      fs.readFileSync = function() {
        return ini_content;
      };
      const data = config.read();
      expect(data).to.eql(credentials);
      fs.readFileSync = readFileSync;
    });
    it('should read from the environment', () => {
      process.env.NEXMO_API_KEY = '123';
      process.env.NEXMO_API_SECRET = 'abc';

      const data = config.read();
      expect(data).to.eql(credentials);
    });
  });

  describe('.write', () => {
    it('should write out the data', () => {
      const writeFileSync = fs.writeFileSync;
      fs.writeFileSync = function(filename, data){
        expect(filename).to.match(/\/\.nexmorc$/);
        expect(data).to.equal(ini_content);
      };
      config.write(credentials);
      fs.writeFileSync = writeFileSync;
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
      const cwd = process.cwd();

      const existsSync = fs.existsSync;
      fs.existsSync = function() {
        return true;
      };
      expect(config.readFilename()).to.have.string(cwd);
      fs.existsSync = existsSync;
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
    it('should write the new data', () => {
      const writeFileSync = fs.writeFileSync;

      fs.writeFileSync = function(filename, data){
        expect(filename).to.match(config.readFilename());
        expect(data).to.equal(ini_content);
      };

      config.putAndSave(credentials, false);
      fs.writeFileSync = writeFileSync;
    });

    it('should merge additional data', () => {
      const initial_content = `[credentials]
api_key=123
api_secret=abc
`;

      const expected_content = `[credentials]
api_key=234
api_secret=abc

[extras]
foobar=1
`;

      const writeFileSync = fs.writeFileSync;
      const readFileSync = fs.readFileSync;

      fs.readFileSync = function() {
        return initial_content;
      };

      fs.writeFileSync = function(filename, data){
        expect(filename).to.match(config.readFilename());
        expect(data).to.equal(expected_content);
      };

      config.putAndSave({
        'credentials': {
          'api_key': 234
        },
        'extras': {
          'foobar': 1
        }
      }, true);

      fs.readFileSync = readFileSync;
      fs.writeFileSync = writeFileSync;
    });
  });
});
