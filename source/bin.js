#!/usr/bin/env node

import commander from 'commander';
import cli from './cli.js';

commander
  .version('0.0.1')
  .parse(process.argv);

cli.parse(commander);
