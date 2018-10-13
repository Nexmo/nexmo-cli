import colors from 'colors';
import fs from 'fs';

class Response {
  constructor(validator, emitter) {
    this.emitter = emitter;
    this.validator = validator;
  }

  accountSetup(config, key, secret, flags) {
    return (error, response) => {
      this.validator.response(error, response);
      config.putAndSave({
        'credentials': {
          'api_key': key,
          'api_secret': secret
        }
      }, flags.local);
    };
  }

  accountInfo(client) {
    this.emitter.log(
`API Key:    ${client.credentials.apiKey}
API Secret: ${client.credentials.apiSecret}`
    );
  }

  accountBalance(error, response) {
    this.validator.response(error, response);
    this.emitter.log(
      `${Number((response.value).toFixed(2))} EUR`,
      `${response.value} EUR`
    );
  }

  // Pricing

  priceSms(error, response) {
    this.validator.response(error, response);
    this.emitter.log(`${response.price} EUR`);
  }

  priceVoice(error, response) {
    this.validator.response(error, response);
    this.emitter.log(`${response.price} EUR`);
  }

  priceCountry(error, response) {
    this.validator.response(error, response);
    if (response.networks && this.emitter.amplified) {
      this.emitter.table(response.networks, ['network', 'mtPrice'], ['network', 'mtPrice']);
    } else if (response.mt) {
      let price = this._maxPrice(response);
      this.emitter.log(`${price} EUR`);
    } else {
      this.emitter.log('No price found');
    }
  }

  _maxPrice(response) {
    let prices = response.networks.map((network) => {
      return parseFloat(network.mtPrice);
    });
    prices.push(parseFloat(response.mt));
    return Math.max.apply(null, prices);
  }

  // numbers

  numbersList(flags) {
    return (error, response) => {
      this.validator.response(error, response);
      if (response.numbers && response.numbers.length > 0) {
        this.emitter.pagination(flags, response);
        this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'type', 'features', 'voiceCallbackType', 'voiceCallbackValue', 'moHttpUrl', 'voiceStatusCallbackUrl']);
      } else {
        this.emitter.warn('No numbers');
      }
    };
  }

  numberSearch(flags) {
    return (error, response) => {
      this.validator.response(error, response);
      if (response.numbers && response.numbers.length > 0) {
        this.emitter.pagination(flags, response);
        this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'cost', 'type', 'features']);
      } else {
        this.emitter.warn('No numbers');
      }
    };
  }

  numberBuyFromNumber(number) {
    return (error, response) => {
      this.validator.response(error, response);
      this.emitter.log(`Number purchased: ${number}`);
    };
  }

  numberBuyFromPattern(callback) {
    return (error, response) => {
      this.validator.response(error, response);
      if (response.numbers && response.numbers.length > 0) {
        callback(response.numbers[0].msisdn);
      } else {
        this.emitter.error('No numbers match your search');
      }
    };
  }

  numberCancel(number) {
    return (error, response) => {
      this.validator.response(error, response);
      this.emitter.log(`Number cancelled: ${number}`);
    };
  }

  numberInsight(callback) {
    return (error, response) => {
      this.validator.response(error, response);
      callback(response);
    };
  }

  // applications

  applicationsList(flags) {
    return (error, response) => {
      this.validator.response(error, response);
      if (response._embedded && response._embedded.applications && response._embedded.applications.length > 0) {
        this.emitter.pagination(flags, response);
        this.emitter.table(response._embedded.applications, ['id', 'name'], ['id', 'name']);
      } else {
        this.emitter.warn('No applications');
      }
    };
  }

  searchByPartialAppId(partialAppId) {
    return (error, response) => {
      this.validator.response(error, response);
      let matches = response._embedded.applications.filter(application => application.id.startsWith(partialAppId));
      if (matches.length == 0) {
        this.emitter.warn(`No applications found with ID beginning: ${partialAppId}`);
      } else if (matches.length > 1) {
        this.emitter.warn(
          `Multiple applications found with ID beginning: ${partialAppId}\n` +
          'Try again with a more specific ID'
        );
      } else {
        return matches[0].id;
      }
    };
  }

  applicationCreate(flags) {
    return (error, response) => {
      this.validator.response(error, response);
      this.emitter.list(`Application created: ${response.id}`, response);
      this._writeKey(flags.keyfile, response.keys.private_key);
    };
  }

  applicationShow(error, response) {
    this.validator.response(error, response);
    this.emitter.list(null, response);
  }

  applicationUpdate(error, response) {
    this.validator.response(error, response);
    this.emitter.list(`Application updated: ${response.id}`, response);
  }

  applicationDelete(error, response) {
    this.validator.response(error, response);
    this.emitter.log('Application deleted');
  }

  applicationNumbers(app_id, flags) {
    return (error, response) => {
      this.validator.response(error, response);
      if (response.numbers && response.numbers.length > 0) {
        response.numbers = response.numbers.filter((number) => {
          return number.voiceCallbackValue == app_id;
        });

        this.emitter.pagination(flags, response);
        this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'type', 'features', 'voiceCallbackType', 'voiceCallbackValue', 'moHttpUrl', 'voiceStatusCallbackUrl']);
      } else {
        this.emitter.warn('No numbers');
      }
    };
  }

  // links

  numberUpdate(error, response) {
    this.validator.response(error, response);
    this.emitter.log('Number updated');
  }

  // insight

  insightBasic(error, response) {
    this.validator.response(error, response);
    this.emitter.list(`${response.international_format_number} | ${response.country_code}`, response);
  }

  insightStandard(error, response) {
    this.validator.response(error, response);
    this.emitter.list(`${response.international_format_number} | ${response.country_code} | ${response.current_carrier.name}`, response);
  }

  _writeKey(keyfile, private_key) {
    if (keyfile) {
      fs.writeFile(keyfile, private_key, (error) => {
        if(error) {
          this.emitter.warn(error.message);
          this._promptKey(private_key);
        } else {
          this.emitter.log(`Private Key saved to: ${keyfile}`);
        }
      });
    } else {
      this._promptKey(private_key);
    }
  }

  _promptKey(private_key) {
    this.emitter.log('\nPrivate Key:\n');
    this.emitter.log(colors.red.bgWhite(`${private_key}\n`));
    this.emitter.log('WARNING: You should save this key somewhere safe and secure now, it will not be provided again.');
  }

  // sending messages

  sendSms(error, response) {
    this.validator.response(error, response);
    const message = response.messages[0];
    this.emitter.log(`Message sent to:   ${message.to}
Remaining balance: ${message['remaining-balance']} EUR
Message price:     ${message['message-price']} EUR`);
  }

  // JWT

  generateJwt(error, token) {
    this.validator.response(error, token);
    this.emitter.log(`${token}`, `JWT:   ${token}`);
  }
}

export default Response;
