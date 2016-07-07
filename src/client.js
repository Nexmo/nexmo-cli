import Nexmo from 'nexmo';

class Client {
  constructor(config, emitter) {
    this.emitter = emitter;
    this.config = config;
  }

  instance() {
    let nexmo = initialize(this.config, this.emitter);
    return nexmo;
  }

  instanceWith(key, secret) {
    return new Nexmo({apiKey: key, apiSecret: secret});
  }
}

export default Client;

// private methods

let initialize = function(config, emitter) {
  let nexmo = null;
  try {
    let credentials = config.read().credentials;
    nexmo = new Nexmo(
      {
        apiKey: credentials.api_key,
        apiSecret: credentials.api_secret
      },
      {
        debug: emitter.debugging
      }
    );
  } catch(e) {
    if (e instanceof TypeError) {
      emitter.error(`Could not initialize Nexmo library. Please run 'nexmo setup' to setup the CLI correctly. (${e.message})`);
    } else {
      emitter.error(`Could not read credentials. Please run 'nexmo setup' to setup the CLI. (${e.message})`);
    }
  }
  return nexmo;
};
