import * as OS from 'os'
import * as fs from 'fs'
import {resolve} from 'path'

function version() {
  var v = process.version;
  return v[0] === 'v' ? v.substr(1) : v;
}

export class UserAgentBuilder {  
  static Build() {
    let pkg = { version: 'DEV' }
    let pkgconfig = resolve(__dirname, '..', '..', 'package.json');
    if (fs.existsSync(pkgconfig)) {
      pkg = JSON.parse(fs.readFileSync(pkgconfig, 'utf8'))
    }
    return 'esendex-node-sdk/' + pkg.version + '; node/' + version() + ' (' + OS.platform() + '; ' + process.arch + ')';
  }
}
