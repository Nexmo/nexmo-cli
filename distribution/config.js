'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ini = require('ini');

var _ini2 = _interopRequireDefault(_ini);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
  function Config(emitter) {
    _classCallCheck(this, Config);

    this.emitter = emitter;
  }

  _createClass(Config, [{
    key: 'read',
    value: function read() {
      return _ini2.default.parse(_fs2.default.readFileSync(this.readFilename(), 'utf-8'));
    }
  }, {
    key: 'write',
    value: function write(data) {
      var local = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      _fs2.default.writeFileSync(this.writeFilename(local), _ini2.default.stringify(data));
    }
  }, {
    key: 'readFilename',
    value: function readFilename() {
      var filename = localFile();
      if (_fs2.default.existsSync(filename)) {
        return filename;
      } else {
        return homeFile();
      }
    }
  }, {
    key: 'writeFilename',
    value: function writeFilename() {
      var local = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (local) {
        return localFile();
      } else {
        return homeFile();
      }
    }
  }, {
    key: 'putAndSave',
    value: function putAndSave(values) {
      var writeLocal = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var data = {};

      try {
        data = this.read();
      } catch (e) {
        this.emitter.warn('No existing config found. Writing to new file.');
      }

      for (var group in values) {
        var group_vals = values[group];
        for (var key in group_vals) {
          if (data[group] == undefined) {
            data[group] = {};
          }
          data[group][key] = group_vals[key];
        }
      }

      try {
        this.write(data, writeLocal);
        this.emitter.log('Credentials written to ' + this.writeFilename(writeLocal));
      } catch (e) {
        this.emitter.error('Could not write credentials to ' + this.writeFilename(writeLocal) + '. (' + e.message + ')');
      }
      return data;
    }
  }]);

  return Config;
}();

exports.default = Config;

// private methods

var localFile = function localFile() {
  return process.cwd() + '/.nexmorc';
};

var homeFile = function homeFile() {
  var key = process.platform == 'win32' ? 'USERPROFILE' : 'HOME';
  return process.env[key] + '/.nexmorc';
};