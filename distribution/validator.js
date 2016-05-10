'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validator = function () {
  function Validator(emitter) {
    _classCallCheck(this, Validator);

    this.emitter = emitter;
  }

  _createClass(Validator, [{
    key: 'response',
    value: function response(error, _response) {
      this.debug(error, _response);

      if (error) {
        this.emitter.error(error.message);
      } else if (_response['error-code'] && _response['error-code'] !== '200') {
        this.emitter.error(_response['error-code-label']);
      }
    }
  }, {
    key: 'debug',
    value: function debug(error, response) {
      this.emitter.debugger('Validator.response() - Error: ');
      this.emitter.debugger(error);
      this.emitter.debugger('Validator.response() - Response: ');
      this.emitter.debugger(response);
      this.emitter.debugger('End Validator.response()');
    }
  }]);

  return Validator;
}();

exports.default = Validator;