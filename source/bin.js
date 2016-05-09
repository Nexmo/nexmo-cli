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
  .option('-v, --verbose', 'enables more rich output for certain commands', emitter.verbose.bind(emitter));

// account level
commander
  .command('setup <api_key> <api_secret>')
  .alias('s')
  .option('-l, --local', 'write config to current folder (./.nexmo) instead of the user root (~/.nexmo)')
  .description('Set up your API credentials')
  .action(request.accountSetup.bind(request));

commander
  .command('balance')
  .alias('b')
  .description('Current account balance')
  .action(request.accountBalance.bind(request));

// Number List
commander
  .command('numbers:list')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the number of results to return')
  .alias('nl')
  .description('List of numbers assigned to the account')
  .action(request.numbersList.bind(request));

commander
  .command('numbers', null, { noHelp: true })
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the number of results to return')
  .action(request.numbersList.bind(request));

commander
  .command('number', null, { noHelp: true })
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the number of results to return')
  .action(request.numbersList.bind(request));

commander
  .command('number:list', null, { noHelp: true })
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the number of results to return')
  .action(request.numbersList.bind(request));

// Number Buy
commander
  .command('number:buy <msisdn>')
  .alias('nb')
  .option('--confirm', 'skip confirmation step and directly buy the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log();
    emitter.log('    $ nexmo number:buy GB 445555555555');
    emitter.log('    $ nexmo number:buy NL 31555555555');
    emitter.log('    $ nexmo number:buy US 17136738555');
    emitter.log();
  })
  .action(request.numberBuy.bind(request));

commander
  .command('numbers:buy <msisdn>', null, { noHelp: true })
  .option('--confirm', 'skip confirmation step and directly buy the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log();
    emitter.log('    $ nexmo number:buy GB 445555555555');
    emitter.log('    $ nexmo number:buy NL 31555555555');
    emitter.log('    $ nexmo number:buy US 17136738555');
    emitter.log();
  })
  .action(request.numberBuy.bind(request));

// Number Search
commander
  .command('number:search <country_code>')
  .alias('ns')
  .option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)')
  .option('--voice', 'search for voice enabled numbers' )
  .option('--sms', 'search for SMS enabled numbers')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the number of results to return')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log();
    emitter.log('    $ nexmo number:search GB --pattern 078*');
    emitter.log('    $ nexmo number:search NL --sms --pattern 123');
    emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
    emitter.log();
  })
  .action(request.numberSearch.bind(request));

commander
  .command('numbers:search <country_code>', null, { noHelp: true })
  .option('--pattern <pattern>', 'to be matched in number (use * to match end or start of number)')
  .option('--voice', 'search for voice enabled numbers' )
  .option('--sms', 'search for SMS enabled numbers')
  .option('--page <page>', 'the page of results to return')
  .option('--size <size>', 'the number of results to return')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log();
    emitter.log('    $ nexmo number:search GB --pattern 078*');
    emitter.log('    $ nexmo number:search NL --sms --pattern 123');
    emitter.log('    $ nexmo number:search US --pattern *007 --verbose');
    emitter.log();
  })
  .action(request.numberSearch.bind(request));

// Number Cancel
commander
  .command('number:cancel <msisdn>')
  .option('--confirm', 'skip confirmation step and directly cancel the number' )
  .alias('nc')
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log();
    emitter.log('    $ nexmo number:cancel GB 445555555555');
    emitter.log('    $ nexmo number:cancel NL 31555555555');
    emitter.log('    $ nexmo number:cancel US 17136738555');
    emitter.log();
  })
  .action(request.numberCancel.bind(request));

commander
  .command('numbers:cancel <msisdn>', null, { noHelp: true })
  .option('--confirm', 'skip confirmation step and directly cancel the number' )
  .on('--help', () => {
    emitter.log('  Examples:');
    emitter.log();
    emitter.log('    $ nexmo number:cancel GB 445555555555');
    emitter.log('    $ nexmo number:cancel NL 31555555555');
    emitter.log('    $ nexmo number:cancel US 17136738555');
    emitter.log();
  })
  .action(request.numberCancel.bind(request));

// catch unknown commands
commander
  .command('*', null, { noHelp: true })
  .action(() => { commander.help(); });

commander.parse(process.argv);

// show help on no command
if (!commander.args.length) commander.help();
