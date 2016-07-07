import colors from 'colors';
import fs from 'fs';

class Response {
  constructor(validator, emitter) {
    this.emitter = emitter;
    this.validator = validator;
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
      this.emitter.log(`${response.mt} EUR`);
    } else {
      this.emitter.log('No price found');
    }
  }

  // numbers

  numbersList(error, response) {
    this.validator.response(error, response);
    if (response.numbers && response.numbers.length > 0) {
      this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'type', 'features', 'voiceCallbackType', 'voiceCallbackValue', 'moHttpUrl', 'voiceStatusCallbackUrl']);
    } else {
      this.emitter.warn('No numbers');
    }
  }

  numberSearch(error, response) {
    this.validator.response(error, response);
    if (response.numbers && response.numbers.length > 0) {
      this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'cost', 'type', 'features']);
    } else {
      this.emitter.warn('No numbers');
    }
  }

  numberBuyFromNumber(error, response) {
    this.validator.response(error, response);
    this.emitter.log('Number purchased');
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

  numberCancel(error, response) {
    this.validator.response(error, response);
    this.emitter.log('Number cancelled');
  }

  numberInsight(callback) {
    return (error, response) => {
      this.validator.response(error, response);
      callback(response);
    };
  }

  // applications

  applicationsList(error, response) {
    this.validator.response(error, response);
    if (response._embedded && response._embedded.applications && response._embedded.applications.length > 0) {
      this.emitter.table(response._embedded.applications, ['id', 'name'], ['id', 'name']);
    } else {
      this.emitter.warn('No applications');
    }
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
}

export default Response;
