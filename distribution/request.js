'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    value: function numbersList(flags) {
      var options = {};
      if (flags.page) {
        options.index = flags.page;
      }
      if (flags.size) {
        options.size = flags.size;
      }

      this.client.instance().getNumbers(options, this.response.numbersList.bind(this.response));
    }
  }, {
    key: 'numberSearch',
    value: function numberSearch(country_code, flags) {
      country_code = country_code.toUpperCase();

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

      this.client.instance().searchNumbers(country_code, options, this.response.numberSearch.bind(this.response));
    }
  }, {
    key: 'numberBuy',
    value: function numberBuy(msisdn, flags) {
      var _this = this;

      confirm('This is operation will charge your account.', this.response.emitter, flags, function () {
        _this.client.instance().numberInsightBasic(msisdn, _this.response.numberInsight(function (response) {
          _this.client.instance().buyNumber(response.country_code, msisdn, _this.response.numberBuy.bind(_this.response));
        }));
      });
    }
  }, {
    key: 'numberCancel',
    value: function numberCancel(msisdn, flags) {
      var _this2 = this;

      confirm('This is operation can not be reversed.', this.response.emitter, flags, function () {
        _this2.client.instance().numberInsightBasic(msisdn, _this2.response.numberInsight(function (response) {
          _this2.client.instance().cancelNumber(response.country_code, msisdn, _this2.response.numberCancel.bind(_this2.response));
        }));
      });
    }

    // Applications

  }, {
    key: 'applicationsList',
    value: function applicationsList(flags) {
      var options = {};
      if (flags.page) {
        options.index = flags.page;
      }
      if (flags.size) {
        options.size = flags.size;
      }

      this.client.instance().getApplications(options, this.response.applicationsList.bind(this.response));
    }
  }, {
    key: 'applicationCreate',
    value: function applicationCreate(name, answer_url, event_url, flags) {
      var options = {};
      if (flags.answer_method) {
        options.answer_method = flags.answer_method;
      }
      if (flags.event_method) {
        options.event_method = flags.event_method;
      }

      this.client.instance().createApplication(name, flags.type, answer_url, event_url, options, this.response.applicationCreate.bind(this.response));
    }
  }, {
    key: 'applicationShow',
    value: function applicationShow(app_id) {
      this.client.instance().getApplication(app_id, this.response.applicationShow.bind(this.response));
    }
  }, {
    key: 'applicationUpdate',
    value: function applicationUpdate(app_id, name, answer_url, event_url, flags) {
      var options = {};
      if (flags.answer_method) {
        options.answer_method = flags.answer_method;
      }
      if (flags.event_method) {
        options.event_method = flags.event_method;
      }

      this.client.instance().updateApplication(app_id, name, flags.type, answer_url, event_url, options, this.response.applicationUpdate.bind(this.response));
    }
  }, {
    key: 'applicationDelete',
    value: function applicationDelete(app_id, flags) {
      var _this3 = this;

      return confirm('This is operation can not be reversed.', this.response.emitter, flags, function () {
        _this3.client.instance().deleteApplication(app_id, _this3.response.applicationDelete.bind(_this3.response));
      });
    }

    // links

  }, {
    key: 'linkCreate',
    value: function linkCreate(msisdn, app_id) {
      var _this4 = this;

      this.client.instance().numberInsightBasic(msisdn, this.response.numberInsight(function (response) {
        var options = { voiceCallbackType: 'app', voiceCallbackValue: app_id };
        _this4.client.instance().updateNumber(response.country_code, msisdn, options, _this4.response.linkCreate.bind(_this4.response));
      }));
    }
  }]);

  return Request;
}();

exports.default = Request;

// private methods

var confirm = function confirm(message, emitter, flags, callback) {
  if (flags.confirm) {
    callback();
  } else {
    (function () {
      var cli = _readline2.default.createInterface(process.stdin, process.stdout);
      cli.question(message + '\n\nPlease type "confirm" to continue: ', function (answer) {
        if (answer.toString().trim() == 'confirm') {
          emitter.log(' ');
          callback();
        } else {
          process.exit(1);
        }

        cli.close();
        process.stdin.destroy();
      });
    })();
  }
};