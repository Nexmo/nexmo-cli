import Emitter    from './emitter';
import Validator  from './validator';

class Response {
  constructor() {
    this.emitter = new Emitter();
    this.validator = new Validator();
  }

  setEmitter(emitter) {
    this.emitter = emitter;
  }

  setValidator(validator) {
    this.validator = validator;
  }

  accountBalance(error, response) {
    this.validator.response(error, response);
    this.emitter.emit("log", response.value);
  }
}

export default Response;
