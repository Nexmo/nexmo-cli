class Validator {
  constructor(emitter) {
    this.emitter = emitter;
  }

  response(error, response) {
    if (error) {
      this.emitter.error(error.message);
    } else if (response['error-code'] && response['error-code'] !== '200') {
      this.emitter.error(response['error-code-label']);
    }
  }
}

export default Validator;
