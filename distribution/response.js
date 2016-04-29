'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Response = function () {
  function Response() {
    _classCallCheck(this, Response);

    this.emitter = new _emitter2.default();
    this.validator = new _validator2.default();
  }

  _createClass(Response, [{
    key: 'setEmitter',
    value: function setEmitter(emitter) {
      this.emitter = emitter;
    }
  }, {
    key: 'setValidator',
    value: function setValidator(validator) {
      this.validator = validator;
    }
  }, {
    key: 'accountBalance',
    value: function accountBalance(error, response) {
      this.validator.response(error, response);
      this.emitter.emit("log", response.value);
    }
  }]);

  return Response;
}();

exports.default = Response;