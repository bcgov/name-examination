declare namespace Cypress {
  interface Chainable<Subject> {
    login(username: string, password: string, host: string, siteminder: string): Chainable<any>;

    logout(host: string): void;

    setid(type: string): Chainable<any>;

    generateUUID(): Chainable<any>;

    cleanGC(): Chainable<any>;
  }
}
