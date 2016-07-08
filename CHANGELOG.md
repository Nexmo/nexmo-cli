# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [0.0.18]

- Update [nexmo-node] library to **1.0.0-beta-7**

## [0.0.17]

- Update [nexmo-node] library to **1.0.0-beta-6**
- Terminology change from **SDK** to **library**

## [0.0.16]

- Add validation for non-200 status from [nexmo-node] library

## [0.0.15]

- Change balance precision to match dashboard in non verbose mode.

## [0.0.14]

- Fixed advanced number buying functionality to use Number Insight Standard instead of advanced

## [0.0.13]

- Improved instructions
- Add Travis CI build
- Remove ES5 build from repository
- Change source and build folder names
- Update to use [nexmo-node] library  **1.0.0-beta-4**

## [0.0.12]

- Add `nexmo price:*` for find the price for SMS and Voice for any number or country.

## [0.0.11]

- Change `nexmo app:create` to allow for saving of the private key to a file

## [0.0.10]

- Update [easynexmo] library to **0.8.4**

## [0.0.9]

- Update [easynexmo] library to **cbetta/nexmo-node**
- Add `number:update` for updating a number's callback URLS. Also add the following easy shortcuts:
  - Add `link:tel`
  - Add `link:sms`
  - Add `link:vxml`
  - Add `link:sip`
- Remove `link:create` and `link:delete` in favor of the new shortcuts.

## [0.0.8]

* Add `nexmo insight:*` for finding insight into any number.

## [0.0.7]

- Update [easynexmo] library to **0.8.3**
- Terminology change from **msisdn** to **number**

## [0.0.6]

- Change binary to read version number from **package.json**

## [0.0.5]

- Add smart number buy functionality combining number search and buy into one call

## [0.0.4]

- Add `nexmo link:delete` `link:delete` in order to unlink numbers.

## [0.0.3]

- Update [easynexmo] library to **0.8.2**
- Add `--debug` flag
- Add `nexmo link:create` in order to link numbers to apps and callback URLs.

## [0.0.2]

- Update to contributors list

## [0.0.1]

Initial release.

List of commands:

- Account
  - `setup`
  - `balance`
- Number management
  - `numbers:list`
  - `number:buy`
  - `number:search`
  - `number:cancel`
- App management
  - `app:list`
  - `app:create`
  - `app:show`
  - `app:delete`

[0.0.18]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.18
[0.0.17]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.17
[0.0.16]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.16
[0.0.15]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.15
[0.0.14]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.14
[0.0.13]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.13
[0.0.12]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.12
[0.0.11]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.11
[0.0.10]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.10
[0.0.9]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.9
[0.0.8]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.8
[0.0.7]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.7
[0.0.6]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.6
[0.0.5]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.5
[0.0.4]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.4
[0.0.3]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.3
[0.0.2]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.2
[0.0.1]: https://github.com/Nexmo/nexmo-cli/tree/v0.0.1
[nexmo-node]: https://github.com/Nexmo/nexmo-node
[easynexmo]: https://github.com/Nexmo/nexmo-node
