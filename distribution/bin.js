#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = new _emitter2.default();
var config = new _config2.default(emitter);
var client = new _client2.default(config, emitter);
var validator = new _validator2.default(emitter);
var response = new _response2.default(validator, emitter);
var request = new _request2.default(config, client, response);

_commander2.default.version('0.0.1').option('-q, --quiet', 'quiet mode', emitter.quiet.bind(emitter)).option('-v, --verbose', 'verbose mode', emitter.verbose.bind(emitter));

// account level
_commander2.default.command('setup <api_key> <api_secret>').alias('s').option('-l, --local', 'write config to current folder (./.nexmo) instead of the user root (~/.nexmo)').description('Set up your API credentials').action(request.accountSetup.bind(request));

_commander2.default.command('balance').alias('b').description('Current account balance').action(request.accountBalance.bind(request));

// numbers
_commander2.default.command('numbers:list').alias('n').description('List of numbers assigned to the account').action(request.numbersList.bind(request));

// catch unknown commands
_commander2.default.command('*', null, { noHelp: true }).action(function () {
  _commander2.default.help();
});

_commander2.default.parse(process.argv);

// show help on no command
if (!_commander2.default.args.length) _commander2.default.help();