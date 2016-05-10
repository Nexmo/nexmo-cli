class Response {
  constructor(validator, emitter) {
    this.emitter = emitter;
    this.validator = validator;
  }

  accountBalance(error, response) {
    this.validator.response(error, response);
    this.emitter.log(
      response.value,
      `Balance: ${response.value}`
    );
  }

  // numbers

  numbersList(error, response) {
    this.validator.response(error, response);
    if (response.numbers && response.numbers.length > 0) {
      this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'type', 'features']);
    } else {
      this.emitter.warn('No numbers');
    }
  }

  numberSearch(error, response) {
    this.validator.response(error, response);
    if (response.numbers && response.numbers.length > 0) {
      this.emitter.table(response.numbers, ['msisdn'], ['msisdn', 'country', 'cost', 'type', 'features']);
    } else {
      this.emitter.warn('No numbers');
    }
  }

  numberBuy(error, response) {
    this.validator.response(error, response);
    this.emitter.log('Number purchased');

  }

  numberCancel(error, response) {
    this.validator.response(error, response);
    this.emitter.log('Number cancelled');
  }

  numberInsight(callback) {
    return (error, response) => {
      this.validator.response(error, response);
      callback(response);
    };
  }

  // applications

  applicationsList(error, response) {
    this.validator.response(error, response);
    if (response._embedded && response._embedded.applications && response._embedded.applications.length > 0) {
      this.emitter.table(response._embedded.applications, ['id', 'name'], ['id', 'name']);
    } else {
      this.emitter.warn('No applications');
    }
  }

  applicationCreate(error, response) {
    this.validator.response(error, response);
    this.emitter.list(`Application created: ${response.id}`, response);
  }

  applicationShow(error, response) {
    this.validator.response(error, response);
    this.emitter.list(null, response);
  }

  applicationUpdate(error, response) {
    this.validator.response(error, response);
    this.emitter.list(`Application updated: ${response.id}`, response);
  }

  applicationDelete(error, response) {
    this.validator.response(error, response);
    this.emitter.log('Application deleted');
  }
}

export default Response;
