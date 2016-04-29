import fs    from 'fs';
import ini   from 'ini';
import nexmo from 'easynexmo';

class Client {
  // returns an initialized Nexmo client
  instance() {
    let credentials = this.credentials();
    nexmo.initialize(
      credentials.api_key,
      credentials.api_secret,
      false
    );
    return nexmo;
  }

  // reads the user credentials from disk
  credentials() {
    return ini.parse(
      fs.readFileSync(
        this.userHome() + '/.nexmo/config', 'utf-8'
      )
    ).credentials;
  }

  // determines the user's HOME
  userHome() {
    let key = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
    return process.env[key];
  }
}

export default Client;
