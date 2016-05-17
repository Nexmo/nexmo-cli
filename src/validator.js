class Validator {
  constructor(emitter) {
    this.emitter = emitter;
  }

  response(error, response) {
    this.debug(error, response);

    if (error) {
      this.emitter.error(error.message);
    } else if (response['error-code'] && response['error-code'] !== '200') {
      this.emitter.error(response['error-code-label']);
    }
  }

  debug(error, response) {
    this.emitter.debugger('Validator.response() - Error: ');
    this.emitter.debugger(error);
    this.emitter.debugger('Validator.response() - Response: ');
    this.emitter.debugger(response);
    this.emitter.debugger('End Validator.response()');
  }
}

export default Validator;
