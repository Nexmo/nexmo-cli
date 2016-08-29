#!/usr/bin/env node

import './blocked-io';
import commander from 'commander';

import Emitter   from './emitter';
import Config    from './config';
import Client    from './client';
import Response  from './response';
import Request   from './request';
import Validator from './validator';
import pckg      from '../package.json';

let emitter   = new Emitter();
let config    = new Config(emitter);
let client    = new Client(config, emitter);
let validator = new Validator(emitter);
let response  = new Response(validator, emitter);
let request   = new Request(config, client, response);

commander
  .version(pckg.version)
  .option('-q, --quiet', 'disables all logging except for errors', emitter.quiet.bind(emitter))
  .option('-v, --verbose', 'enables more rich output for certain commands', emitter.verbose.bind(emitter))
  .option('-d, --debug', 'enables nexmo library to output debug statements', emitter.debug.bind(emitter));

// account level
commander
  .command('setup <api_key> <api_secret>')
  .description('Set up your API credentials')
  .alias('s')
  .option('-l, --local', 'write config to current folder (./.nexmo) instead of the user root (~/.nexmo)')
  .action(request.accountSetup.bind(request));

commander
  .command('account')
  .description('Your account details')
  .alias('a')
  .action(request.accountInfo.bind(request));

commander
  .command('balance')
  .description('Current account balance')
  .alias('b')
  .action(request.accountBalance.bind(request));

// Number List
commander
  .command('numbers:list')
  .description('List of numbers assigned to the account')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .alias('nl')
  .action(request.numbersList.bind(request));

commander
  .command('numbers', null, { noHelp: true })
  .description('List of numbers assigned to the account')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .action(request.numbersList.bind(request));

commander
  .command('number:list', null, { noHelp: true })
  .description('List of numbers assigned to the account')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .action(request.numbersList.bind(request));

// Number Buy
commander
  .command('number:buy [number_pattern]')
  .description('Buy a number to use for voice or SMS. If a --country_code is provided then the number_pattern is used to search for a number in the given country.')
  .alias('numbers:buy')
  .alias('nb')
  .option('-c, --country_code [country_code]', 'the country code')
  .option('--confirm', 'skip confirmation step and directly buy the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:buy 445555555555');
    emitter.log('    $ nexmo number:buy 31555555555');
    emitter.log('    $ nexmo number:buy 17136738555');
    emitter.log(' ');
    emitter.log('  Optionally directly search and buy a number:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:buy 445* -c GB');
    emitter.log('    $ nexmo number:buy -c US');
    emitter.log(' ');
  })
  .action(request.numberBuy.bind(request));

// Number Search
commander
  .command('number:search <country_code>')
  .description('Search for a number to buy')
  .alias('ns')
  .option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)')
  .option('--voice', 'search for voice enabled numbers' )
  .option('--sms', 'search for SMS enabled numbers')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:search GB --pattern 078*');
    emitter.log('    $ nexmo number:search NL --sms --pattern 123');
    emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
    emitter.log(' ');
  })
  .action(request.numberSearch.bind(request));

commander
  .command('numbers:search <country_code>', null, { noHelp: true })
  .description('Search for a number to buy')
  .option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)')
  .option('--voice', 'search for voice enabled numbers' )
  .option('--sms', 'search for SMS enabled numbers')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:search GB --pattern 078*');
    emitter.log('    $ nexmo number:search NL --sms --pattern 123');
    emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
    emitter.log(' ');
  })
  .action(request.numberSearch.bind(request));

// Number Cancel
commander
  .command('number:cancel <number>')
  .description('Cancel a number you own')
  .option('--confirm', 'skip confirmation step and directly cancel the number' )
  .alias('nc')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:cancel 445555555555');
    emitter.log('    $ nexmo number:cancel 31555555555');
    emitter.log('    $ nexmo number:cancel 17136738555');
    emitter.log(' ');
  })
  .action(request.numberCancel.bind(request));

commander
  .command('numbers:cancel <number>', null, { noHelp: true })
  .description('Cancel a number you own')
  .option('--confirm', 'skip confirmation step and directly cancel the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:cancel 445555555555');
    emitter.log('    $ nexmo number:cancel 31555555555');
    emitter.log('    $ nexmo number:cancel 17136738555');
    emitter.log(' ');
  })
  .action(request.numberCancel.bind(request));

commander
  .command('number:update <number>')
  .description('Link a number to an application')
  .alias('nu')
  .option('--mo_http_url <mo_http_url>', 'used for SMS callbacks')
  .option('--voice_callback_type <voice_callback_type>', 'the voice callback type (any of app/sip/tel/vxml)')
  .option('--voice_callback_value <voice_callback_value>', 'the voice callback value based on the voice_callback_type')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:update 445555555555 --voice_callback_type app --voice_callback_value asdasdas-asdd-2344-2344-asdasdasd345');
    emitter.log(' ');
  })
  .action(request.numberUpdate.bind(request));

commander
  .command('number:update <number>', null, { noHelp: true })
  .description('Link a number to an application')
  .option('--mo_http_url <mo_http_url>', 'used for SMS callbacks')
  .option('--voice_callback_type <voice_callback_type>', 'the voice callback type (any of app/sip/tel/vxml)')
  .option('--voice_callback_value <voice_callback_value>', 'the voice callback value based on the voice_callback_type')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:update 445555555555 --voice_callback_type app --voice_callback_value asdasdas-asdd-2344-2344-asdasdasd345');
    emitter.log(' ');
  })
  .action(request.numberUpdate.bind(request));

// Application List
commander
  .command('apps:list')
  .description('List your Nexmo Applications')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .alias('al')
  .description('List of numbers assigned to the account')
  .action(request.applicationsList.bind(request));

commander
  .command('apps', null, { noHelp: true })
  .description('List your Nexmo Applications')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .action(request.applicationsList.bind(request));

commander
  .command('app:list', null, { noHelp: true })
  .description('List your Nexmo Applications')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the amount of results to return')
  .action(request.applicationsList.bind(request));

// Application Create

commander
  .command('app:create <name> <answer_url> <event_url>')
  .description('Create a new Nexmo Application')
  .alias('ac')
  .option('--type <type>', 'the type of application', /^(voice)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)')
  .option('--keyfile <keyfile>', 'the file to save your private key to')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:create "Test Application 1" http://example.com http://example.com --keyfile private.key');
    emitter.log(' ');
  })
  .action(request.applicationCreate.bind(request));

commander
  .command('apps:create <name> <answer_url> <event_url>', null, { noHelp: true })
  .description('Create a new Nexmo Application')
  .option('--type <type>', 'the type of application', /^(voice)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)')
  .option('--keyfile <keyfile>', 'the file to save your private key to')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:create "Test Application 1" http://example.com http://example.com --keyfile private.key');
    emitter.log(' ');
  })
  .action(request.applicationCreate.bind(request));

// Application Show

commander
  .command('app:show <app_id>')
  .description('Show details for a Nexmo Application')
  .alias('as')
  .action(request.applicationShow.bind(request));

commander
  .command('app <app_id>', null, { noHelp: true })
  .description('Show details for a Nexmo Application')
  .action(request.applicationShow.bind(request));

commander
  .command('apps:show <app_id>', null, { noHelp: true })
  .description('Show details for a Nexmo Application')
  .action(request.applicationShow.bind(request));

// Application Update

commander
  .command('app:update <app_id> <name> <answer_url> <event_url>')
  .description('Update a Nexmo Application')
  .alias('au')
  .option('--type <type>', 'the type of application', /^(voice)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:update asdasdas-asdd-2344-2344-asdasdasd345 "Test Application 1" http://example.com http://example.com');
    emitter.log(' ');
  })
  .action(request.applicationUpdate.bind(request));

commander
  .command('apps:update <app_id> <name> <answer_url> <event_url>', null, { noHelp: true })
  .description('Update a Nexmo Application')
  .option('--type <type>', 'the type of application', /^(voice)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:update asdasdas-asdd-2344-2344-asdasdasd345 "Test Application 1" http://example.com http://example.com');
    emitter.log(' ');
  })
  .action(request.applicationUpdate.bind(request));


// Application Delete

commander
  .command('app:delete <app_id>')
  .description('Delete a Nexmo Application')
  .alias('ad')
  .option('--confirm', 'skip confirmation step and directly delete the app' )
  .action(request.applicationDelete.bind(request));

commander
  .command('apps:delete <app_id>', null, { noHelp: true })
  .description('Delete a Nexmo Application')
  .option('--confirm', 'skip confirmation step and directly delete the app' )
  .action(request.applicationDelete.bind(request));

// Create a link

commander
  .command('link:app <number> <app_id>')
  .alias('la')
  .description('Link a number to an application')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:app 445555555555 asdasdas-asdd-2344-2344-asdasdasd345');
    emitter.log(' ');
  })
  .action(request.linkApp.bind(request));

commander
  .command('link:sms <number> <callback_url>')
  .alias('lsms')
  .description('Link a number to an sms callback URL')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:sms 445555555555 http://example.com/callback');
    emitter.log(' ');
  })
  .action(request.linkSms.bind(request));

commander
  .command('link:vxml <number> <callback_url>')
  .alias('lv')
  .description('Link a number to a vxml callback URL')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:vxml 445555555555 http://example.com/callback');
    emitter.log(' ');
  })
  .action(request.linkVxml.bind(request));

commander
  .command('link:tel <number> <other_number>')
  .alias('lt')
  .description('Link a number to another number')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:tel 445555555555 1275555555');
    emitter.log(' ');
  })
  .action(request.linkTel.bind(request));

commander
  .command('link:sip <number> <sip_uri>')
  .alias('lsip')
  .description('Link a number to SIP URI')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:sip 445555555555 sip:1275555555@sip.example.com');
    emitter.log(' ');
  })
  .action(request.linkSip.bind(request));

// Delete a link

commander
  .command('unlink:app <number>')
  .description('Unlink a number from an application')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo unlink:app 4455555555555');
    emitter.log(' ');
  })
  .action(request.unlinkApp.bind(request));

commander
  .command('unlink:sms <number>')
  .description('Unlink a number from a sms callback URL')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo unlink:sms 445555555555');
    emitter.log(' ');
  })
  .action(request.unlinkSms.bind(request));

commander
  .command('unlink:vxml <number>')
  .description('Unlink a number from a vxml callback URL')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo unlink:vxml 445555555555');
    emitter.log(' ');
  })
  .action(request.unlinkVxml.bind(request));

commander
  .command('unlink:tel <number>')
  .description('Unlink a number from another number')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo unlink:tel 445555555555 ');
    emitter.log(' ');
  })
  .action(request.unlinkTel.bind(request));

commander
  .command('unlink:sip <number>')
  .description('Unlink a number from a SIP URI')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo unlink:sip 445555555555');
    emitter.log(' ');
  })
  .action(request.unlinkSip.bind(request));

// Insight

commander
  .command('insight:basic <number>')
  .alias('ib')
  .description('Get details about this number')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo insight:basic 445555555555');
    emitter.log(' ');
  })
  .action(request.insightBasic.bind(request));

commander
  .command('insight <number>', null, { noHelp: true })
  .description('Get details about this number')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo insight:basic 445555555555');
    emitter.log(' ');
  })
  .action(request.insightBasic.bind(request));

commander
  .command('insight:standard <number>')
  .alias('is')
  .option('--confirm', 'skip fee confirmation step and directly get the information' )
  .description('Get more details about this number like the current carrier. This operation will incur a fee.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo insight:standard 445555555555');
    emitter.log(' ');
  })
  .action(request.insightStandard.bind(request));

commander
  .command('price:sms <number>')
  .alias('ps')
  .description('Gives you the cost of sending an outbound text to a number.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo price:sms 445555555555');
    emitter.log(' ');
  })
  .action(request.priceSms.bind(request));

commander
  .command('price:voice <number>')
  .alias('pv')
  .description('Gives you the cost of making an outbound call to a number.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo price:voice 445555555555');
    emitter.log(' ');
  })
  .action(request.priceVoice.bind(request));

commander
  .command('price:country <country_code>')
  .alias('pc')
  .description('Gives you the cost of sending an outbound text message to the given country ID.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo price:country GB');
    emitter.log(' ');
  })
  .action(request.priceCountry.bind(request));

// sending sms

commander
  .command('sms <to> <text...>')
  .option('--confirm', 'skip confirmation step and directly send the message' )
  .option('-f, --from <from...>', 'the number or name to send the SMS message from (defaults to "Nexmo CLI")', 'Nexmo CLI')
  .description('Send an SMS')
  .action(request.sendSms.bind(request));

// catch unknown commands
commander
  .command('*', null, { noHelp: true })
  .action(() => { commander.help(); });

commander.parse(process.argv);

// show help on no command
if (!commander.args.length) commander.help();
