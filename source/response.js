import Validator  from './validator';

class Response {
  constructor(emitter) {
    this.emitter = emitter;
    this.validator = new Validator(emitter);
  }

  accountBalance(error, response) {
    this.validator.response(error, response);
    this.emitter.log(response.value);
  }
}

export default Response;
