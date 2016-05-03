# Nexmo CLI

[Installation](#installation) | [Usage](#usage) | [Contributing](#contributing) | [License](#license)


## Installation

The Nexmo CLI requires NodeJS 4 or above.

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

This will save the config to your local folder instead.

## Usage

### Flags

Use `--quiet` to silence all but errors and warnings, and use `--verbose` to get more detailed output.

### Account balance

```
> nexmo balance
18.9686
```

### Numbers

#### List all numbers on your account

```
> nexmo numbers:list
31555555555
445555555555

> nexmo numbers:list --verbose
msisdn       | country | type       | features
-----------------------------------------------
31555555555  | NL      | landline   | VOICE    
445555555555 | GB      | mobile-lvn | VOICE,SMS      
445555555556 | GB      | mobile-lvn | SMS      
```

## Contributing

This projects is written in ES2015 and compiled using Babel. The source can be found in the `/source` folder, and the build is compiled to the `/distribution` folder.

To make changes:

### Build source

```
npm run build
```

### Running the CLI locally

After rebuilding the library run the following command to reinstall the library.

```
npm install -g
```

### Running tests

```
npm test
```

# License

This library is released under the [MIT License][license]

[license]: LICENSE.txt
