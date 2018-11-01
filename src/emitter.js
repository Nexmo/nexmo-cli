class Emitter {
  constructor() {
    this.silenced = false;
    this.amplified = false;
    this.debugging = false;
  }

  quiet(silenced = true) {
    this.silenced = silenced;
  }

  verbose(amplified = true) {
    this.amplified = amplified;
  }

  debug(debugging = true) {
    this.debugging = debugging;
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

  debugger(message) {
    if (this.debugging) { console.log(message); } // eslint-disable-line no-console
  }

  table(data, regular_keys, verbose_keys) {
    const keys = this.amplified ? verbose_keys : regular_keys;
    const records = mapRecords(data, keys);
    if (this.amplified) { records.unshift(keys); }
    const lengths = valueLengths(records);

    records.forEach((record, row) => {
      const message = formatMessage(record, lengths);
      this.log(message);
      if (row == 0 && this.amplified) this.log(right('', message.length, '-'));
    });
  }

  list(message, verbose_data) {
    if (this.amplified || !message) {
      const message = formatList(verbose_data);
      this.log(message);
    } else {
      this.log(message);
    }
  }

  pagination(flags, data) {
    const page  = parseInt(flags.page || 1);
    const size  = parseInt(flags.size || 100);
    const total = data.count;
    const start = size*(page-1) + 1;
    const end   = Math.min(start + size - 1, total);

    if (this.amplified) this.log(`Item ${start}-${end} of ${total}\n`);
  }
}

export default Emitter;

const right = function(string = '', size = 0, padding = ' ') {
  if (string.length >= size) { return string; }

  var max = size - string.length;
  for (var i = 0; i < max; i++) {
    string += padding;
  }

  return string;
};

const mapRecords = function(records, keys) {
  return records.map((record) => {
    const mappedRecord = keys.map((key) => {
      return `${record[key]}`;
    });
    return mappedRecord;
  });
};

const valueLengths = function(records) {
  const lengths = [];
  records.forEach((record) => {
    record.forEach((value, index) => {
      lengths[index] = Math.max(lengths[index] || 0, value.length);
    });
  });
  return lengths;
};

const formatMessage = function(record, lengths) {
  return record.reduce((previous, current, index) => {
    if (index == 1) { previous = right(previous, lengths[index-1]); }
    return `${previous} | ${right(current, lengths[index])}`;
  });
};

  let message = '';
  for (let key in data) {
    let value = data[key];
const formatList = function(data = {}, prefix = '') {
    if (typeof(value) === 'object') {
      message += formatList(value, prefix+key+'.');
    } else {
      message += `[${prefix}${key}]\n`;
      message += `${data[key]}\n\n`;
    }
  }
  return message;
};
