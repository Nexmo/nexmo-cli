# Source files

All source files are in ES6.

## Client

Reads the config for the Nexmo SDK from file and instantiates a Nexmo client.

## Emitter

Handles output to the console. Will keep check of the global `--quiet` flag to hide debug level logging.

## Request

Passes the CLI request to the Nexmo client and response handler.

## Response

Passes a response from the Nexmo client.

## Validator

Validates the response from the Nexmo client.
