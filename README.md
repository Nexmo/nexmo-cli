# Nexmo CLI

[![npm version](https://badge.fury.io/js/nexmo-cli.svg)](https://badge.fury.io/js/nexmo-cli)

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

[Flags](#flags) | [Account](#account) | [Numbers](#numbers) | [Applications](#applications) | [Linking](#linking) | [Insight](#insight)

### Flags

Use `--quiet` to silence all but errors and warnings, and use `--verbose` to get more detailed output.

### Account

#### Account login

```
> nexmo setup 123 abc
Credentials written to /home/username/.nexmorc
```

Alias: `nexmo s`.

#### Account balance

```
> nexmo balance
18.9686 EUR
```

Alias: `nexmo b`

### Numbers

#### List all numbers on your account

* Optional flags:
  * `--size` the amount of results to return
  * `--page` the page of results to return

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

Alias: `nexmo nl`, `nexmo numbers` and `nexmo number:list`.

#### Search for new numbers

Parameters:

* `country_code` - an ISO 3166-2 country code for the country you are trying to find a number for.
* Optional flags:
  * `--pattern <pattern>`  to be matched in number (use * to match end or start of number)
  * `--voice` to search for voice enabled numbers
  * `--sms` search for SMS enabled numbers
  * `--size` the amount of results to return
  * `--page` the page of results to return

```
> nexmo number:search US
12057200555
12069396555
12069396555
12155961555

> nexmo number:search NL --sms --pattern *007 --verbose
msisdn      | country | cost | type       | features
-----------------------------------------------------
31655551007 | NL      | 3.00 | mobile-lvn | VOICE,SMS
31655552007 | NL      | 3.00 | mobile-lvn | VOICE,SMS
31655553007 | NL      | 3.00 | mobile-lvn | VOICE,SMS
```

Alias: `nexmo ns` and `nexmo numbers:search`.

#### Buying a number

Parameters:

* `number` - The number to buy
* or `country_code` and `pattern` - The country and search pattern to find a number for and directly buy.

```
> nexmo number:buy 12069396555
Buying 12069396555. This is operation will charge your account.

Please type "confirm" to continue: confirm

Number purchased

> nexmo number:buy US *555
Buying 12069396555. This is operation will charge your account.

Please type "confirm" to continue: confirm

Number purchased

> nexmo number:buy 12069396555 --confirm
Number purchased
```

Alias: `nexmo nb` and `nexmo numbers:buy`.

#### Cancelling a number

```
> nexmo number:cancel 12069396555
This is operation can not be reversed.

Please type "confirm" to continue: confirm

Number cancelled

> nexmo number:cancel 12069396555 --confirm
Number cancelled
```

Alias: `nexmo nc` and `nexmo numbers:cancel`.


#### Update a number


For shortcuts of these options see [Linking](#linking).

```
> nexmo number:update 445555555555 --voice_callback_type app --voice_callback_value asdasdas-asdd-2344-2344-asdasdasd345
Number updated
```

Alias: `nexmo nu` and `nexmo numbers:update`.


### Applications

#### List your Applications

* Optional flags:
  * `--size` the amount of results to return
  * `--page` the page of results to return

```
> nexmo app:list
asdasdas-asdd-2344-2344-asdasdasd123 | Test Application 1
asdasdas-asdd-2344-2344-asdasdasd234 | Test Application 1
asdasdas-asdd-2344-2344-asdasdasd345 | Test Application 2

> nexmo app:list --verbose
id                                   | name
---------------------------------------------------------
asdasdas-asdd-2344-2344-asdasdasd123 | Test Application 1
asdasdas-asdd-2344-2344-asdasdasd234 | Test Application 1
asdasdas-asdd-2344-2344-asdasdasd345 | Test Application 2
```

Alias: `nexmo al` and `nexmo apps`.

#### Create a new Application

Parameters:

* `name` - the custom name of your application.
* `answer_url` - the URL where your webhook delivers the Nexmo Call Control Object that governs this call.
* `event_url` - the url the platform sends event information asynchronously to when the call_status changes
* Optional flags:
  * `--type <type>` the product you want to access with this application. (Default: voice)
  * `--answer_method <answer_method>` the http method for the `answer_url`. (Default: GET)
  * `--event_method <event_method>` the http method for the `event_url`. (Default: GET)

```
> nexmo app:create "Test Application 1" http://example.com http://example.com   
Application created: asdasdas-asdd-2344-2344-asdasdasd345

> nexmo app:create "Test Application 1" http://example.com http://example.com -v
[id]
asdasdas-asdd-2344-2344-asdasdasd345

[name]
Test Application 1

[voice.webhooks.0.endpoint_type]
event_url

[voice.webhooks.0.endpoint]
http://example.com

[voice.webhooks.0.http_method]
POST

[voice.webhooks.1.endpoint_type]
answer_url

[voice.webhooks.1.endpoint]
http://example.com

[voice.webhooks.1.http_method]
GET

[keys.public_key]
...

[keys.private_key]
...

[_links.self.href]
/applications/asdasdas-asdd-2344-2344-asdasdasd345
```

Alias: `nexmo ac`.

#### Show details for an Application

```
> nexmo app:show asdasdas-asdd-2344-2344-asdasdasd345
[id]
asdasdas-asdd-2344-2344-asdasdasd345

[name]
Test Application 1

[voice.webhooks.0.endpoint_type]
event_url

[voice.webhooks.0.endpoint]
http://example.com

[voice.webhooks.0.http_method]
POST

[voice.webhooks.1.endpoint_type]
answer_url

[voice.webhooks.1.endpoint]
http://example.com

[voice.webhooks.1.http_method]
GET

[keys.public_key]
...

[_links.self.href]
/applications/asdasdas-asdd-2344-2344-asdasdasd345
```

Alias: `nexmo as` and `nexmo app`.

#### Update an Application

Parameters:

* `app_id` - the UUID of your application.
* `name` - the custom name of your application.
* `answer_url` - the URL where your webhook delivers the Nexmo Call Control Object that governs this call.
* `event_url` - the url the platform sends event information asynchronously to when the call_status changes
* Optional flags:
  * `--type <type>` the product you want to access with this application. (Default: voice)
  * `--answer_method <answer_method>` the http method for the `answer_url`. (Default: GET)
  * `--event_method <event_method>` the http method for the `event_url`. (Default: GET)

```
> nexmo app:update asdasdas-asdd-2344-2344-asdasdasd345 "Test Application 1" http://example.com http://example.com   
Application updated: asdasdas-asdd-2344-2344-asdasdasd345

> nexmo app:update asdasdas-asdd-2344-2344-asdasdasd345 "Test Application 1" http://example.com http://example.com -v
[id]
asdasdas-asdd-2344-2344-asdasdasd345

[name]
Test Application 1

[voice.webhooks.0.endpoint_type]
event_url

[voice.webhooks.0.endpoint]
http://example.com

[voice.webhooks.0.http_method]
POST

[voice.webhooks.1.endpoint_type]
answer_url

[voice.webhooks.1.endpoint]
http://example.com

[voice.webhooks.1.http_method]
GET

[keys.public_key]
...

[keys.private_key]
...

[_links.self.href]
/applications/asdasdas-asdd-2344-2344-asdasdasd345
```

Alias: `nexmo au`.

#### Delete an application

```
> nexmo app:delete asdasdas-asdd-2344-2344-asdasdasd345
This is operation can not be reversed.

Please type "confirm" to continue: confirm

Application deleted

> nexmo app:delete asdasdas-asdd-2344-2344-asdasdasd345 --confirm
Application deleted
```

Alias: `nexmo ad`.

### Linking

#### Link a number to an app

```
> nexmo link:app 12057200555 asdasdas-asdd-2344-2344-asdasdasd345
Number updated

> nexmo unlink:app 12057200555
Number updated
```

Alias: `nexmo la`

#### Link a number to another phone number

```
> nexmo link:tel 12057200555 4455555555
Number updated

> nexmo unlink:tel 12057200555
Number updated
```

Alias: `nexmo lt`

#### Link a number to an sms callback url

```
> nexmo link:sms 12057200555 http://example.com/callback
Number updated

> nexmo unlink:sms 12057200555
Number updated
```

Alias: `nexmo lsms`

#### Link a number to a Voice XML callback url

```
> nexmo link:vxml 12057200555 http://example.com/callback
Number updated

> nexmo unlink:vxml 12057200555
Number updated
```

Alias: `nexmo lv`

#### Link a number to SIP URI

```
> nexmo link:sip 12057200555 sip:123@example.com
Number updated

> nexmo unlink:sip 12057200555
Number updated
```
Alias: `nexmo lsip`

### Insight

#### Insight Basic

This is the free Number Insight API:

```
> nexmo insight:basic 447555555555
447555555555 | GB
```

Alias: `nexmo insight` and `nexmo ib`

#### Insight Standard

This API will charge your account but provide additional details:

```
> nexmo insight:standard 447555555555 --confirm
447555555555 | GB | Telefonica UK Limited
```

Verbose mode will return additional information.

Alias: `nexmo is`

## Contributing

This projects is written in ES2015 and compiled using Babel. The source can be found in the `/source` folder, and the build is compiled to the `/distribution` folder.

To add changes fork (if needed) and clone the project.

```sh
npm run build # to build the source
npm install # to install all dependencies
npm install -g # to install the `nexmo` binary into your PATH
npm test # to run all tests
npm run watch:test # to watch for changes and run tests
```

You can run any `nexmo` command with the `--debug / -d` flag to get extra debug info from the underlying Node library.

# License

This library is released under the [MIT License][license]

[license]: LICENSE.txt
