'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
  function Request() {
    _classCallCheck(this, Request);

    this.response = new _response2.default();
    this.client = new _client2.default().instance();
  }

  _createClass(Request, [{
    key: 'setClient',
    value: function setClient(client) {
      this.client = client;
    }
  }, {
    key: 'setResponse',
    value: function setResponse(response) {
      this.response = response;
    }
  }, {
    key: 'accountBalance',
    value: function accountBalance() {
      this.client.checkBalance(this.response.accountBalance.bind(this.response));
    }
  }]);

  return Request;
}();

exports.default = Request;