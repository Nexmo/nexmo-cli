#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = new _request2.default();
var emitter = new _emitter2.default();

_commander2.default.version('0.0.1').option('-q, --quiet', 'quiet mode', emitter.silence.bind(emitter));

// account level
_commander2.default.command("balance").alias('b').description("Prints the current balance").action(request.accountBalance.bind(request));

_commander2.default.parse(process.argv);