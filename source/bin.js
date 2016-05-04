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

// numbers
commander
  .command('numbers:list')
  .alias('n')
  .description('List of numbers assigned to the account')
  .action(request.numbersList.bind(request));

commander
  .command('numbers', null, { noHelp: true })
  .action(request.numbersList.bind(request));

commander
  .command('number', null, { noHelp: true })
  .action(request.numbersList.bind(request));

commander
  .command('number:list', null, { noHelp: true })
  .action(request.numbersList.bind(request));

// catch unknown commands
commander
  .command('*', null, { noHelp: true })
  .action(() => { commander.help(); });

commander.parse(process.argv);

// show help on no command
if (!commander.args.length) commander.help();
