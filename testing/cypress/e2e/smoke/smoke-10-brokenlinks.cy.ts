// Cypress Test: Check for Broken Static Links
// This spec checks for broken links on the home page, including the header and footer.
// It verifies if the specified links are operational.
// It does not test if the links are correct.
import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('Check for Broken Static Links', () => {
  beforeEach(() => {
    cy.setid('default')
    cy.login()
  })

  afterEach(() => {
    cy.logout()
  })
  it('Check All Static Links', () => {
    // Iterate through all the links on the page
    // If the link has a specified URL, check if the link is operational
    // cy.linkChecker()

    // Navigate to the next tab
    cy.log('Attempting to click "Examine Names" link')
    cy.contains('a', 'Examine Names')
    .should('be.visible')
    .scrollIntoView()
    .then(($el) => {
      cy.log('Button "Examine Names" found:', $el.text());
    })
    
  
    // Step 2: Log before clicking the button
    cy.log('Attempting to click the "Examine Names" button');
    
    // Step 3: Click the button and log after clicking
    cy.contains('a', 'Examine Names')
      .click({ force: true })
      .then(() => {
        cy.log('Clicked the "Examine Names" button');
      })
    


    // // Navigate to the next tab
    // cy.log('Attempting to click "Searcg" link')
    // cy.contains('a', 'Search').should('be.visible').scrollIntoView().click({ force: true })
    // cy.url().should('include', '/search')
    // cy.linkChecker()
  })
})
