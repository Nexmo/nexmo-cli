class Request {
  constructor(config, client, response) {
    this.config   = config;
    this.client   = client;
    this.response = response;
  }

  accountBalance() {
    this.client.instance().checkBalance(this.response.accountBalance.bind(this.response));
  }

  accountSetup(key, secret, options) {
    this.config.putAndSave({
      'credentials': {
        'api_key': key,
        'api_secret': secret
      }
    }, options.local);
  }
}

export default Request;
