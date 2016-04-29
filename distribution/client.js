'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ini = require('ini');

var _ini2 = _interopRequireDefault(_ini);

var _easynexmo = require('easynexmo');

var _easynexmo2 = _interopRequireDefault(_easynexmo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client() {
    _classCallCheck(this, Client);
  }

  _createClass(Client, [{
    key: 'instance',

    // returns an initialized Nexmo client
    value: function instance() {
      var credentials = this.credentials();
      _easynexmo2.default.initialize(credentials.api_key, credentials.api_secret, false);
      return _easynexmo2.default;
    }

    // reads the user credentials from disk

  }, {
    key: 'credentials',
    value: function credentials() {
      return _ini2.default.parse(_fs2.default.readFileSync(this.userHome() + '/.nexmo/config', 'utf-8')).credentials;
    }

    // determines the user's HOME

  }, {
    key: 'userHome',
    value: function userHome() {
      var key = process.platform == 'win32' ? 'USERPROFILE' : 'HOME';
      return process.env[key];
    }
  }]);

  return Client;
}();

exports.default = Client;