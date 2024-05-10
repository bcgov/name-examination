import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('E2E Smoke Test', () => {
  beforeEach(() => {
    cy.setid('default')
    cy.login()
  })

  afterEach(() => {
    cy.logout()
  })

  /*   it('Should have status info available', () => {
    homePage.statusInfo()
  })

  it('Should be able to click the links/items in the header', () => {
    homePage.examineNamesLink()
    homePage.searchLink()
    homePage.statsLink()
    homePage.prioritySwitchClick()
    homePage.adminLink()
  })

  it('Should be able to examine an NR', () => {
    const nrNum = '2272860'
    homePage.examineNamesLink()
    cy.get('input').eq(0).type(nrNum)
    cy.get('button').eq(0).click()
    cy.contains('span', 'NR ' + nrNum).should('exist')
  })
 */
  it('Should be able to search an NR', () => {
    const nrNum = '2272860'
    homePage.searchLink()
    cy.get('button')
      .eq(7)
      .click()
      .then(() => {
        cy.get('[role="listbox"]')
          .find('[role="option"]:contains("DRAFT")') // be careful with brackets and quote marks
          .click()
      })
    cy.wait(3000)
    cy.get('table').within(() => {
      cy.get('input[id="NR Number"]').type(nrNum + '{enter}')
      cy.contains('td', 'NR ' + nrNum).should('exist')
    })
  })

  it('Should be see the stats', () => {
    homePage.statsLink()
    cy.get('#stats-checkbox').click()
    cy.contains('Get Stats').click()
    cy.wait(3000)
    cy.get('table').should('exist')
    cy.get('table')
      .find('tr')
      .then((row) => {
        cy.wrap({ foo: row.length }).its('foo').should('greaterThan', 1)
      })
  })
})
