import nexmo from 'easynexmo';

class Client {
  constructor(config, emitter) {
    this.emitter = emitter;
    this.config = config;
  }

  instance() {
    initialize(this.config, this.emitter);
    return nexmo;
  }
}

export default Client;

// private methods

let initialize = function(config, emitter) {
  try {
    let credentials = config.read().credentials;
    nexmo.initialize(credentials.api_key, credentials.api_secret);
  } catch(e) {
    if (e instanceof TypeError) {
      emitter.error(`Could not initialize Nexmo SDK. Please run 'nexmo setup' to setup the CLI correctly. (${e.message})`);
    } else {
      emitter.error(`Could not read credentials from ${config.readFilename()}. Please run 'nexmo setup' to setup the CLI. (${e.message})`);
    }
  }
};
