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
      if (flags.page) {
        options.index = flags.page;
      }
      if (flags.size) {
        options.size = flags.size;
      }

      if (flags.pattern) {
        options.pattern = flags.pattern;
        options.search_pattern = 1;
        if (options.pattern[0] === '*') options.search_pattern = 2;
        if (options.pattern.slice(-1) === '*') options.search_pattern = 0;
      }

      this.client.instance().searchNumbers(countryCode, options, this.response.numberSearch.bind(this.response));
    }
  }, {
    key: 'numberBuy',
    value: function numberBuy(msisdn, flags) {
      var _this = this;

      confirm(this.response.emitter, flags, function () {
        _this.client.instance().numberInsightBasic(msisdn, _this.response.numberInsight(function (response) {
          _this.client.instance().buyNumber(response.country_code, msisdn, _this.response.numberBuy.bind(_this.response));
        }));
      });
    }
  }, {
    key: 'numberCancel',
    value: function numberCancel(msisdn, flags) {
      var _this2 = this;

      confirm(this.response.emitter, flags, function () {
        _this2.client.instance().numberInsightBasic(msisdn, _this2.response.numberInsight(function (response) {
          _this2.client.instance().cancelNumber(response.country_code, msisdn, _this2.response.numberCancel.bind(_this2.response));
        }));
      });
    }
  }]);

  return Request;
}();

exports.default = Request;


var confirm = function confirm(emitter, flags, callback) {
  var stdin = process.stdin;
  stdin.resume();

  var action = function action(answer) {
    if (answer.toString().trim() == 'confirm') {
      callback();
    } else {
      process.exit(1);
    }
  };

  if (flags.confirm) {
    callback();
  } else {
    emitter.log('This is operation can not be reversed. Please type "confirm" to continue.');
    stdin.addListener('data', action);
  }
};