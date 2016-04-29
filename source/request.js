import Client     from './client';
import Response   from './response'

class Request {
  constructor() {
    this.response = new Response();
    this.client = new Client().instance();
  }

  setClient(client) {
    this.client = client;
  }

  setResponse(response) {
    this.response = response;
  }

  accountBalance() {
    this.client.checkBalance(this.response.accountBalance.bind(this.response));
  }
}

export default Request;
