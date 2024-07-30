import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('Check for Logout Ability_3', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })

  it('METHOD 3', () => {
    cy.waitForSpinner()
    cy.contains('Log Out').click({ force: true })
  })
})
