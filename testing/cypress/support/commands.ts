/// <reference types="@testing-library/cypress" />

import 'cypress-plugin-api'
import 'cypress-real-events'
import '@testing-library/cypress/add-commands'
import HomePage from '../pageObjects/homePage'
import LoginProxy from '../pageObjects/loginProxy'
let homePage = new HomePage()
let loginProxy = new LoginProxy()

Cypress.Commands.add(
  'login',
  (
    username?: string,
    password?: string,
    host?: string,
    siteminder?: string
  ) => {
    // Go to the host
    cy.visit(host || Cypress.env('host'))

    loginProxy.checkLoginProxyPage()
    loginProxy.chooseIdir()

    // Validate siteminder and login
    cy.get('#login-to', { timeout: 10000 })
      .contains('Log in to ')
      .should('be.visible')
    cy.get('#user', { timeout: 10000 }).type(
      username || Cypress.env('username')
    )
    cy.get('#password', { timeout: 10000 }).type(
      password || Cypress.env('password'),
      { log: false }
    )
    cy.get('input[name=btnSubmit]', { timeout: 10000 }).click()
    cy.wait(3000)
  }
)

Cypress.Commands.add('logout', () => {
  // Make sure you are on page with log out and logout
  cy.get(homePage.header, { timeout: 10000 }).within(() => {
    cy.get(homePage.logOut).click()
  })
})

Cypress.Commands.add('setid', (type: string) => {
  // Set the ID/PW Env vars to default if type not passed in
  if (!type) {
    type = 'default'
  }
  const data = Cypress.env('users')

  const foundItem = data.find((item: any) => item.type === type)
  Cypress.env('username', foundItem.username)
  Cypress.env('password', foundItem.password)
  Cypress.env('type', foundItem.type)
  if (foundItem.otpsecret) {
    Cypress.env('otpsecret', foundItem.otpsecret)
  }
})

Cypress.Commands.add('cleanGC', () => {
  // Clean up memory by triggering Garbage Collection
  cy.window().then((win) => {
    // window.gc is enabled with --js-flags=--expose-gc chrome flag
    if (typeof win.gc === 'function') {
      // run gc multiple times in an attempt to force a major GC between tests
      win.gc()
      win.gc()
      win.gc()
      win.gc()
      win.gc()
    }
  })
})

Cypress.Commands.add('linkChecker', () => {
  cy.get('a').each((link) => {
    if (
      link.prop('href') &&
      link.prop('href').startsWith('mailto', 0) === false
    ) {
      cy.request({
        url: link.prop('href'),
        failOnStatusCode: false,
      }).as('links')
    }

    cy.get('@links').should((response) => {
      expect((response as any).status).to.eq(200)
    })

    // Log the link text and the url. This is useful for debugging.
    cy.log(link.prop('innerText') + ': ' + link.prop('href'))
  })
})
