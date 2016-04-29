let quiet;

class Emitter {
  constructor() {
    this.output = console;
    quiet = false;
  }

  silence(_quiet = true) {
    quiet = _quiet;
  }

  setOutput(output) {
    this.output = output;
  }

  emit(level, message) {
    if (level === 'log' && !quiet) {
      this.output.log(message);
    } else if (level === 'warn' && !quiet) {
      this.output.warn(message);
    } else if (level === 'error') {
      this.output.error(message);
    }
  }
}

export default Emitter;
