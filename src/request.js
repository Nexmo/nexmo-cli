import readline from 'readline';

class Request {
  constructor(config, client, response) {
    this.config   = config;
    this.client   = client;
    this.response = response;
  }
  // Account

  accountBalance() {
    this.client.instance().account.checkBalance(this.response.accountBalance.bind(this.response));
  }

  accountSetup(key, secret, flags) {
    this.config.putAndSave({
      'credentials': {
        'api_key': key,
        'api_secret': secret
      }
    }, flags.local);
  }

  // Pricing

  priceSms(number) {
    number = stripPlus(number);
    this.client.instance().number.getPhonePricing('sms', number, this.response.priceSms.bind(this.response));
  }

  priceVoice(number) {
    number = stripPlus(number);
    this.client.instance().number.getPhonePricing('voice', number, this.response.priceVoice.bind(this.response));
  }

  priceCountry(country_id) {
    this.client.instance().number.getPricing(country_id, this.response.priceCountry.bind(this.response));
  }

  // Numbers

  numbersList(flags) {
    let options = {};
    if (flags.page) { options.index = flags.page; }
    if (flags.size) { options.size = flags.size; }

    this.client.instance().number.get(options, this.response.numbersList.bind(this.response));
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

    this.client.instance().number.search(country_code, options, this.response.numberSearch.bind(this.response));
  }

  numberBuy(first, command) {
    let args = command.parent.rawArgs.filter(arg => (arg.indexOf('--') == -1 && arg.indexOf('nexmo') == -1 && arg.indexOf('node') == -1));
    if (args.length == 2) {
      this.numberBuyFromNumber(args[1], command);
    } else if (args.length == 3) {
      this.numberBuyFromPattern(args[1], args[2], command);
    }
  }

  numberBuyFromNumber(number, flags) {
    number = stripPlus(number);
    confirm(`Buying ${number}. This operation will charge your account.`, this.response.emitter, flags, () => {
      this.client.instance().numberInsight.get({level:'basic', number: number}, this.response.numberInsight((response) => {
        this.client.instance().number.buy(response.country_code, number, this.response.numberBuyFromNumber.bind(this.response));
      }));
    });
  }

  numberBuyFromPattern(country_code, pattern, flags) {
    let options = { features: ['VOICE'] };

    options.pattern = pattern;
    options.search_pattern = 1;
    if (pattern[0] === '*') options.search_pattern = 2;
    if (pattern.slice(-1) === '*') options.search_pattern = 0;

    this.client.instance().number.search(country_code, options, this.response.numberBuyFromPattern((number) => {
      this.numberBuyFromNumber(number, flags);
    }));
  }

  numberCancel(number, flags) {
    confirm('This operation can not be reversed.', this.response.emitter, flags, () => {
      this.client.instance().numberInsight.get({level: 'basic', number: number}, this.response.numberInsight((response) => {
        this.client.instance().number.cancel(response.country_code, number, this.response.numberCancel.bind(this.response));
      }));
    });
  }

  // Applications

  applicationsList(flags) {
    let options = {};
    if (flags.page) { options.index = flags.page; }
    if (flags.size) { options.size = flags.size; }

    this.client.instance().app.get(options, this.response.applicationsList.bind(this.response));
  }

  applicationCreate(name, answer_url, event_url, flags) {
    let options = {};
    if (flags.answer_method) { options.answer_method = flags.answer_method; }
    if (flags.event_method) { options.event_method = flags.event_method; }

    this.client.instance().app.create(name, flags.type, answer_url, event_url, options, this.response.applicationCreate(flags));
  }

  applicationShow(app_id) {
    this.client.instance().app.get(app_id, this.response.applicationShow.bind(this.response));
  }

  applicationUpdate(app_id, name, answer_url, event_url, flags) {
    let options = {};
    if (flags.answer_method) { options.answer_method = flags.answer_method; }
    if (flags.event_method) { options.event_method = flags.event_method; }

    this.client.instance().app.update(app_id, name, flags.type, answer_url, event_url, options, this.response.applicationUpdate.bind(this.response));
  }

  applicationDelete(app_id, flags) {
    return confirm('This operation can not be reversed.', this.response.emitter, flags, () => {
      this.client.instance().app.delete(app_id, this.response.applicationDelete.bind(this.response));
    });
  }

  // links

  linkApp(number, app_id) {
    this._link(number, null, 'app', app_id);
  }

  linkSms(number, callback_url) {
    this._link(number, callback_url, 'sms', null);
  }

  linkTel(number, other_number, flags) {
    this._link(number, null, 'tel', other_number, flags.voice_status_callback);
  }

  linkSip(number, sip_uri, flags) {
    this._link(number, null, 'sip', sip_uri, flags.voice_status_callback);
  }

  linkVxml(number, calback_url, flags) {
    this._link(number, null, 'vxml', calback_url, flags.voice_status_callback);
  }

  unlinkApp(number) {
    this._link(number, null, 'app');
  }

  unlinkSms(number) {
    this._link(number, '', 'sms');
  }

  unlinkTel(number) {
    this._link(number, null, 'tel');
  }

  unlinkSip(number) {
    this._link(number, null, 'sip');
  }

  unlinkVxml(number) {
    this._link(number, null, 'vxml');
  }

  numberUpdate(number, flags) {
    number = stripPlus(number);
    this.client.instance().numberInsight.get({level:'basic', number: number}, this.response.numberInsight((response) => {
      let options = {};
      if (flags.mo_http_url) options.moHttpUrl = flags.mo_http_url;
      if (flags.voice_callback_type) options.voiceCallbackType = flags.voice_callback_type;
      if (flags.voice_callback_value) options.voiceCallbackValue = flags.voice_callback_value;
      if (flags.voice_status_callback) options.voiceStatusCallback = flags.voice_status_callback;
      this.client.instance().number.update(response.country_code, number, options, this.response.numberUpdate.bind(this.response));
    }));
  }

  _link(number, mo_http_url, voice_callback_type, voice_callback_value, voice_status_callback) {
    number = stripPlus(number);
    this.client.instance().numberInsight.get({level: 'basic', number: number}, this.response.numberInsight((response) => {
      let options = {};

      if (voice_callback_type == 'sms') {
        options.moHttpUrl = mo_http_url;
      } else {
        options.voiceCallbackType = voice_callback_type;
        if (voice_callback_value) options.voiceCallbackValue = voice_callback_value;
        if (voice_status_callback) options.voiceStatusCallback = voice_status_callback;
      }

      this.client.instance().number.update(response.country_code, number, options, this.response.numberUpdate.bind(this.response));
    }));
  }

  // Insight

  insightBasic(number) {
    number = stripPlus(number);
    this.client.instance().numberInsight.get({level: 'basic', number: number}, this.response.insightBasic.bind(this.response));
  }

  insightStandard(number, flags) {
    number = stripPlus(number);
    confirm('This operation will charge your account.', this.response.emitter, flags, () => {
      this.client.instance().numberInsight.get({level: 'standard', number: number}, this.response.insightStandard.bind(this.response));
    });
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

let stripPlus = function(number) {
  if (!number) { return number; }
  while(number.charAt(0) === '+') {
    number = number.substr(1);
  }
  return number;
};
