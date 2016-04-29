'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var quiet = void 0;

var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.output = console;
    quiet = false;
  }

  _createClass(Emitter, [{
    key: 'silence',
    value: function silence() {
      var _quiet = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      quiet = _quiet;
    }
  }, {
    key: 'setOutput',
    value: function setOutput(output) {
      this.output = output;
    }
  }, {
    key: 'emit',
    value: function emit(level, message) {
      if (level === 'log' && !quiet) {
        this.output.log(message);
      } else if (level === 'warn' && !quiet) {
        this.output.warn(message);
      } else if (level === 'error') {
        this.output.error(message);
      }
    }
  }]);

  return Emitter;
}();

exports.default = Emitter;