#!/usr/bin/env node

import commander from 'commander';

import Emitter   from './emitter';
import Config    from './config';
import Client    from './client';
import Response  from './response';
import Request   from './request';
import Validator from './validator';

let emitter   = new Emitter();
let config    = new Config(emitter);
let client    = new Client(config, emitter);
let validator = new Validator(emitter);
let response  = new Response(validator, emitter);
let request   = new Request(config, client, response);

commander
  .version('0.0.1')
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
  .command('number:buy <msisdn>')
  .description('Buy a number to use for voice or SMS')
  .alias('nb')
  .option('--confirm', 'skip confirmation step and directly buy the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:buy 445555555555');
    emitter.log('    $ nexmo number:buy 31555555555');
    emitter.log('    $ nexmo number:buy 17136738555');
    emitter.log(' ');
  })
  .action(request.numberBuy.bind(request));

commander
  .command('numbers:buy <msisdn>', null, { noHelp: true })
  .description('Buy a number to use for voice or SMS')
  .option('--confirm', 'skip confirmation step and directly buy the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo number:buy 445555555555');
    emitter.log('    $ nexmo number:buy 31555555555');
    emitter.log('    $ nexmo number:buy 17136738555');
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
  .command('number:cancel <msisdn>')
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
  .command('numbers:cancel <msisdn>', null, { noHelp: true })
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

// Application List
commander
  .command('app:list')
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

// Application Create

commander
  .command('app:create <name> <answer_url> <event_url>')
  .description('Create a new Nexmo Application')
  .alias('ac')
  .option('--type <type>', 'the type of application', /^(voice)$/i, 'voice')
  .option('--answer_method <answer_method>', 'the HTTP method to use for the answer_url (defaults to GET)')
  .option('--event_method <event_method>', 'the HTTP method to use for the event_url (defaults to GET)')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo app:create "Test Application 1" http://example.com http://example.com');
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

// Application Delete

commander
  .command('app:delete <app_id>')
  .description('Delete a Nexmo Application')
  .alias('ad')
  .option('--confirm', 'skip confirmation step and directly delete the app' )
  .action(request.applicationDelete.bind(request));

// Create a link

commander
  .command('link:create <number> <app_id>')
  .description('Link a number to an application')
  .alias('lc')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:create 445555555555 asdasdas-asdd-2344-2344-asdasdasd345');
    emitter.log(' ');
  })
  .action(request.linkCreate.bind(request));

commander
  .command('link <number> <app_id>', null, { noHelp: true })
  .description('Link a number to an application')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:create 445555555555 asdasdas-asdd-2344-2344-asdasdasd345');
    emitter.log(' ');
  })
  .action(request.linkCreate.bind(request));

// Delete a link

commander
  .command('link:delete <number>')
  .description('Unlink a number from any applications')
  .alias('ld')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:delete 445555555555');
    emitter.log(' ');
  })
  .action(request.linkDelete.bind(request));

commander
  .command('unlink <number>', null, { noHelp: true })
  .description('Unlink a number from any applications')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log(' ');
    emitter.log('    $ nexmo link:delete 445555555555');
    emitter.log(' ');
  })
  .action(request.linkDelete.bind(request));


// catch unknown commands
commander
  .command('*', null, { noHelp: true })
  .action(() => { commander.help(); });

commander.parse(process.argv);

// show help on no command
if (!commander.args.length) commander.help();
