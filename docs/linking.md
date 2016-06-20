[Account](docs/account.md) | [Pricing](docs/pricing.md) | [Numbers](docs/numbers.md) | [Applications](docs/applications.md) | [Linking](docs/linking.md) | [Insight](docs/insight.md)

# Linking

## Link a number to an app

```
> nexmo link:app 12057200555 asdasdas-asdd-2344-2344-asdasdasd345
Number updated

> nexmo unlink:app 12057200555
Number updated
```

Alias: `nexmo la`

## Link a number to another phone number

```
> nexmo link:tel 12057200555 4455555555
Number updated

> nexmo unlink:tel 12057200555
Number updated
```

Alias: `nexmo lt`

## Link a number to an sms callback url

```
> nexmo link:sms 12057200555 http://example.com/callback
Number updated

> nexmo unlink:sms 12057200555
Number updated
```

Alias: `nexmo lsms`

## Link a number to a Voice XML callback url

```
> nexmo link:vxml 12057200555 http://example.com/callback
Number updated

> nexmo unlink:vxml 12057200555
Number updated
```

Alias: `nexmo lv`

## Link a number to SIP URI

```
> nexmo link:sip 12057200555 sip:123@example.com
Number updated

> nexmo unlink:sip 12057200555
Number updated
```

Alias: `nexmo lsip`
