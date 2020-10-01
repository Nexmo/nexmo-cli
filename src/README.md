# Source files

All source files are in ES6.

## Client(Config, Emitter)

Allows for initializing of the Nexmo Node library.

## Config(Emitter)

Allows for reading and writing of user credentials to the `.nexmorc` file

## Emitter()

Handles output to the console. Will keep check of the global `--quiet`, `--verbose` and `--debug` flags to show and hide the right logs.

## Request(Config, Client, Response)

Takes input from the CLI and passes this on to the Client or the Config. Binds results to be handled by the Response.

## Response(Validator, Emitter)

Parses responses from Config and Client. Passes the initial results to the Validator and if it all passes uses the Emitter to output the results.

## Validator(Emitter)

Validates error and response objects and outputs errors using the Emitter.

## Bin(Imports all)

Imports all files and and sends commands for response in CLI to user.
