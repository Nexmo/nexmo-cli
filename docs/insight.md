[Account](account.md) | [Pricing](pricing.md) | [Numbers](numbers.md) | [Applications](applications.md) | [Linking](linking.md) | [Insight](insight.md)

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
