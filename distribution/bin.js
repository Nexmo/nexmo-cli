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

_commander2.default.version('0.0.1').option('-q, --quiet', 'disables all logging except for errors', emitter.quiet.bind(emitter)).option('-v, --verbose', 'enables more rich output for certain commands', emitter.verbose.bind(emitter));

// account level
_commander2.default.command('setup <api_key> <api_secret>').alias('s').option('-l, --local', 'write config to current folder (./.nexmo) instead of the user root (~/.nexmo)').description('Set up your API credentials').action(request.accountSetup.bind(request));

_commander2.default.command('balance').alias('b').description('Current account balance').action(request.accountBalance.bind(request));

// Number List
_commander2.default.command('numbers:list').alias('nl').description('List of numbers assigned to the account').action(request.numbersList.bind(request));

_commander2.default.command('numbers', null, { noHelp: true }).action(request.numbersList.bind(request));

_commander2.default.command('number', null, { noHelp: true }).action(request.numbersList.bind(request));

_commander2.default.command('number:list', null, { noHelp: true }).action(request.numbersList.bind(request));

// Number Buy
_commander2.default.command('number:buy <country_code> <msisdn>').alias('nb').option('--confirm', 'skip confirmation step and directly buy the number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log();
  emitter.log('    $ nexmo number:buy GB 445555555555');
  emitter.log('    $ nexmo number:buy NL 31555555555');
  emitter.log('    $ nexmo number:buy US 17136738555');
  emitter.log();
}).action(request.numberBuy.bind(request));

_commander2.default.command('numbers:buy <country_code> <msisdn>', null, { noHelp: true }).option('--confirm', 'skip confirmation step and directly buy the number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log();
  emitter.log('    $ nexmo number:buy GB 445555555555');
  emitter.log('    $ nexmo number:buy NL 31555555555');
  emitter.log('    $ nexmo number:buy US 17136738555');
  emitter.log();
}).action(request.numberBuy.bind(request));

// Number Search
_commander2.default.command('number:search <country_code>').alias('ns').option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)').option('--voice', 'search for voice enabled numbers').option('--sms', 'search for SMS enabled numbers').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log();
  emitter.log('    $ nexmo number:search GB --pattern 078*');
  emitter.log('    $ nexmo number:search NL --sms --pattern 123');
  emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
  emitter.log();
}).action(request.numberSearch.bind(request));

_commander2.default.command('numbers:search <country_code>', null, { noHelp: true }).option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)').option('--voice', 'search for voice enabled numbers').option('--sms', 'search for SMS enabled numbers').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log();
  emitter.log('    $ nexmo number:search GB --pattern 078*');
  emitter.log('    $ nexmo number:search NL --sms --pattern 123');
  emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
  emitter.log();
}).action(request.numberSearch.bind(request));

// Number Cancel
_commander2.default.command('number:cancel <country_code> <msisdn>').option('--confirm', 'skip confirmation step and directly cancel the number').alias('nc').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log();
  emitter.log('    $ nexmo number:cancel GB 445555555555');
  emitter.log('    $ nexmo number:cancel NL 31555555555');
  emitter.log('    $ nexmo number:cancel US 17136738555');
  emitter.log();
}).action(request.numberCancel.bind(request));

_commander2.default.command('numbers:cancel <country_code> <msisdn>', null, { noHelp: true }).option('--confirm', 'skip confirmation step and directly cancel the number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log();
  emitter.log('    $ nexmo number:cancel GB 445555555555');
  emitter.log('    $ nexmo number:cancel NL 31555555555');
  emitter.log('    $ nexmo number:cancel US 17136738555');
  emitter.log();
}).action(request.numberCancel.bind(request));

// catch unknown commands
_commander2.default.command('*', null, { noHelp: true }).action(function () {
  _commander2.default.help();
});

_commander2.default.parse(process.argv);

// show help on no command
if (!_commander2.default.args.length) _commander2.default.help();