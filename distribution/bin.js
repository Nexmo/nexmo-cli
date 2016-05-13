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

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = new _emitter2.default();
var config = new _config2.default(emitter);
var client = new _client2.default(config, emitter);
var validator = new _validator2.default(emitter);
var response = new _response2.default(validator, emitter);
var request = new _request2.default(config, client, response);

_commander2.default.version(_package2.default.version).option('-q, --quiet', 'disables all logging except for errors', emitter.quiet.bind(emitter)).option('-v, --verbose', 'enables more rich output for certain commands', emitter.verbose.bind(emitter)).option('-d, --debug', 'enables nexmo library to output debug statements', emitter.debug.bind(emitter));

// account level
_commander2.default.command('setup <api_key> <api_secret>').description('Set up your API credentials').alias('s').option('-l, --local', 'write config to current folder (./.nexmo) instead of the user root (~/.nexmo)').action(request.accountSetup.bind(request));

_commander2.default.command('balance').description('Current account balance').alias('b').action(request.accountBalance.bind(request));

// Number List
_commander2.default.command('numbers:list').description('List of numbers assigned to the account').option('--page <page>', 'the page of results to return').option('--size <size>', 'the amount of results to return').alias('nl').action(request.numbersList.bind(request));

_commander2.default.command('numbers', null, { noHelp: true }).description('List of numbers assigned to the account').option('--page <page>', 'the page of results to return').option('--size <size>', 'the amount of results to return').action(request.numbersList.bind(request));

_commander2.default.command('number:list', null, { noHelp: true }).description('List of numbers assigned to the account').option('--page <page>', 'the page of results to return').option('--size <size>', 'the amount of results to return').action(request.numbersList.bind(request));

// Number Buy
_commander2.default.command('number:buy <number>').description('Buy a number to use for voice or SMS').alias('nb').option('--confirm', 'skip confirmation step and directly buy the number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:buy 445555555555');
  emitter.log('    $ nexmo number:buy 31555555555');
  emitter.log('    $ nexmo number:buy 17136738555');
  emitter.log(' ');
}).action(request.numberBuy.bind(request));

_commander2.default.command('numbers:buy [country_code] <number>', null, { noHelp: true }).description('Buy a number to use for voice or SMS').option('--confirm', 'skip confirmation step and directly buy the number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:buy 445555555555');
  emitter.log('    $ nexmo number:buy 31555555555');
  emitter.log('    $ nexmo number:buy 17136738555');
  emitter.log(' ');
  emitter.log('  Optionally directly search and buy a number:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:buy GB 445*');
  emitter.log(' ');
}).action(request.numberBuy.bind(request));

// Number Search
_commander2.default.command('number:search <country_code>').description('Search for a number to buy').alias('ns').option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)').option('--voice', 'search for voice enabled numbers').option('--sms', 'search for SMS enabled numbers').option('--page <page>', 'the page of results to return').option('--size <size>', 'the amount of results to return').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:search GB --pattern 078*');
  emitter.log('    $ nexmo number:search NL --sms --pattern 123');
  emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
  emitter.log(' ');
}).action(request.numberSearch.bind(request));

_commander2.default.command('numbers:search <country_code>', null, { noHelp: true }).description('Search for a number to buy').option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)').option('--voice', 'search for voice enabled numbers').option('--sms', 'search for SMS enabled numbers').option('--page <page>', 'the page of results to return').option('--size <size>', 'the amount of results to return').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:search GB --pattern 078*');
  emitter.log('    $ nexmo number:search NL --sms --pattern 123');
  emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
  emitter.log(' ');
}).action(request.numberSearch.bind(request));

// Number Cancel
_commander2.default.command('number:cancel <number>').description('Cancel a number you own').option('--confirm', 'skip confirmation step and directly cancel the number').alias('nc').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:cancel 445555555555');
  emitter.log('    $ nexmo number:cancel 31555555555');
  emitter.log('    $ nexmo number:cancel 17136738555');
  emitter.log(' ');
}).action(request.numberCancel.bind(request));

_commander2.default.command('numbers:cancel <number>', null, { noHelp: true }).description('Cancel a number you own').option('--confirm', 'skip confirmation step and directly cancel the number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:cancel 445555555555');
  emitter.log('    $ nexmo number:cancel 31555555555');
  emitter.log('    $ nexmo number:cancel 17136738555');
  emitter.log(' ');
}).action(request.numberCancel.bind(request));

_commander2.default.command('number:update <number>').description('Link a number to an application').alias('nu').option('--mo_http_url <mo_http_url>', 'used for SMS callbacks').option('--voice_callback_type <voice_callback_type>', 'the voice callback type (any of app/sip/tel/vxml)').option('--voice_callback_value <voice_callback_value>', 'the voice callback value based on the voice_callback_type').option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:update 445555555555 --voice_callback_type app --voice_callback_value asdasdas-asdd-2344-2344-asdasdasd345');
  emitter.log(' ');
}).action(request.numberUpdate.bind(request));

_commander2.default.command('number:update <number>', null, { noHelp: true }).description('Link a number to an application').option('--mo_http_url <mo_http_url>', 'used for SMS callbacks').option('--voice_callback_type <voice_callback_type>', 'the voice callback type (any of app/sip/tel/vxml)').option('--voice_callback_value <voice_callback_value>', 'the voice callback value based on the voice_callback_type').option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo number:update 445555555555 --voice_callback_type app --voice_callback_value asdasdas-asdd-2344-2344-asdasdasd345');
  emitter.log(' ');
}).action(request.numberUpdate.bind(request));

// Application List
_commander2.default.command('app:list').description('List your Nexmo Applications').option('--page <page>', 'the page of results to return').option('--size <size>', 'the amount of results to return').alias('al').description('List of numbers assigned to the account').action(request.applicationsList.bind(request));

_commander2.default.command('apps', null, { noHelp: true }).description('List your Nexmo Applications').option('--page <page>', 'the page of results to return').option('--size <size>', 'the amount of results to return').action(request.applicationsList.bind(request));

// Application Create

_commander2.default.command('app:create <name> <answer_url> <event_url>').description('Create a new Nexmo Application').alias('ac').option('--type <type>', 'the type of application', /^(voice)$/i, 'voice').option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)').option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)').option('--keyfile <keyfile>', 'the file to save your private key to').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo app:create "Test Application 1" http://example.com http://example.com --keyfile private.key');
  emitter.log(' ');
}).action(request.applicationCreate.bind(request));

// Application Show

_commander2.default.command('app:show <app_id>').description('Show details for a Nexmo Application').alias('as').action(request.applicationShow.bind(request));

_commander2.default.command('app <app_id>', null, { noHelp: true }).description('Show details for a Nexmo Application').action(request.applicationShow.bind(request));

// Application Update

_commander2.default.command('app:update <app_id> <name> <answer_url> <event_url>').description('Update a Nexmo Application').alias('au').option('--type <type>', 'the type of application', /^(voice)$/i, 'voice').option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)').option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo app:update asdasdas-asdd-2344-2344-asdasdasd345 "Test Application 1" http://example.com http://example.com');
  emitter.log(' ');
}).action(request.applicationUpdate.bind(request));

// Application Delete

_commander2.default.command('app:delete <app_id>').description('Delete a Nexmo Application').alias('ad').option('--confirm', 'skip confirmation step and directly delete the app').action(request.applicationDelete.bind(request));

// Create a link

_commander2.default.command('link:app <number> <app_id>').alias('la').description('Link a number to an application').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo link:app 445555555555 asdasdas-asdd-2344-2344-asdasdasd345');
  emitter.log(' ');
}).action(request.linkApp.bind(request));

_commander2.default.command('link:sms <number> <callback_url>').alias('lsms').description('Link a number to an sms callback URL').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo link:sms 445555555555 http://example.com/callback');
  emitter.log(' ');
}).action(request.linkSms.bind(request));

_commander2.default.command('link:vxml <number> <callback_url>').alias('lv').description('Link a number to a vxml callback URL').option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application.').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo link:vxml 445555555555 http://example.com/callback');
  emitter.log(' ');
}).action(request.linkVxml.bind(request));

_commander2.default.command('link:tel <number> <other_number>').alias('lt').description('Link a number to another number').option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application.').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo link:tel 445555555555 1275555555');
  emitter.log(' ');
}).action(request.linkTel.bind(request));

_commander2.default.command('link:sip <number> <sip_uri>').alias('lsip').description('Link a number to SIP URI').option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application.').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo link:sip 445555555555 sip:1275555555@sip.example.com');
  emitter.log(' ');
}).action(request.linkSip.bind(request));

// Delete a link

_commander2.default.command('unlink:app <number>').description('Unlink a number from an application').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo unlink:app 4455555555555');
  emitter.log(' ');
}).action(request.unlinkApp.bind(request));

_commander2.default.command('unlink:sms <number>').description('Unlink a number from a sms callback URL').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo unlink:sms 445555555555');
  emitter.log(' ');
}).action(request.unlinkSms.bind(request));

_commander2.default.command('unlink:vxml <number>').description('Unlink a number from a vxml callback URL').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo unlink:vxml 445555555555');
  emitter.log(' ');
}).action(request.unlinkVxml.bind(request));

_commander2.default.command('unlink:tel <number>').description('Unlink a number from another number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo unlink:tel 445555555555 ');
  emitter.log(' ');
}).action(request.unlinkTel.bind(request));

_commander2.default.command('unlink:sip <number>').description('Unlink a number from a SIP URI').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo unlink:sip 445555555555');
  emitter.log(' ');
}).action(request.unlinkSip.bind(request));

// Insight

_commander2.default.command('insight:basic <number>').alias('ib').description('Get details about this number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo insight:basic 445555555555');
  emitter.log(' ');
}).action(request.insightBasic.bind(request));

_commander2.default.command('insight <number>', null, { noHelp: true }).description('Get details about this number').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo insight:basic 445555555555');
  emitter.log(' ');
}).action(request.insightBasic.bind(request));

_commander2.default.command('insight:standard <number>').alias('is').option('--confirm', 'skip fee confirmation step and directly get the information').description('Get more details about this number like the current carrier. This operation will incur a fee.').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo insight:standard 445555555555');
  emitter.log(' ');
}).action(request.insightStandard.bind(request));

_commander2.default.command('price:sms <number>').alias('ps').description('Gives you the cost of sending an outbound text to a number.').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo price:sms 445555555555');
  emitter.log(' ');
}).action(request.priceSms.bind(request));

_commander2.default.command('price:voice <number>').alias('pv').description('Gives you the cost of making an outbound call to a number.').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo price:voice 445555555555');
  emitter.log(' ');
}).action(request.priceVoice.bind(request));

_commander2.default.command('price:country <country_id>').alias('pc').description('Gives you the cost of sending an outbound text message to the given country ID.').on('--help', function () {
  emitter.log('  Examples:');
  emitter.log(' ');
  emitter.log('    $ nexmo price:country GB');
  emitter.log(' ');
}).action(request.priceCountry.bind(request));

// catch unknown commands
_commander2.default.command('*', null, { noHelp: true }).action(function () {
  _commander2.default.help();
});

_commander2.default.parse(process.argv);

// show help on no command
if (!_commander2.default.args.length) _commander2.default.help();