class Emitter {
  constructor() {
    this.silenced = false;
    this.amplified = false;
  }

  quiet(silenced = true) {
    this.silenced = silenced;
  }

  verbose(amplified = true) {
    this.amplified = amplified;
  }

  log(message, amplified_message) {
    if (this.amplified && amplified_message) message = amplified_message;
    if (!this.silenced && message) console.log(message); // eslint-disable-line no-console
  }

  warn(message) {
    if (!this.silenced) console.warn(message); // eslint-disable-line no-console
  }

  error(message) {
    console.error(message); // eslint-disable-line no-console
    process.exit(1);
  }

  table(data, regular_keys, verbose_keys) {
    let keys = this.amplified ? verbose_keys : regular_keys;
    let records = mapRecords(data, keys);
    if (this.amplified) { records.unshift(keys); }
    let lengths = valueLengths(records);

    records.forEach((record, row) => {
      let message = formatMessage(record, lengths);
      this.log(message);
      if (row == 0 && this.amplified) this.log(pad('', message.length, '-'));
    });
  }
}

export default Emitter;

let pad = function(string = '', size = 0, padding = ' ') {
  if (string.length >= size) { return string; }

  var max = size - string.length;
  for (var i = 0; i < max; i++) {
    string += padding;
  }

  return string;
};

let mapRecords = function(records, keys) {
  return records.map((record) => {
    let mappedRecord = keys.map((key) => {
      return `${record[key]}`;
    });
    return mappedRecord;
  });
};

let valueLengths = function(records) {
  let lengths = [];
  records.forEach((record) => {
    record.forEach((value, index) => {
      lengths[index] = Math.max(lengths[index] || 0, value.length);
    });
  });
  return lengths;
};

let formatMessage = function(record, lengths) {
  return record.reduce((previous, current, index) => {
    if (index == 1) { previous = pad(previous, lengths[index-1]); }
    return `${previous} | ${pad(current, lengths[index])}`;
  });
};
