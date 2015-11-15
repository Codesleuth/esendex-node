import {RequestHandler, RequestHandlerOptions} from './requesthandler'
import {Messages} from './messages'
import {Accounts} from './accounts'
import {Inbox} from './inbox'
import {Batches} from './batches'

export class Client {
  public requesthandler: RequestHandler;
  public messages: Messages;
  public accounts: Accounts;
  public inbox: Inbox;
  public batches: Batches;
  
  constructor(options: RequestHandlerOptions) {
    this.requesthandler = new RequestHandler(options);
    this.messages = new Messages(this);
    this.accounts = new Accounts(this);
    this.inbox = new Inbox(this);
    this.batches = new Batches(this);
  }
}