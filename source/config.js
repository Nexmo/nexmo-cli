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
    let data = readIfPresent();
    data = Object.assign(data, values);
    attemptWrite(data, writeLocal);
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

let readIfPresent = function() {
  try {
    return this.read();
  } catch (e) {
    this.emitter.warn('No existing config found. Writing new config.');
    return {};
  }
};

let attemptWrite = function(data, writeLocal) {
  try {
    this.write(data, writeLocal);
    this.emitter.log(`Credentials written to ${this.writeFilename(writeLocal)}`);
  } catch (e) {
    this.emitter.error(`Could not write credentials to ${this.writeFilename(writeLocal)}. (${e.message})`);
  }
};
