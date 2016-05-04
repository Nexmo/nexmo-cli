'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.silenced = false;
    this.amplified = false;
  }

  _createClass(Emitter, [{
    key: 'quiet',
    value: function quiet() {
      var silenced = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.silenced = silenced;
    }
  }, {
    key: 'verbose',
    value: function verbose() {
      var amplified = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.amplified = amplified;
    }
  }, {
    key: 'log',
    value: function log(message, amplified_message) {
      if (this.amplified && amplified_message) message = amplified_message;
      if (!this.silenced && message) console.log(message); // eslint-disable-line no-console
    }
  }, {
    key: 'warn',
    value: function warn(message) {
      if (!this.silenced) console.warn(message); // eslint-disable-line no-console
    }
  }, {
    key: 'error',
    value: function error(message) {
      console.error(message); // eslint-disable-line no-console
      process.exit(1);
    }
  }, {
    key: 'table',
    value: function table(data, regular_keys, verbose_keys) {
      var _this = this;

      var keys = this.amplified ? verbose_keys : regular_keys;
      var records = mapRecords(data, keys);
      if (this.amplified) {
        records.unshift(keys);
      }
      var lengths = valueLengths(records);

      records.forEach(function (record, row) {
        var message = formatMessage(record, lengths);
        _this.log(message);
        if (row == 0 && _this.amplified) _this.log(pad('', message.length, '-'));
      });
    }
  }]);

  return Emitter;
}();

exports.default = Emitter;


var pad = function pad() {
  var string = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var size = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var padding = arguments.length <= 2 || arguments[2] === undefined ? ' ' : arguments[2];

  if (string.length >= size) {
    return string;
  }

  var max = size - string.length;
  for (var i = 0; i < max; i++) {
    string += padding;
  }

  return string;
};

var mapRecords = function mapRecords(records, keys) {
  return records.map(function (record) {
    var mappedRecord = keys.map(function (key) {
      return '' + record[key];
    });
    return mappedRecord;
  });
};

var valueLengths = function valueLengths(records) {
  var lengths = [];
  records.forEach(function (record) {
    record.forEach(function (value, index) {
      lengths[index] = Math.max(lengths[index] || 0, value.length);
    });
  });
  return lengths;
};

var formatMessage = function formatMessage(record, lengths) {
  return record.reduce(function (previous, current, index) {
    if (index == 1) {
      previous = pad(previous, lengths[index - 1]);
    }
    return previous + ' | ' + pad(current, lengths[index]);
  });
};