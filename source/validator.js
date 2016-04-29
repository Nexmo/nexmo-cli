import Emitter from './emitter';

class Validator {
  constructor() {
    this.emitter = new Emitter();
  }

  setEmitter(emitter) {
    this.emitter = emitter;
  }

  response(error, response) {
    if (error) {
      this.emitter.emit("error", error);
    } else if (response["error-code"]) {
      this.emitter.emit("error", response["error-code-label"]);
    }
  }
}

export default Validator;
