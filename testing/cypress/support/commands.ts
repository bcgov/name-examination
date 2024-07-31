/**
 * This file contains custom Cypress commands used in the tests.
 */

/// <reference types="@testing-library/cypress" />

/**
 * Making common libraries available to the scripts
 */
import 'cypress-plugin-api'
import 'cypress-real-events'
import '@testing-library/cypress/add-commands'

import HomePage from '../pageObjects/homePage'
import LoginProxy from '../pageObjects/loginProxy'

const homePage = new HomePage()
const loginProxy = new LoginProxy()

/**
 * Custom Cypress command to perform login.
 *
 * @param username - The username for login. If not provided, it uses the value from Cypress environment variables.
 * @param password - The password for login. If not provided, it uses the value from Cypress environment variables.
 * @param host - The host URL to visit. If not provided, it uses an empty string.
 * @param siteminder - The Siteminder value. Not used in the code.
 */
Cypress.Commands.add(
  'login',
  (
    username?: string,
    password?: string,
    host?: string,
    siteminder?: string
  ) => {
    // Go to the host
    cy.visit(host || '')

    loginProxy.checkLoginProxyPage()
    loginProxy.chooseIdir()

    // Validate siteminder and login
    cy.get('#login-to')
      .contains('Log in to ')
      .should('be.visible')
    cy.get('#user').type(
      username || Cypress.env('username')
    )
    cy.get('#password').type(
      password || Cypress.env('password'),
      { log: false }
    )
    cy.get('input[name=btnSubmit]').click()
  }
)

Cypress.Commands.add('bypassLogin', () => {
  cy.session('loginSession', () => {
    cy.login()
  })
})

/**
 * Custom Cypress command to perform logout.
 */
Cypress.Commands.add('logout', () => {
  // Ensure you have the base URL configured
  const baseUrl = Cypress.config('baseUrl')
  
  // Fetch necessary token or session details from local storage or cookies if required
  const token = localStorage.getItem('authToken'); // Example for token retrieval

  // Directly send the logout request
  cy.request({
    method: 'GET',
    url: `${baseUrl}/auth/realms/your-realm/protocol/openid-connect/logout`, // Adjust the URL as needed
    headers: {
      'Authorization': `Bearer ${token}` // Include the auth token if required
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    cy.log('Logout Request Response:', response)
  });


  localStorage.removeItem('authToken')
  cy.clearCookies()
})

/**
 * Custom Cypress command to set the ID/PW Env vars.
 *
 * @param type - The type of ID/PW to set. If not provided, it uses the default type.
 */
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

/**
 * Custom Cypress command to clean up memory by triggering Garbage Collection.
 */
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

/**
 * Custom Cypress command to check all links on the page.
 */
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

/**
 * Custom Cypress command to wait until loading spinner is gone
 */
Cypress.Commands.add('waitForSpinner', () => {
  cy.get('[data-testid="loadingSpinner"]').should('not.exist')
  cy.wait(1000)
})

Cypress.Commands.add('examineNR', () => {
  cy.wait(10000)
  cy.get(homePage.nrNumberHeader)
    .should('exist')
    .should('be.visible')
    .invoke('text')
    .then((text) => {
      cy.wrap(text.trim()).as('nrNum')
    })
  })


Cypress.Commands.add('verifyNRState', (nrNum: string, state: string) => {
  homePage.searchLink()
  cy.waitForSpinner()
  homePage.headerRowDropdownSelect(homePage.headerRowStatus, state)
  cy.waitForSpinner()

  cy.get(homePage.searchTable).within(() => {
    cy.get(homePage.headerRowNRNumber).type(nrNum + '{enter}')
    cy.waitForSpinner()
    cy.contains('td', String(nrNum)).should('exist')
  })
})
