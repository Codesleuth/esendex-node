import {Client} from './client'
import {XmlParser} from './xmlparser'
import {isArray, format} from 'util'

export declare interface AccountsGetOptions {
  id?: string
}

export declare interface AccountResponse {

}

export declare interface AccountsResponse {

}

export class Accounts {
  private client: Client;
  private parser: XmlParser;
  
  constructor(client: Client) {
    this.client = client;
    this.parser = new XmlParser();
  }

  get(options: AccountsGetOptions, callback: (err: any, response?: AccountResponse | AccountsResponse) => void) {
    let path = '/v1.0/accounts';
  
    let accountId = options && options.id || null;
    if (accountId) {
      path = format('%s/%s', path, accountId);
      delete options.id;
    }
  
    this.client.requesthandler.request('GET', path, options, null, 200, (err, response) => {
      if (err) return callback(err);
  
      this.parser.parseString(response, function (err, result) {
        if (err) return callback(err);
        if (accountId) return callback(null, result.account);
        
        let accounts = result.accounts;
  
        if (!isArray(accounts.account))
          accounts.account = [accounts.account];
  
        callback(null, accounts);
      });
    });
  }
}