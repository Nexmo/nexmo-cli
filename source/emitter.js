class Emitter {
  constructor() {
    this.quiet = false;
  }

  silence(quiet = true) {
    this.quiet = quiet;
  }

  log(message) {
    if (!this.quiet) console.log(message); // eslint-disable-line no-console
  }

  warn(message) {
    if (!this.quiet) console.warn(message); // eslint-disable-line no-console
  }

  error(message) {
    console.error(message); // eslint-disable-line no-console
    process.exit(1);
  }
}

export default Emitter;
