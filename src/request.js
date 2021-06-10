import readline from 'readline';
import fs from 'fs';

class Request {
  constructor(config, appConfig, client, response, emitter) {
    this.config = config;
    this.client = client;
    this.response = response;
    this.appConfig = appConfig;
    this.emitter = emitter;
  }
  // Account

  accountSetup(key, secret, flags) {
    this._verifyCredentials(key, secret, this.response.accountSetup(this.config, key, secret, flags).bind(this.response));
  }

  _verifyCredentials(key, secret, callback) {
    const client = this.client.instanceWith(key, secret);
    client.account.checkBalance(callback);
  }

  accountInfo() {
    this.response.accountInfo(this.client.instance());
  }

  accountBalance() {
    this.client.instance().account.checkBalance(this.response.accountBalance.bind(this.response));
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

  priceCountry(country_code) {
    this.client.instance().number.getPricing(country_code, this.response.priceCountry.bind(this.response));
  }

  // Numbers

  numbersList(flags) {
    const options = {
      size: 100
    };
    if (flags.page) {
      options.index = flags.page;
    }
    if (flags.size) {
      options.size = flags.size;
    }

    if (flags.pattern) {
      options.pattern = flags.pattern;
      options.search_pattern = 1;
      if (options.pattern[0] === '*') options.search_pattern = 2;
      if (options.pattern.slice(-1) === '*') options.search_pattern = 0;
    }

    this.client.instance().number.get(options, this.response.numbersList(flags).bind(this.response));
  }

  numberSearch(country_code, flags) {
    country_code = country_code.toUpperCase();

    const options = {
      features: [],
      size: 100
    };
    if (flags.voice) {
      options.features.push('VOICE');
    }
    if (flags.sms) {
      options.features.push('SMS');
    }
    if (flags.page) {
      options.index = flags.page;
    }
    if (flags.size) {
      options.size = flags.size;
    }

    if (flags.pattern) {
      options.pattern = flags.pattern;
      options.search_pattern = 1;
      if (options.pattern[0] === '*') options.search_pattern = 2;
      if (options.pattern.slice(-1) === '*') options.search_pattern = 0;
    }

    this.client.instance().number.search(country_code, options, this.response.numberSearch(flags).bind(this.response));
  }

  numberBuy(numberOrPattern, command) {
    if (command.country_code) {
      this.numberBuyFromSearch(command.country_code, numberOrPattern, command);
    } else {
      this.numberBuyFromNumber(numberOrPattern, command);
    }
  }

  numberBuyFromNumber(number, flags) {
    number = stripPlus(number);
    confirm(`Buying ${number}. This operation will charge your account.`, this.response.emitter, flags, () => {
      this.getCountryCode(number, flags, (country_code) => {
        this.client.instance().number.buy(country_code, number, this.response.numberBuyFromNumber(number).bind(this.response));
      });
    });
  }

  numberBuyFromSearch(country_code, pattern, flags) {
    const options = {
      features: ['VOICE']
    };

    if (pattern) {
      options.pattern = pattern;
      options.search_pattern = 1;
      if (pattern[0] === '*') options.search_pattern = 2;
      if (pattern.slice(-1) === '*') options.search_pattern = 0;
    }

    this.client.instance().number.search(country_code, options, this.response.numberBuyFromPattern((number) => {
      this.numberBuyFromNumber(number, flags);
    }));
  }

  numberCancel(number, flags) {
    confirm('This operation can not be reversed.', this.response.emitter, flags, () => {
      this.getCountryCode(number, flags, (country_code) => {
        this.client.instance().number.cancel(country_code, number, this.response.numberCancel(number).bind(this.response));
      });
    });
  }

  // Applications

  _createApplicationPayload(name, flags) {
    const capabilities = flags.capabilities.split(",");
    if (flags.improveAi === "undefined") flags.improveAi = true;
    const payload = {
      name: name,
      capabilities: {},
      privacy: {improve_ai: flags.improveAi}
    };

    if (flags.publicKeyfile) {
      if (flags.keyfile) {
        this.emitter.error("You can't use --keyfile and --public-keyfile at the same time.");
      }
      try {
        payload.keys = {
          public_key: fs.readFileSync(flags.publicKeyfile).toString()
        };
      } catch (e) {
        const error = e.code === "ENOENT" ? `Can't find your public key: ${e.path}` : e;
        this.emitter.error(error);
      }
    }

    capabilities.forEach(capability => {
      switch (capability) {
      case "vbc":
        payload.capabilities.vbc = {};
        break;

      case "voice":
        if (!flags.voiceAnswerUrl) {
          this.emitter.error("--voice-answer-url is a required flag.");
        }
        if (!flags.voiceEventUrl) {
          this.emitter.error("--voice-event-url is a required flag.");
        }
        payload.capabilities.voice = {
          webhooks: {
            answer_url: {
              address: flags.voiceAnswerUrl,
              http_method: flags.voiceAnswerMethod || "GET"
            },
            fallback_answer_url: {
              address: flags.voiceFallbackAnswerUrl || "",
              http_method: flags.voiceFallbackAnswerMethod || "GET"
            },
            event_url: {
              address: flags.voiceEventUrl,
              http_method: flags.voiceEventMethod || "POST"
            }
          }
        };
        break;

      case "messages":
        if (!flags.messagesInboundUrl) {
          this.emitter.error("--messages-inbound-url is a required flag.");
        }
        if (!flags.messagesStatusUrl) {
          this.emitter.error("--messages-status-url is a required flag.");
        }
        payload.capabilities.messages = {
          webhooks: {
            inbound_url: {
              address: flags.messagesInboundUrl,
              http_method: "POST"
            },
            status_url: {
              address: flags.messagesStatusUrl,
              http_method: "POST"
            }
          }
        };
        break;

      case "rtc":
        if (!flags.rtcEventUrl) {
          this.emitter.error("--rtc-event-url is a required flag.");
        }
        payload.capabilities.rtc = {
          webhooks: {
            event_url: {
              address: flags.rtcEventUrl,
              http_method: flags.rtcEventMethod || "POST"
            }
          }
        };
        break;

      case "":
        break;


      default:
        this.emitter.error(`Unsupported capability: ${capability}`);
      }
    });

    return payload;
  }

  applicationsList(flags) {
    const options = {
      page_size: 100
    };
    if (flags.page) {
      options.index = flags.page;
    }
    if (flags.size) {
      options.page_size = flags.size;
    }

    this.client.instance().applications.get(options, this.response.applicationsList(flags).bind(this.response), flags.v2);
  }

  applicationCreate(name, answer_url, event_url, flags) {
    if (typeof flags.capabilities !== "undefined") {
      const payload = this._createApplicationPayload(name, flags);
      this.client.instance().applications.create(payload, this.response.applicationCreate(flags, this.appConfig));
    } else {
      const options = {};
      if (flags.answer_method) {
        options.answer_method = flags.answer_method;
      }
      if (flags.event_method) {
        options.event_method = flags.event_method;
      }

      let type = flags.type;

      switch (flags.type) {
      case "messages":
        options.inbound_url = answer_url;
        options.status_url = event_url;
        break;
      case "artc":
        type = "rtc";
        break;
      default:
      }

      this.client.instance().applications.create(name, type, answer_url, event_url, options, this.response.applicationCreate(flags, this.appConfig));
    }
  }

  applicationShow(app_id, flags) {
    this.client.instance().applications.get(app_id, this.response.applicationShow(flags).bind(this.response), flags.v2 || flags.recreate);
  }

  applicationSetup(app_id, private_key, flags) {
    this._verifyApplication(app_id, private_key, this.response.applicationSetup(this.appConfig, app_id, private_key, flags).bind(this.response));
  }

  _verifyApplication(app_id, private_key, callback) {
    const client = this.client.instanceWithApp(app_id, private_key);
    client.applications.get(app_id, callback);
  }

  applicationUpdate(app_id, name, answer_url, event_url, flags) {
    if (typeof flags.capabilities !== "undefined") {
      const payload = this._createApplicationPayload(name, flags);

      this.client.instance().applications.update(app_id, payload, this.response.applicationUpdate.bind(this.response));
    } else {
      const options = {};
      if (flags.answer_method) {
        options.answer_method = flags.answer_method;
      }
      if (flags.event_method) {
        options.event_method = flags.event_method;
      }

      let type = flags.type;

      switch (flags.type) {
      case "messages":
        options.inbound_url = answer_url;
        options.status_url = event_url;
        break;
      case "artc":
        type = "rtc";
        break;
      default:
      }

      this.client.instance().applications.update(app_id, name, type, answer_url, event_url, options, this.response.applicationUpdate.bind(this.response));
    }
  }

  applicationDelete(app_id, flags) {
    return confirm('This operation can not be reversed.', this.response.emitter, flags, () => {
      this.client.instance().applications.delete(app_id, this.response.applicationDelete.bind(this.response));
    });
  }

  applicationNumbers(app_id, flags) {
    const options = {};
    if (flags.page) {
      options.index = flags.page;
    }
    if (flags.size) {
      options.size = flags.size;
    }

    app_id = this.client.instance().applications.get({}, this.response.searchByPartialAppId(app_id).bind(this.response));
    this.client.instance().number.get(options, this.response.applicationNumbers(app_id, flags).bind(this.response));
  }

  // links

  linkApp(number, app_id, flags) {
    this._link(number, flags, null, 'app', app_id);
  }

  linkSms(number, callback_url, flags) {
    this._link(number, flags, callback_url, 'sms', null);
  }

  linkTel(number, other_number, flags) {
    this._link(number, flags, null, 'tel', other_number, flags.voice_status_callback);
  }

  linkSip(number, sip_uri, flags) {
    this._link(number, flags, null, 'sip', sip_uri, flags.voice_status_callback);
  }

  unlinkApp(number, flags) {
    this._link(number, flags, null, 'app');
  }

  unlinkSms(number, flags) {
    this._link(number, flags, '', 'sms');
  }

  unlinkTel(number, flags) {
    this._link(number, flags, null, 'tel');
  }

  unlinkSip(number, flags) {
    this._link(number, flags, null, 'sip');
  }

  numberUpdate(number, flags) {
    number = stripPlus(number);
    this.getCountryCode(number, flags, (country_code) => {
      const options = {};
      if (flags.mo_http_url) options.moHttpUrl = flags.mo_http_url;
      if (flags.voice_callback_type) options.voiceCallbackType = flags.voice_callback_type;
      if (flags.voice_callback_value) options.voiceCallbackValue = flags.voice_callback_value;
      if (flags.voice_status_callback) options.voiceStatusCallback = flags.voice_status_callback;
      this.client.instance().number.update(country_code, number, options, this.response.numberUpdate.bind(this.response));
    });
  }

  _link(number, flags, mo_http_url, voice_callback_type, voice_callback_value, voice_status_callback) {
    if (flags == null) {
      flags = {};
    }
    number = stripPlus(number);
    this.getCountryCode(number, flags, (country_code) => {
      const options = {};

      if (voice_callback_type == 'sms') {
        options.moHttpUrl = mo_http_url;
      } else {
        options.voiceCallbackType = voice_callback_type;
        if (voice_callback_value) options.voiceCallbackValue = voice_callback_value;
        if (voice_status_callback) options.voiceStatusCallback = voice_status_callback;
      }

      this.client.instance().number.update(country_code, number, options, this.response.numberUpdate.bind(this.response));
    });
  }

  // Insight

  insightBasic(number) {
    number = stripPlus(number);
    this.client.instance().numberInsight.get({
      level: 'basic',
      number: number
    }, this.response.insightBasic.bind(this.response));
  }

  insightStandard(number, flags) {
    number = stripPlus(number);
    confirm('This operation will charge your account.', this.response.emitter, flags, () => {
      this.client.instance().numberInsight.get({
        level: 'standard',
        number: number
      }, this.response.insightStandard.bind(this.response));
    });
  }

  insightAdvanced(number, flags) {
    number = stripPlus(number);
    confirm('This operation will charge your account.', this.response.emitter, flags, () => {
      this.client.instance().numberInsight.get({
        level: 'advancedSync',
        number: number
      }, this.response.insightStandard.bind(this.response));
    });
  }

  // sending messages

  sendSms(to, text, flags) {
    confirm('This operation will charge your account.', this.response.emitter, flags, () => {
      this.client.instance().message.sendSms(flags.from, to, text.join(' '), this.response.sendSms.bind(this.response));
    });
  }

  generateJwt(privateKey, claims, flags) {
    let token = null;
    let error = null;

    try {
      const fullClaims = {};
      if (flags.app_id) {
        fullClaims['application_id'] = flags.app_id;
      }

      if (privateKey && privateKey.includes("=")) {
        claims.push(privateKey);
        privateKey = null;
      }

      claims.forEach((claim) => {
        const nameValue = claim.split('=');
        if (nameValue.length !== 2) {
          throw new Error('All claims must be in the form `name=value`. Got: ' + nameValue);
        }
        // Using JSON.parse to cast 'exp' to number
        if (nameValue[0] === 'acl' || nameValue[0] === 'exp') {
          try {
            fullClaims[nameValue[0]] = JSON.parse(nameValue[1]);
          } catch (e) {
            fullClaims[nameValue[0]] = nameValue[1];
          }
        } else {
          fullClaims[nameValue[0]] = nameValue[1];
        }

      });

      if (privateKey) {
        token = this.client.definition().generateJwt(privateKey, fullClaims);
      } else {
        token = this.client.instanceWithApp().generateJwt(fullClaims);
      }

    } catch (ex) {
      error = ex;
    }
    this.response.generateJwt(error, token);
  }

  conversationCreate(payload) {
    this.client.instanceWithApp().conversations.create(createPayload(payload), this.response.conversationCreate.bind(this.response));
  }

  userCreate(payload) {
    this.client.instanceWithApp().users.create(createPayload(payload), this.response.userCreate.bind(this.response));
  }

  memberList(conversation_id) {
    this.client.instanceWithApp().conversations.members.get(conversation_id, {}, this.response.memberList.bind(this.response));
  }

  memberAdd(conversation_id, payload) {
    this.client.instanceWithApp().conversations.members.add(conversation_id, createPayload(payload), this.response.memberAdd.bind(this.response));
  }

  getCountryCode(number, flags, callback) {
    if (flags.country_code) {
      callback(flags.country_code);
    } else {
      this.client.instance().numberInsight.get({
        level: 'basic',
        number: number
      }, this.response.numberInsight((response) => {
        callback(response.country_code);
      }));
    }
  }
}

export default Request;

// private methods

const createPayload = function(payload) {
  const finalPayload = {};

  payload.forEach((p) => {
    const nameValue = p.split('=');
    if (nameValue.length !== 2) {
      throw new Error('All payloads must be in the form `name=value`. Got: ' + nameValue);
    }

    try {
      finalPayload[nameValue[0]] = JSON.parse(nameValue[1]);
    } catch (e) {
      finalPayload[nameValue[0]] = nameValue[1];
    }
  });

  return finalPayload;
};

const confirm = function(message, emitter, flags, callback) {
  if (flags.confirm) {
    callback();
  } else {
    const cli = readline.createInterface(process.stdin, process.stdout);
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

const stripPlus = function(number) {
  if (!number) {
    return number;
  }
  while (number.charAt(0) === '+') {
    number = number.substr(1);
  }
  return number;
};
