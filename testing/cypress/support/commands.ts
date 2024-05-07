/// <reference types="@testing-library/cypress" />

import 'cypress-plugin-api';
import 'cypress-real-events';
import '@testing-library/cypress/add-commands';
import HomePage from '../pageObjects/homePage';

Cypress.Commands.add('login', (username, password, host, siteminder) => {
  const home = new HomePage();

  // Go to the host
  cy.visit(host || Cypress.env('host'));

  /*   // Validate the host
    if (Cypress.env('localtest')) {
      cy.wait(5000);
    }
    cy.get('h1', { timeout: 10000 }).eq(0).contains('Common Hosted Single Sign-on (CSS)');
    // Click the login button
    home.clickLoginButton(); */

  // Validate the login proxy only when we are not targeting a local install
  if (Cypress.env('host') != 'http://localhost:3000') {
    cy.get('#kc-header-wrapper', { timeout: 10000 }).contains('bcregistry').should('be.visible');
    cy.get('#social-idir', { timeout: 10000 }).click();
  }

  // Validate siteminder and login
  cy.get('#login-to', { timeout: 10000 }).contains('Log in to ').should('be.visible');
  cy.get('#user', { timeout: 10000 }).type(username || Cypress.env('username'));
  cy.get('#password', { timeout: 10000 }).type(password || Cypress.env('password'), { log: false });
  cy.get('input[name=btnSubmit]', { timeout: 10000 }).click();
  cy.wait(3000);

  /*   if (Cypress.env('localtest')) {
      cy.wait(5000);
    }
    cy.get('h1', { timeout: 10000 }).eq(0).contains('Common Hosted Single Sign-on (CSS)');
    cy.get('button', { timeout: 10000 }).contains('Log out').should('be.visible');
  
    cy.log('Logged in as ' + (username || Cypress.env('username'))); */
});

Cypress.Commands.add('logout', (host) => {
  // Make sure you are on page with log out and logout
  cy.get('#app-header', { timeout: 10000 }).within(() => {
    cy.contains('a', 'Log Out').click();
  });
});

Cypress.Commands.add('setid', (type?) => {
  // Set the ID/PW Env vars to default if type not passed in
  if (!type) {
    type = 'default';
  }
  const data = Cypress.env('users');

  let foundItem = data.find((item) => item.type === type);
  Cypress.env('username', foundItem.username);
  Cypress.env('password', foundItem.password);
  Cypress.env('type', foundItem.type);
  if (foundItem.otpsecret) {
    Cypress.env('otpsecret', foundItem.otpsecret);
  }
});

Cypress.Commands.add('cleanGC', () => {
  // Clean up memory by triggering Garbage Collection
  cy.window().then((win) => {
    // window.gc is enabled with --js-flags=--expose-gc chrome flag
    if (typeof win.gc === 'function') {
      // run gc multiple times in an attempt to force a major GC between tests
      win.gc();
      win.gc();
      win.gc();
      win.gc();
      win.gc();
    }
  });
});

Cypress.Commands.add('linkChecker', () => {
  cy.get('a').each((link) => {
    if (link.prop('href') && link.prop('href').startsWith('mailto', 0) == false)
      cy.request({
        url: link.prop('href'),
        failOnStatusCode: false,
      }).as('links');

    cy.get('@links').should((response) => {
      expect((response as any).status).to.eq(200);
    });

    // Log the link text and the url. This is useful for debugging.
    cy.log(link.prop('innerText') + ': ' + link.prop('href'));
  });
});
