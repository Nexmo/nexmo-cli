[Account](docs/account.md) | [Pricing](docs/pricing.md) | [Numbers](docs/numbers.md) | [Applications](docs/applications.md) | [Linking](docs/linking.md) | [Insight](docs/insight.md)

# Insight

## Insight Basic

This is the free Number Insight API:

```
> nexmo insight:basic 447555555555
447555555555 | GB
```

Alias: `nexmo insight` and `nexmo ib`

## Insight Standard

This API will charge your account but provide additional details:

```
> nexmo insight:standard 447555555555 --confirm
447555555555 | GB | Telefonica UK Limited
```

Verbose mode will return additional information.

Alias: `nexmo is`
