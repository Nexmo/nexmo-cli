#!/usr/bin/env node

import commander from 'commander';
import Request from './request';
import Emitter from './emitter';

let request = new Request();
let emitter = new Emitter();

commander
  .version('0.0.1')
  .option('-q, --quiet', 'quiet mode', emitter.silence.bind(emitter));

// account level
commander
  .command("balance")
  .alias('b')
  .description("Prints the current balance")
  .action(request.accountBalance.bind(request));

commander.parse(process.argv);
