#!/usr/bin/env node

import commander from 'commander';

import Emitter  from './emitter';
import Config   from './config';
import Client   from './client';
import Response from './response';
import Request  from './request';

let emitter  = new Emitter();
let config   = new Config(emitter);
let client   = new Client(config, emitter);
let response = new Response(emitter);
let request  = new Request(config, client, response);

commander
  .version('0.0.1')
  .option('-q, --quiet', 'quiet mode', emitter.silence.bind(emitter));

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
  .description('Prints the current balance')
  .action(request.accountBalance.bind(request));

commander.parse(process.argv);
