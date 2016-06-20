[Account](docs/account.md) | [Pricing](docs/pricing.md) | [Numbers](docs/numbers.md) | [Applications](docs/applications.md) | [Linking](docs/linking.md) | [Insight](docs/insight.md)

# Applications

## List your Applications

- Optional flags:

  - `--size` the amount of results to return
  - `--page` the page of results to return

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

## Create a new Application

Parameters:

- `name` - the custom name of your application.
- `answer_url` - the URL where your webhook delivers the Nexmo Call Control Object that governs this call.
- `event_url` - the url the platform sends event information asynchronously to when the call_status changes
- Optional flags:

  - `--keyfile <keyfile>` the file to save your private key to
  - `--type <type>` the product you want to access with this application. (Default: voice)
  - `--answer_method <answer_method>` the http method for the `answer_url`. (Default: GET)
  - `--event_method <event_method>` the http method for the `event_url`. (Default: GET)

```
> nexmo app:create "Test Application 1" http://example.com http://example.com  --keyfile private.key
Application created: asdasdas-asdd-2344-2344-asdasdasd345
Private Key saved to: private.key

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

## Show details for an Application

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


Private Key saved to: private.key
```

Alias: `nexmo as` and `nexmo app`.

## Update an Application

Parameters:

- `app_id` - the UUID of your application.
- `name` - the custom name of your application.
- `answer_url` - the URL where your webhook delivers the Nexmo Call Control Object that governs this call.
- `event_url` - the url the platform sends event information asynchronously to when the call_status changes
- Optional flags:

  - `--type <type>` the product you want to access with this application. (Default: voice)
  - `--answer_method <answer_method>` the http method for the `answer_url`. (Default: GET)
  - `--event_method <event_method>` the http method for the `event_url`. (Default: GET)

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

## Delete an application

```
> nexmo app:delete asdasdas-asdd-2344-2344-asdasdasd345
This is operation can not be reversed.

Please type "confirm" to continue: confirm

Application deleted

> nexmo app:delete asdasdas-asdd-2344-2344-asdasdasd345 --confirm
Application deleted
```

Alias: `nexmo ad`.
