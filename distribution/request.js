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
    value: function accountSetup(key, secret, flags) {
      this.config.putAndSave({
        'credentials': {
          'api_key': key,
          'api_secret': secret
        }
      }, flags.local);
    }

    // Numbers

  }, {
    key: 'numbersList',
    value: function numbersList() {
      this.client.instance().getNumbers(this.response.numbersList.bind(this.response));
    }
  }, {
    key: 'numberBuy',
    value: function numberBuy(countryCode, msisdn) {
      this.client.instance().buyNumber(countryCode, msisdn, this.response.numberBuy.bind(this.response));
    }
  }, {
    key: 'numberSearch',
    value: function numberSearch(countryCode, flags) {
      countryCode = countryCode.toUpperCase();

      var options = { features: [] };
      if (flags.voice) {
        options.features.push('VOICE');
      }
      if (flags.sms) {
        options.features.push('SMS');
      }

      if (flags.pattern) {
        options.pattern = flags.pattern;
        options.search_pattern = 1;
        if (options.pattern[0] === '*') options.search_pattern = 2;
        if (options.pattern.slice(-1) === '*') options.search_pattern = 0;
      }

      this.client.instance().searchNumbers(countryCode, options, this.response.numberSearch.bind(this.response));
    }
  }]);

  return Request;
}();

exports.default = Request;