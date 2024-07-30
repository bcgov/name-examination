import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('Check for Logout Ability_4', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })


  it('METHOD 4', () => {
    cy.waitForSpinner()
    cy.get(homePage.header).should('be.visible')
      .within(() => {
        cy.get(homePage.userProfile).should('be.visible')
          .within(() => {
            cy.contains('Log Out').click({ force: true })
          })
      })
  })
})
