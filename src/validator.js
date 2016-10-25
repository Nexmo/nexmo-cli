class Validator {
  constructor(emitter) {
    this.emitter = emitter;
  }

  response(error, response) {
    this.debug(error, response);

    if (error && error.message) {
      this.emitter.error(error.message);
    } else if (error && error['error-code']) {
      this.emitter.error(error['error-code-label']);
    } else if (response['error-code'] && response['error-code'] !== '200') {
      this.emitter.error(response['error-code-label']);
    } else if (response['status'] && response['status'] !== '0') {
      this.emitter.error(response['status_message']);
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
