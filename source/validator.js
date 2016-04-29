class Validator {
  constructor(emitter) {
    this.emitter = emitter;
  }

  response(error, response) {
    if (error) {
      this.emitter.error(error);
    } else if (response['error-code']) {
      this.emitter.error(response['error-code-label']);
    }
  }
}

export default Validator;
