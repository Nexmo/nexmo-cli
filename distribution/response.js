'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Response = function () {
  function Response(validator, emitter) {
    _classCallCheck(this, Response);

    this.emitter = emitter;
    this.validator = validator;
  }

  _createClass(Response, [{
    key: 'accountBalance',
    value: function accountBalance(error, response) {
      this.validator.response(error, response);
      this.emitter.log(response.value + ' EUR', 'Balance: ' + response.value + ' Euro');
    }

    // numbers

  }, {
    key: 'numbersList',
    value: function numbersList(error, response) {
      this.validator.response(error, response);
      if (response.numbers && response.numbers.length > 0) {
        this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'type', 'features', 'voiceCallbackType', 'voiceCallbackValue']);
      } else {
        this.emitter.warn('No numbers');
      }
    }
  }, {
    key: 'numberSearch',
    value: function numberSearch(error, response) {
      this.validator.response(error, response);
      if (response.numbers && response.numbers.length > 0) {
        this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'cost', 'type', 'features']);
      } else {
        this.emitter.warn('No numbers');
      }
    }
  }, {
    key: 'numberBuyFromNumber',
    value: function numberBuyFromNumber(error, response) {
      this.validator.response(error, response);
      this.emitter.log('Number purchased');
    }
  }, {
    key: 'numberBuyFromPattern',
    value: function numberBuyFromPattern(callback) {
      var _this = this;

      return function (error, response) {
        _this.validator.response(error, response);
        if (response.numbers && response.numbers.length > 0) {
          callback(response.numbers[0].msisdn);
        } else {
          _this.emitter.error('No numbers match your search');
        }
      };
    }
  }, {
    key: 'numberCancel',
    value: function numberCancel(error, response) {
      this.validator.response(error, response);
      this.emitter.log('Number cancelled');
    }
  }, {
    key: 'numberInsight',
    value: function numberInsight(callback) {
      var _this2 = this;

      return function (error, response) {
        _this2.validator.response(error, response);
        callback(response);
      };
    }

    // applications

  }, {
    key: 'applicationsList',
    value: function applicationsList(error, response) {
      this.validator.response(error, response);
      if (response._embedded && response._embedded.applications && response._embedded.applications.length > 0) {
        this.emitter.table(response._embedded.applications, ['id', 'name'], ['id', 'name']);
      } else {
        this.emitter.warn('No applications');
      }
    }
  }, {
    key: 'applicationCreate',
    value: function applicationCreate(flags) {
      var _this3 = this;

      return function (error, response) {
        _this3.validator.response(error, response);
        _this3.emitter.list('Application created: ' + response.id, response);
        _this3._writeKey(flags.keyfile, response.keys.private_key);
      };
    }
  }, {
    key: 'applicationShow',
    value: function applicationShow(error, response) {
      this.validator.response(error, response);
      this.emitter.list(null, response);
    }
  }, {
    key: 'applicationUpdate',
    value: function applicationUpdate(error, response) {
      this.validator.response(error, response);
      this.emitter.list('Application updated: ' + response.id, response);
    }
  }, {
    key: 'applicationDelete',
    value: function applicationDelete(error, response) {
      this.validator.response(error, response);
      this.emitter.log('Application deleted');
    }

    // links

  }, {
    key: 'linkCreate',
    value: function linkCreate(error, response) {
      this.validator.response(error, response);
      this.emitter.log('Number linked');
    }
  }, {
    key: 'linkDelete',
    value: function linkDelete(error, response) {
      this.validator.response(error, response);
      this.emitter.log('Number unlinked');
    }

    // insight

  }, {
    key: 'insightBasic',
    value: function insightBasic(error, response) {
      this.validator.response(error, response);
      this.emitter.list(response.international_format_number + ' | ' + response.country_code, response);
    }
  }, {
    key: 'insightStandard',
    value: function insightStandard(error, response) {
      this.validator.response(error, response);
      this.emitter.list(response.international_format_number + ' | ' + response.country_code + ' | ' + response.current_carrier.name, response);
    }
  }, {
    key: '_writeKey',
    value: function _writeKey(keyfile, private_key) {
      var _this4 = this;

      if (keyfile) {
        _fs2.default.writeFile(keyfile, private_key, function (error) {
          if (error) {
            _this4.emitter.warn(error.message);
            _this4._promptKey(private_key);
          } else {
            _this4.emitter.log('Private Key saved to: ' + keyfile);
          }
        });
      } else {
        this._promptKey(private_key);
      }
    }
  }, {
    key: '_promptKey',
    value: function _promptKey(private_key) {
      this.emitter.log('\nPrivate Key:\n');
      this.emitter.log(_colors2.default.red.bgWhite(private_key + '\n'));
      this.emitter.log('WARNING: You should save this key somewhere safe and secure now, it will not be provided again.');
    }
  }]);

  return Response;
}();

exports.default = Response;