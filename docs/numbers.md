[Account](account.md) | [Pricing](pricing.md) | [Numbers](numbers.md) | [Applications](applications.md) | [Linking](linking.md) | [Insight](insight.md)

# Numbers

## List all numbers on your account

- Optional flags:

  - `--size` the amount of results to return
  - `--page` the page of results to return

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

## Search for new numbers

Parameters:

- `country_code` - an ISO 3166-2 country code for the country you are trying to find a number for.
- Optional flags:

  - `--pattern <pattern>` to be matched in number (use * to match end or start of number)
  - `--voice` to search for voice enabled numbers
  - `--sms` search for SMS enabled numbers
  - `--size` the amount of results to return
  - `--page` the page of results to return

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

## Buying a number

Parameters:

- `number` - The number to buy
- or `country_code` and `pattern` - The country and search pattern to find a number for and directly buy.

```
> nexmo number:buy 12069396555
Buying 12069396555\. This operation will charge your account.

Please type "confirm" to continue: confirm

Number purchased

> nexmo number:buy US *555
Buying 12069396555\. This operation will charge your account.

Please type "confirm" to continue: confirm

Number purchased

> nexmo number:buy 12069396555 --confirm
Number purchased
```

Alias: `nexmo nb` and `nexmo numbers:buy`.

## Cancelling a number

```
> nexmo number:cancel 12069396555
This is operation can not be reversed.

Please type "confirm" to continue: confirm

Number cancelled

> nexmo number:cancel 12069396555 --confirm
Number cancelled
```

Alias: `nexmo nc` and `nexmo numbers:cancel`.

## Update a number

For shortcuts of these options see [Linking](#linking).

```
> nexmo number:update 445555555555 --voice_callback_type app --voice_callback_value asdasdas-asdd-2344-2344-asdasdasd345
Number updated
```

Alias: `nexmo nu` and `nexmo numbers:update`.
