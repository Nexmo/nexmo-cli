import fs      from 'fs';
import ini     from 'ini';

class Config {
  constructor(emitter) {
    this.emitter = emitter;
  }

  read() {
    return ini.parse(
      fs.readFileSync(this.readFilename(), 'utf-8')
    );
  }

  write(data, local=false) {
    fs.writeFileSync(
      this.writeFilename(local),
      ini.stringify(data)
    );
  }

  authenticated() {
    try {
      fs.readFileSync(this.readFilename(), 'utf-8');
      return true;
    } catch (err) {
      return false;
    }
  }

  readFilename() {
    let filename = localFile();
    if (fs.existsSync(filename)) {
      return filename;
    } else {
      return homeFile();
    }
  }

  writeFilename(local=false) {
    if (local) { return localFile(); }
    else { return homeFile(); }
  }

  putAndSave(values, writeLocal=false) {
    let data = {};

    try {
      data = this.read();
    } catch (e) {
      this.emitter.warn('No existing config found. Writing to new file.');
    }

    for (let group in values) {
      let group_vals = values[group];
      for (let key in group_vals) {
        if (data[group] == undefined) { data[group] = {}; }
        data[group][key] = group_vals[key];
      }
    }

    try {
      this.write(data, writeLocal);
      this.emitter.log(`Credentials written to ${this.writeFilename(writeLocal)}`);
    } catch (e) {
      this.emitter.error(`Could not write credentials to ${this.writeFilename(writeLocal)}. (${e.message})`);
    }
    return data;
  }
}

export default Config;

// private methods

let localFile = function() {
  return `${process.cwd()}/.nexmorc`;
};

let homeFile = function() {
  let key = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return `${process.env[key]}/.nexmorc`;
};
