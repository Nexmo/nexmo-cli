# Nexmo CLI

[![npm version](https://badge.fury.io/js/nexmo-cli.svg)](https://badge.fury.io/js/nexmo-cli) [![Build Status](https://travis-ci.org/Nexmo/nexmo-cli.svg?branch=master)](https://travis-ci.org/Nexmo/nexmo-cli)

[Installation](#installation) | [Usage](#usage) | [Contributing](#contributing) | [License](#license)

## Installation

The Nexmo CLI requires NodeJS 4 or above. If you don't have Node installed on your system goto (<https://nodejs.org/en/download/>) and download the appropriate installer for your system.

Note: you may need root/admin privileges to install the cli globally.

```
npm install nexmo-cli -g
```

Then set up the CLI with your API key and secret:

```
nexmo setup a123b c345d
```

This will save your credentials to `~/.nexmorc`. If you want to use different credentials per project you can pass the `--local` flag as follows:

```
nexmo setup a123b c345d --local
```

This will save the config to your local folder instead. Now you can use the CLI to make direct API calls.

```
> nexmo balance
18.96 EUR
```

## Usage

Use `--quiet`/`-q` to silence all but errors and warnings, and use `--verbose`/`-v` to get more detailed output.

```
> nexmo number:search NL
31655551007
31655552007
31655553007

> nexmo number:search NL --verbose
msisdn      | country | cost | type       | features
-----------------------------------------------------
31655551007 | NL      | 3.00 | mobile-lvn | VOICE,SMS
31655552007 | NL      | 3.00 | mobile-lvn | VOICE,SMS
31655553007 | NL      | 3.00 | mobile-lvn | VOICE,SMS
```

### Detailed usage

* [Account](docs/account.md) - login to your account and see your current balance
* [Pricing](docs/pricing.md) - get the price to make a call or send a SMS to a number, or get the pricing for SMS in a whole country.
* [Numbers](docs/numbers.md) - search, buy, cancel and link numbers to application endpoints
* [Applications](docs/applications.md) - create applications for numbers to be linked to, helping you tie your numbers to your own app endpoints
* [Linking](docs/linking.md) - link numbers to applications, voice endpoints, and other callback URLs
* [Number Insight](docs/insight.md) - get insight into numbers including country, operator and more

## Contributing

This projects is written in ES2015 and compiled using Babel. The source can be found in the `/src` folder, and the build is compiled to the `/lib` folder.

To add changes fork (if needed) and clone the project.

```sh
npm install # to install all dependencies
npm run build # to explicitly build the source
npm install -g ./ # to implicitly build the source, and then install the `nexmo` binary into your PATH
npm test # to run all tests
npm run watch:test # to watch for changes and run tests
```

You can run the `nexmo` command with the `--debug / -d` flag to get extra debug info from the underlying Node library.

# License

This library is released under the [MIT License][license]

[license]: LICENSE.txt
