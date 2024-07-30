import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('Check for Logout Ability_1', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })


  it('METHOD 1', () => {
    // cy.waitForSpinner()
    cy.get(homePage.header).within(() => {
      cy.get(homePage.logOut).should('be.visible').click({ force: true })
    })
  })
})
