'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _easynexmo = require('easynexmo');

var _easynexmo2 = _interopRequireDefault(_easynexmo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client(config, emitter) {
    _classCallCheck(this, Client);

    this.emitter = emitter;
    this.config = config;
  }

  _createClass(Client, [{
    key: 'instance',
    value: function instance() {
      initialize(this.config, this.emitter);
      return _easynexmo2.default;
    }
  }]);

  return Client;
}();

exports.default = Client;

// private methods

var initialize = function initialize(config, emitter) {
  try {
    var credentials = config.read().credentials;
    _easynexmo2.default.initialize(credentials.api_key, credentials.api_secret);
  } catch (e) {
    if (e instanceof TypeError) {
      emitter.error('Could not initialize Nexmo SDK. Please run \'nexmo setup\' to setup the CLI correctly. (' + e.message + ')');
    } else {
      emitter.error('Could not read credentials. Please run \'nexmo setup\' to setup the CLI. (' + e.message + ')');
    }
  }
};