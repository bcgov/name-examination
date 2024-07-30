import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('Check for Logout Ability_2', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })

  it('METHOD 2', () => {
    cy.waitForSpinner()
    cy.get(homePage.header).should('be.visible')
      .within(() => {
        cy.get(homePage.userProfile).should('be.visible')
          .within(() => {
                cy.get(homePage.logOut).should('be.visible')
                  .click({ force: true })
          })
      })
  })
})
