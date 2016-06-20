[Account](docs/account.md) | [Pricing](docs/pricing.md) | [Numbers](docs/numbers.md) | [Applications](docs/applications.md) | [Linking](docs/linking.md) | [Insight](docs/insight.md)

# Pricing

## Price to send an SMS to a number

```
> nexmo price:sms 44555555555
0.03140000 EUR
```

Alias: `nexmo ps`

## Price to make a call to a number

```
> nexmo price:voice 44555555555
0.02400000 EUR
```

Alias: `nexmo pv`

## Price for outbound SMS per country

```
> nexmo price:country GB
0.03140000 EUR

> nexmo price:country LU -v

network           | mtPrice
------------------------------
POST Luxembourg   | 0.01280000
Orange Luxembourg | 0.01280000
Join Experience   | 0.01280000
Tango             | 0.01280000
```

Alias: `nexmo pc`
