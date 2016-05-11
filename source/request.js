import readline from 'readline';

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

  numberSearch(country_code, flags) {
    country_code = country_code.toUpperCase();

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

    this.client.instance().searchNumbers(country_code, options, this.response.numberSearch.bind(this.response));
  }

  numberBuy(msisdn, flags) {
    confirm('This operation will charge your account.', this.response.emitter, flags, () => {
      this.client.instance().numberInsightBasic(msisdn, this.response.numberInsight((response) => {
        this.client.instance().buyNumber(response.country_code, msisdn, this.response.numberBuy.bind(this.response));
      }));
    });
  }

  numberCancel(msisdn, flags) {
    confirm('This operation can not be reversed.', this.response.emitter, flags, () => {
      this.client.instance().numberInsightBasic(msisdn, this.response.numberInsight((response) => {
        this.client.instance().cancelNumber(response.country_code, msisdn, this.response.numberCancel.bind(this.response));
      }));
    });
  }

  // Applications

  applicationsList(flags) {
    let options = {};
    if (flags.page) { options.index = flags.page; }
    if (flags.size) { options.size = flags.size; }

    this.client.instance().getApplications(options, this.response.applicationsList.bind(this.response));
  }

  applicationCreate(name, answer_url, event_url, flags) {
    let options = {};
    if (flags.answer_method) { options.answer_method = flags.answer_method; }
    if (flags.event_method) { options.event_method = flags.event_method; }

    this.client.instance().createApplication(name, flags.type, answer_url, event_url, options, this.response.applicationCreate.bind(this.response));
  }

  applicationShow(app_id) {
    this.client.instance().getApplication(app_id, this.response.applicationShow.bind(this.response));
  }

  applicationUpdate(app_id, name, answer_url, event_url, flags) {
    let options = {};
    if (flags.answer_method) { options.answer_method = flags.answer_method; }
    if (flags.event_method) { options.event_method = flags.event_method; }

    this.client.instance().updateApplication(app_id, name, flags.type, answer_url, event_url, options, this.response.applicationUpdate.bind(this.response));
  }

  applicationDelete(app_id, flags) {
    return confirm('This operation can not be reversed.', this.response.emitter, flags, () => {
      this.client.instance().deleteApplication(app_id, this.response.applicationDelete.bind(this.response));
    });
  }

  // links

  linkCreate(msisdn, app_id) {
    this.client.instance().numberInsightBasic(msisdn, this.response.numberInsight((response) => {
      let options = { voiceCallbackType: 'app', voiceCallbackValue: app_id };
      this.client.instance().updateNumber(response.country_code, msisdn, options, this.response.linkCreate.bind(this.response));
    }));
  }

  linkDelete(msisdn) {
    this.client.instance().numberInsightBasic(msisdn, this.response.numberInsight((response) => {
      let options = { voiceCallbackType: 'app' };
      this.client.instance().updateNumber(response.country_code, msisdn, options, this.response.linkDelete.bind(this.response));
    }));
  }
}

export default Request;

// private methods

let confirm = function(message, emitter, flags, callback) {
  if (flags.confirm) {
    callback();
  } else {
    let cli = readline.createInterface(process.stdin, process.stdout);
    cli.question(message + '\n\nPlease type "confirm" to continue: ', (answer) => {
      if (answer.toString().trim() == 'confirm') {
        emitter.log(' ');
        callback();
      } else {
        process.exit(1);
      }

      cli.close();
      process.stdin.destroy();
    });
  }
};
