"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.quiet = false;
  }

  _createClass(Emitter, [{
    key: "silence",
    value: function silence() {
      var quiet = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.quiet = quiet;
    }
  }, {
    key: "log",
    value: function log(message) {
      if (!this.quiet) console.log(message); // eslint-disable-line no-console
    }
  }, {
    key: "warn",
    value: function warn(message) {
      if (!this.quiet) console.warn(message); // eslint-disable-line no-console
    }
  }, {
    key: "error",
    value: function error(message) {
      console.error(message); // eslint-disable-line no-console
      process.exit(1);
    }
  }]);

  return Emitter;
}();

exports.default = Emitter;