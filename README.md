# Nexmo CLI

[Installation](#installation) | [Usage](#usage) | [Contributing](#contributing) | [License](#license)


## Installation

The Nexmo CLI requires NodeJS 4 or above.

```
npm install nexmo-cli -g
```

The set up the CLI with your API key and secret:

```
nexmo setup a123b c345d
```

This will save your credentials to `~/.nexmorc`. If you want to use different credentials per project you can pass the `--local` flag as follows:

```
nexmo setup a123b c345d --local
```

This will save the config to your local folder instead.

## Usage

### Account balance

```
nexmo balance
```

## Examples

TBD

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
