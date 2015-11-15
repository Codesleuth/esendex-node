declare module Sinon {
  interface SinonAssert {
    calledWithNew(spy: SinonSpy, ...args: any[]): void;
  }
}