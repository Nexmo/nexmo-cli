#!/usr/bin/env node

import './blocked-io';
import commander from 'commander';
import inquirer from 'inquirer';

import Emitter   from './emitter';
import Config    from './config';
import Client    from './client';
import Response  from './response';
import Request   from './request';
import Validator from './validator';
import prompts   from './prompts';
import pckg      from '../package.json';

const emitter   = new Emitter();
const config    = new Config(emitter);
const appConfig = new Config(emitter, "-app");
const client    = new Client(config, emitter, appConfig);
const validator = new Validator(emitter);
const response  = new Response(validator, emitter);
const request   = new Request(config, appConfig, client, response, emitter);

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
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
  .option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)')
  .alias('nl')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo numbers:list --page 2');
    emitter.log('    $ nexmo numbers:list --page 2 --size 20');
    emitter.log('    $ nexmo numbers:list --pattern 445*');
    emitter.log('    $ nexmo numbers:list --pattern *445');
    emitter.log(' ');
  })
  .action(request.numbersList.bind(request));

commander
  .command('number:list', null, { noHelp: true })
  .alias('numbers')
  .description('List of numbers assigned to the account')
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
  .option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:list --page 2');
    emitter.log('    $ nexmo number:list --page 2 --size 20');
    emitter.log('    $ nexmo number:list --pattern 445*');
    emitter.log('    $ nexmo number:list --pattern *445');
    emitter.log(' ');
  })
  .action(request.numbersList.bind(request));

// Number Buy
commander
  .command('number:buy [number_pattern]')
  .description('Buy a number to use for voice or SMS. If a --country_code is provided then the number_pattern is used to search for a number in the given country.')
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

commander
  .command('numbers:buy [number_pattern]')
  .description('Buy a number to use for voice or SMS. If a --country_code is provided then the number_pattern is used to search for a number in the given country.')
  .option('-c, --country_code [country_code]', 'the country code')
  .option('--confirm', 'skip confirmation step and directly buy the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo numbers:buy 445555555555');
    emitter.log('    $ nexmo numbers:buy 31555555555');
    emitter.log('    $ nexmo numbers:buy 17136738555');
    emitter.log(' ');
    emitter.log('  Optionally directly search and buy a number:');
    emitter.log(' ');
    emitter.log('    $ nexmo numbers:buy 445* -c GB');
    emitter.log('    $ nexmo numbers:buy -c US');
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
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
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
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
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
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .command('numbers:update <number>')
  .description('Configure the handling of a number')
  .alias('nu')
  .option('--mo_http_url <mo_http_url>', 'used for SMS callbacks')
  .option('--voice_callback_type <voice_callback_type>', 'the voice callback type (any of app/sip/tel/vxml)')
  .option('--voice_callback_value <voice_callback_value>', 'the voice callback value based on the voice_callback_type')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application')
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo numbers:update 445555555555 --voice_callback_type app --voice_callback_value asdasdas-asdd-2344-2344-asdasdasd345');
    emitter.log(' ');
  })
  .action(request.numberUpdate.bind(request));

commander
  .command('number:update <number>', null, { noHelp: true })
  .description('Configure the handling of a number')
  .option('--mo_http_url <mo_http_url>', 'used for SMS callbacks')
  .option('--voice_callback_type <voice_callback_type>', 'the voice callback type (any of app/sip/tel/vxml)')
  .option('--voice_callback_value <voice_callback_value>', 'the voice callback value based on the voice_callback_type')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application')
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
  .option('--v2', 'use the v2 version of the API')
  .alias('al')
  .description('List of numbers assigned to the account')
  .action(request.applicationsList.bind(request));

commander
  .command('apps', null, { noHelp: true })
  .description('List your Nexmo Applications')
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
  .option('--v2', 'use the v2 version of the API')
  .action(request.applicationsList.bind(request));

commander
  .command('app:list', null, { noHelp: true })
  .description('List your Nexmo Applications')
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
  .option('--v2', 'use the v2 version of the API')
  .action(request.applicationsList.bind(request));

// Application Create

commander
  .command('app:create [name] [answer_url] [event_url]')
  .description('Create a new Nexmo Application')
  .alias('ac')
  .option('--type <type>', 'the type of application', /^(voice|messages|artc)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the voice answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the voice event_url (defaults to POST)')
  .option('--keyfile <keyfile>', 'the file to save your private key to')
  .option('--public-keyfile [publicKeyfile]', 'the public key for your application')
  .option('--capabilities [capabilities]', 'the capabilities your application has, as a comma separated list. can be voice, messages, rtc, vbc')
  .option('--voice-event-url [voiceEventUrl]', 'the event URL for the voice capability')
  .option('--voice-event-method [voiceEventMethod]', 'the HTTP method to use for the --voice-event-url (defaults to POST)')
  .option('--voice-answer-url [voiceAnswerUrl]', 'the answer URL for the voice capability')
  .option('--voice-answer-method [voiceAnswerMethod]', 'the HTTP method to use for the --voice-answer-url (defaults to GET)')
  .option('--voice-fallback-answer-url [voiceFallbackAnswerUrl]', 'the fallback answer URL for the voice capability')
  .option('--voice-fallback-answer-method [voiceFallbackAnswerMethod]', 'the HTTP method to use for the --voice-fallback-answer-url (defaults to GET)')
  .option('--messages-inbound-url [messagesInboundUrl]', 'the inbound URL for the messages capability')
  .option('--messages-status-url [messagesStatusUrl]', 'the status URL for the messages capability')
  .option('--rtc-event-url [rtcEventUrl]', 'the event URL for the rtc capability')
  .option('--rtc-event-method [rtcEventMethod]', 'the HTTP method to use for the --rtc-event-url (defaults to POST)')

  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:create');
    emitter.log(' ');
  })
  .action((name, answer_url, event_url, flags) => {
    if (!name) {
      inquirer.prompt(prompts.applicationCreate).then(answers => {
        answers.capabilities = answers.capabilities.join();
        request.applicationCreate.bind(request)(answers.name, answer_url, event_url, answers);
      });
    } else {
      request.applicationCreate.bind(request)(name, answer_url, event_url, flags);
    }
  });

commander
  .command('apps:create [name] [answer_url] [event_url]', null, { noHelp: true })
  .description('Create a new Nexmo Application')
  .option('--type <type>', 'the type of application', /^(voice|messages|artc)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the voice answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the voice event_url (defaults to GET)')
  .option('--keyfile <keyfile>', 'the file to save your private key to')
  .option('--public-keyfile [publicKeyfile]', 'the public key for your application')
  .option('--capabilities [capabilities]', 'the capabilities your application has, as a comma separated list. can be voice, messages, rtc, vbc')
  .option('--voice-event-url [voiceEventUrl]', 'the event URL for the voice capability')
  .option('--voice-event-method [voiceEventMethod]', 'the HTTP method to use for the --voice-event-url (defaults to POST)')
  .option('--voice-answer-url [voiceAnswerUrl]', 'the answer URL for the voice capability')
  .option('--voice-answer-method [voiceAnswerMethod]', 'the HTTP method to use for the --voice-answer-url (defaults to GET)')
  .option('--voice-fallback-answer-url [voiceFallbackAnswerUrl]', 'the fallback answer URL for the voice capability')
  .option('--voice-fallback-answer-method [voiceFallbackAnswerMethod]', 'the HTTP method to use for the --voice-fallback-answer-url (defaults to GET)')
  .option('--messages-inbound-url [messagesInboundUrl]', 'the inbound URL for the messages capability')
  .option('--messages-status-url [messagesStatusUrl]', 'the status URL for the messages capability')
  .option('--rtc-event-url [rtcEventUrl]', 'the event URL for the rtc capability')
  .option('--rtc-event-method [rtcEventMethod]', 'the HTTP method to use for the --rtc-event-url (defaults to POST)')

  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo apps:create');
    emitter.log(' ');
  })
  .action((name, answer_url, event_url, flags) => {
    if (!name) {
      inquirer.prompt(prompts.applicationCreate).then(answers => {
        answers.capabilities = answers.capabilities.join();
        request.applicationCreate.bind(request)(answers.name, answer_url, event_url, answers);
      });
    } else {
      request.applicationCreate.bind(request)(name, answer_url, event_url, flags);
    }
  });

// Application Show

commander
  .command('app:show <app_id>')
  .description('Show details for a Nexmo Application')
  .option('--v2', 'use the v2 version of the API')
  .option('--recreate', 'show the CLI command to create a similar application')
  .alias('as')
  .action(request.applicationShow.bind(request));

commander
  .command('app <app_id>', null, { noHelp: true })
  .description('Show details for a Nexmo Application')
  .option('--v2', 'use the v2 version of the API')
  .option('--recreate', 'show the CLI command to create a similar application')
  .action(request.applicationShow.bind(request));

commander
  .command('app:setup <app_id> <private_key>')
  .description('Set up your Application ID and private key')
  .alias('aset')
  .option('-g, --global', 'write config to user root folder (~/.nexmo-app) instead of the current folder (./.nexmo-app)')
  .action(request.applicationSetup.bind(request));

commander
  .command('apps:show <app_id>', null, { noHelp: true })
  .description('Show details for a Nexmo Application')
  .option('--v2', 'use the v2 version of the API')
  .option('--recreate', 'show the CLI command to create a similar application')
  .action(request.applicationShow.bind(request));

// Application Update

commander
  .command('app:update <app_id> [name] [answer_url] [event_url]')
  .description('Update a Nexmo Application')
  .alias('au')
  .option('--type <type>', 'the type of application', /^(voice|messages|artc)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)')
  .option('--capabilities [capabilities]', 'the capabilities your application has, as a comma separated list. can be voice, messages, rtc, vbc')
  .option('--voice-event-url [voiceEventUrl]', 'the event URL for the voice capability')
  .option('--voice-event-method [voiceEventMethod]', 'the HTTP method to use for the --voice-event-url (defaults to POST)')
  .option('--voice-answer-url [voiceAnswerUrl]', 'the answer URL for the voice capability')
  .option('--voice-answer-method [voiceAnswerMethod]', 'the HTTP method to use for the --voice-answer-url (defaults to GET)')
  .option('--voice-fallback-answer-url [voiceFallbackAnswerUrl]', 'the fallback answer URL for the voice capability')
  .option('--voice-fallback-answer-method [voiceFallbackAnswerMethod]', 'the HTTP method to use for the --voice-fallback-answer-url (defaults to GET)')
  .option('--messages-inbound-url [messagesInboundUrl]', 'the inbound URL for the messages capability')
  .option('--messages-status-url [messagesStatusUrl]', 'the status URL for the messages capability')
  .option('--rtc-event-url [rtcEventUrl]', 'the event URL for the rtc capability')
  .option('--rtc-event-url [rtcEventMethod]', 'the HTTP method to use for the --rtc-event-url (defaults to POST)')
  .option('--public-keyfile [publicKeyfile]', 'the public key for your application')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:update');
    emitter.log(' ');
  })
  .action((app_id, name, answer_url, event_url, flags) => {
    if (!name) {
      inquirer.prompt(prompts.applicationUpdate).then(answers => {
        answers.capabilities = answers.capabilities.join();
        request.applicationUpdate.bind(request)(app_id, answers.name, answer_url, event_url, answers);
      });
    } else {
      request.applicationUpdate.bind(request)(app_id, name, answer_url, event_url, flags);
    }
  });

commander
  .command('apps:update <app_id> [name] [answer_url] [event_url]', null, { noHelp: true })
  .description('Update a Nexmo Application')
  .option('--type <type>', 'the type of application', /^(voice|messages|artc)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)')
  .option('--capabilities [capabilities]', 'the capabilities your application has, as a comma separated list. can be voice, messages, rtc, vbc')
  .option('--voice-event-url [voiceEventUrl]', 'the event URL for the voice capability')
  .option('--voice-event-method [voiceEventMethod]', 'the HTTP method to use for the --voice-event-url (defaults to POST)')
  .option('--voice-answer-url [voiceAnswerUrl]', 'the answer URL for the voice capability')
  .option('--voice-answer-method [voiceAnswerMethod]', 'the HTTP method to use for the --voice-answer-url (defaults to GET)')
  .option('--voice-fallback-answer-url [voiceFallbackAnswerUrl]', 'the fallback answer URL for the voice capability')
  .option('--voice-fallback-answer-method [voiceFallbackAnswerMethod]', 'the HTTP method to use for the --voice-fallback-answer-url (defaults to GET)')
  .option('--messages-inbound-url [messagesInboundUrl]', 'the inbound URL for the messages capability')
  .option('--messages-status-url [messagesStatusUrl]', 'the status URL for the messages capability')
  .option('--rtc-event-url [rtcEventUrl]', 'the event URL for the rtc capability')
  .option('--rtc-event-url [rtcEventMethod]', 'the HTTP method to use for the --rtc-event-url (defaults to POST)')
  .option('--public-keyfile [publicKeyfile]', 'the public key for your application')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:update');
    emitter.log(' ');
  })
  .action((app_id, name, answer_url, event_url, flags) => {
    if (!name) {
      inquirer.prompt(prompts.applicationUpdate).then(answers => {
        answers.capabilities = answers.capabilities.join();
        request.applicationUpdate.bind(request)(app_id, answers.name, answer_url, event_url, answers);
      });
    } else {
      request.applicationUpdate.bind(request)(app_id, name, answer_url, event_url, flags);
    }
  });


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

// App numbers

commander
  .command('app:numbers <app_id>')
  .description('Show numbers associated to a Nexmo Application')
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
  .alias('an')
  .action(request.applicationNumbers.bind(request));

commander
  .command('apps:numbers <app_id>', null, { noHelp: true })
  .description('Show numbers associated to a Nexmo Application')
  .option('--page <page>', 'the page of results to return', /^\d*$/i, 1)
  .option('--size <size>', 'the amount of results to return', /^\d*$/i, 100)
  .action(request.applicationNumbers.bind(request));

// Create a link

commander
  .command('link:app <number> <app_id>')
  .alias('la')
  .description('Link a number to an application')
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:sms 445555555555 http://example.com/callback');
    emitter.log(' ');
  })
  .action(request.linkSms.bind(request));

commander
  .command('link:tel <number> <other_number>')
  .alias('lt')
  .description('Link a number to another number')
  .option('--voice_status_callback <voice_status_callback>', 'a URL to which Nexmo will send a request when the call ends to notify your application.')
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo unlink:sms 445555555555');
    emitter.log(' ');
  })
  .action(request.unlinkSms.bind(request));

commander
  .command('unlink:tel <number>')
  .description('Unlink a number from another number')
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .option('-c, --country_code [country_code]', 'manually provide the country code, overriding a dynamic lookup')
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
  .command('insight:advanced <number>')
  .alias('ia')
  .option('--confirm', 'skip fee confirmation step and directly get the information' )
  .description('Get more details about this number like the roaming status and current country of the phone. This operation will incur a fee.')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo insight:advanced 445555555555');
    emitter.log(' ');
  })
  .action(request.insightAdvanced.bind(request));

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

commander
  .command('jwt:generate [private_key] [claims...]')
  .description('Generate a JWT (JSON Web Token)')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo jwt:generate path/to/private.key');
    emitter.log(' ');
    emitter.log('    $ nexmo jwt:generate path/to/private.key subject=username iat=1475861732');
    emitter.log(' ');
    emitter.log('    $ nexmo jwt:generate path/to/private.key subject=username iat=1475861732 application_id=asdasdas-asdd-2344-2344-asdasdasd345');
    emitter.log(' ');
  })
  .action(request.generateJwt.bind(request));

commander
  .command('conversation:create [payload...]')
  .description('Create a new Conversation')
  .alias('cc')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo conversation:create display_name=nexmo-chat');
    emitter.log(' ');
  })
  .action(request.conversationCreate.bind(request));

commander
  .command('user:create [payload...]')
  .description('Create a new User')
  .alias('uc')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo user:create name=alex');
    emitter.log(' ');
  })
  .action(request.userCreate.bind(request));

commander
  .command('member:add <conversation_id> [payload...]')
  .description('Adds a User to a Conversation')
  .alias('ma')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo member:add aaaaaaaa-bbbb-cccc-dddd-0123456789ab action=join channel=\'{"type":"app"}\' user_id=aaaaaaaa-bbbb-cccc-dddd-0123456789ab');
    emitter.log(' ');
  })
  .action(request.memberAdd.bind(request));

commander
  .command('member:list <conversation_id>')
  .description('Lists Members for a Conversation')
  .alias('ml')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo member:list aaaaaaaa-bbbb-cccc-dddd-0123456789ab');
    emitter.log(' ');
  })
  .action(request.memberList.bind(request));

// catch unknown commands
commander
  .command('*', null, { noHelp: true })
  .action(() => { commander.help(); });

commander.parse(process.argv);

// show help on no command
if (!commander.args.length) commander.help();
