#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _cli = require('./cli.js');

var _cli2 = _interopRequireDefault(_cli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.0.1').parse(process.argv);

_cli2.default.parse(_commander2.default);