import Nexmo from 'nexmo';

class Client {
  constructor(config, emitter, appConfig) {
    this.emitter = emitter;
    this.config = config;
    this.appConfig = appConfig;
  }

  instance() {
    let nexmo = initialize(this.config, this.emitter);
    return nexmo;
  }

  definition() {
    return Nexmo;
  }

  instanceWith(key, secret) {
    return new Nexmo({apiKey: key, apiSecret: secret});
  }

  instanceWithApp(appId, privateKey) {
    let nexmo = initialize(this.config, this.emitter, this.appConfig, appId, privateKey);
    return nexmo;
  }
}

export default Client;

// private methods

let initialize = function(config, emitter, appConfig, appId, privateKey) {
  let nexmo = null;
  let packageDetails = require(`${__dirname}/../package.json`);

  try {
    let credentials = config.read().credentials;
    if ((appId && privateKey) || appConfig) {
      let app_config = appConfig.read().app_config;
      nexmo = new Nexmo(
        {
          apiKey: credentials.api_key,
          apiSecret: credentials.api_secret,
          applicationId: appId || app_config.app_id,
          privateKey: privateKey || app_config.private_key
        },
        {
          debug: emitter.debugging,
          appendToUserAgent: `nexmo-cli/${packageDetails.version.replace('v', '')}`
        }
      );
    } else {
      nexmo = new Nexmo(
        {
          apiKey: credentials.api_key,
          apiSecret: credentials.api_secret
        },
        {
          debug: emitter.debugging,
          appendToUserAgent: `nexmo-cli/${packageDetails.version.replace('v', '')}`
        }
      );
    }
  } catch(e) {
    if (e instanceof TypeError) {
      emitter.error(`Could not initialize Nexmo library. Please run 'nexmo setup' to setup the CLI correctly. (${e.message})`);
    } else {
      emitter.error(`Could not read credentials. Please run 'nexmo setup' to setup the CLI. (${e.message})`);
    }
  }
  return nexmo;
};
