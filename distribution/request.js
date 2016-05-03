'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
  function Request(config, client, response) {
    _classCallCheck(this, Request);

    this.config = config;
    this.client = client;
    this.response = response;
  }
  // Account

  _createClass(Request, [{
    key: 'accountBalance',
    value: function accountBalance() {
      this.client.instance().checkBalance(this.response.accountBalance.bind(this.response));
    }
  }, {
    key: 'accountSetup',
    value: function accountSetup(key, secret, options) {
      this.config.putAndSave({
        'credentials': {
          'api_key': key,
          'api_secret': secret
        }
      }, options.local);
    }

    // Numbers

  }, {
    key: 'numbersList',
    value: function numbersList() {
      this.client.instance().getNumbers(this.response.numbersList.bind(this.response));
    }
  }]);

  return Request;
}();

exports.default = Request;