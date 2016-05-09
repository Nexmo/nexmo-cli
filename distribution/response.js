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
      this.emitter.log('Number purchased');
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
      var _this = this;

      return function (error, response) {
        _this.validator.response(error, response);
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
    value: function applicationCreate(error, response) {
      this.validator.response(error, response);
      this.emitter.list('Application created: ' + response.id, response);
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
  }]);

  return Response;
}();

exports.default = Response;