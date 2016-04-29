"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emitter = require("./emitter");

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validator = function () {
  function Validator() {
    _classCallCheck(this, Validator);

    this.emitter = new _emitter2.default();
  }

  _createClass(Validator, [{
    key: "setEmitter",
    value: function setEmitter(emitter) {
      this.emitter = emitter;
    }
  }, {
    key: "response",
    value: function response(error, _response) {
      if (error) {
        this.emitter.emit("error", error);
      } else if (_response["error-code"]) {
        this.emitter.emit("error", _response["error-code-label"]);
      }
    }
  }]);

  return Validator;
}();

exports.default = Validator;