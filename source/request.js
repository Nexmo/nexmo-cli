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

  numbersList(flags) {
    let options = {};
    if (flags.page) { options.index = flags.page; }
    if (flags.size) { options.size = flags.size; }

    this.client.instance().getNumbers(options, this.response.numbersList.bind(this.response));
  }

  numberSearch(countryCode, flags) {
    countryCode = countryCode.toUpperCase();

    let options = { features: [] };
    if (flags.voice) { options.features.push('VOICE'); }
    if (flags.sms) { options.features.push('SMS'); }
    if (flags.page) { options.index = flags.page; }
    if (flags.size) { options.size = flags.size; }

    if(flags.pattern) {
      options.pattern = flags.pattern;
      options.search_pattern = 1;
      if (options.pattern[0] === '*') options.search_pattern = 2;
      if (options.pattern.slice(-1) === '*') options.search_pattern = 0;
    }

    this.client.instance().searchNumbers(countryCode, options, this.response.numberSearch.bind(this.response));
  }

  numberBuy(msisdn, flags) {
    confirm(this.response.emitter, flags, () => {
      this.client.instance().numberInsightBasic(msisdn, this.response.numberInsight((response) => {
        this.client.instance().buyNumber(response.country_code, msisdn, this.response.numberBuy.bind(this.response));
      }));
    });
  }

  numberCancel(msisdn, flags) {
    confirm(this.response.emitter, flags, () => {
      this.client.instance().numberInsightBasic(msisdn, this.response.numberInsight((response) => {
        this.client.instance().cancelNumber(response.country_code, msisdn, this.response.numberCancel.bind(this.response));
      }));
    });
  }
}

export default Request;

let confirm = function(emitter, flags, callback) {
  let stdin = process.stdin;
  stdin.resume();

  let action = (answer) => {
    if (answer.toString().trim() == 'confirm') {
      callback();
    } else {
      process.exit(1);
    }
  };

  if (flags.confirm) {
    callback();
  } else {
    emitter.log('This is operation can not be reversed. Please type "confirm" to continue.');
    stdin.addListener('data', action);
  }
};
