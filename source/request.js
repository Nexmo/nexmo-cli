class Request {
  constructor(config, client, response) {
    this.config   = config;
    this.client   = client;
    this.response = response;
  }
  // Account

  accountBalance() {
    this.client.instance().checkBalance(this.response.accountBalance.bind(this.response));
  }

  accountSetup(key, secret, flags) {
    this.config.putAndSave({
      'credentials': {
        'api_key': key,
        'api_secret': secret
      }
    }, flags.local);
  }

  // Numbers

  numbersList() {
    this.client.instance().getNumbers(this.response.numbersList.bind(this.response));
  }

  numberSearch(countryCode, flags) {
    countryCode = countryCode.toUpperCase();

    let options = { features: [] };
    if (flags.voice) { options.features.push('VOICE'); }
    if (flags.sms) { options.features.push('SMS'); }

    if(flags.pattern) {
      options.pattern = flags.pattern;
      options.search_pattern = 1;
      if (options.pattern[0] === '*') options.search_pattern = 2;
      if (options.pattern.slice(-1) === '*') options.search_pattern = 0;
    }

    this.client.instance().searchNumbers(countryCode, options, this.response.numberSearch.bind(this.response));
  }

  numberBuy(countryCode, msisdn) {
    this.client.instance().buyNumber(countryCode, msisdn, this.response.numberBuy.bind(this.response));
  }

  numberCancel(countryCode, msisdn) {
    this.client.instance().cancelNumber(countryCode, msisdn, this.response.numberCancel.bind(this.response));
  }
}

export default Request;
