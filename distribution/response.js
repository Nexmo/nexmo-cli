'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
      this.emitter.log(response.value, 'Balance: ' + response.value);
    }

    // numbers

  }, {
    key: 'numbersList',
    value: function numbersList(error, response) {
      this.validator.response(error, response);
      if (response.numbers && response.numbers.length > 0) {
        this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'type', 'features']);
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
    key: 'numberBuy',
    value: function numberBuy(error, response) {
      this.validator.response(error, response);
      this.emitter.log(response);
    }
  }, {
    key: 'numberCancel',
    value: function numberCancel(error, response) {
      this.validator.response(error, response);
      this.emitter.log(response);
    }
  }]);

  return Response;
}();

exports.default = Response;