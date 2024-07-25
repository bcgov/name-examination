import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

// CHANGE
describe('E2E Smoke Test', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })

  afterEach(() => {
    cy.logout()
    cy.cleanGC()
  })

  it('Should have status info available', () => {
    homePage.statusInfo()
  })

  it('Should be able to examine an NR', () => {
    const nrNum = '3351228'
    homePage.examineNamesLink()
  
    cy.get('.loading-overlay', { timeout: 10000 }).should('not.exist')
  
    cy.get(homePage.searchInputField).should('be.visible').then(($input) => {
      cy.log('Input field is visible:', $input)
    })
  
    cy.wait(3000)
  
    cy.screenshot('before-typing-nrNum')
    cy.get(homePage.searchInputField).should('be.visible').then($input => {
      cy.wrap($input).type(nrNum, { force: true })
    })
  
    cy.screenshot('after-typing-nrNum')
    cy.get(homePage.searchButton).should('be.visible').click({ force: true })
    cy.contains(homePage.nrNumberHeader, nrNum).should('exist')
  })

  it('Should be able to search an NR', () => {
    const nrNum = '3351228'
    homePage.searchLink()
    // Change the order of Submitted
    cy.get(homePage.headerRowSubmittedOrder).click()
    cy.wait(3000)

    // Test all the drop downs
    homePage.headerRowDropdownSelect(homePage.headerRowStatus, 'DRAFT')
    homePage.headerRowDropdownSelect(homePage.headerRowConsentRequired, 'All')
    homePage.headerRowDropdownSelect(homePage.headerRowPriority, 'Standard')
    homePage.headerRowDropdownSelect(homePage.headerRowNotified, 'Notified')
    homePage.headerRowDropdownSelect(homePage.headerRowSubmitted, '1 year')
    homePage.headerRowDropdownSelect(homePage.headerRowLastUpdate, 'Today')
    homePage.headerRowDropdownSelect(homePage.headerRowConsentRequired, 'All')
    homePage.headerRowDropdownSelect(homePage.headerRowPriority, 'All')
    homePage.headerRowDropdownSelect(homePage.headerRowNotified, 'All')
    homePage.headerRowDropdownSelect(homePage.headerRowSubmitted, 'All')
    homePage.headerRowDropdownSelect(homePage.headerRowLastUpdate, 'All')

    // Search for the NR
    cy.wait(3000)
    cy.get(homePage.searchTable).within(() => {
      cy.get(homePage.headerRowNRNumber).type(nrNum + '{enter}')
      cy.contains('td', 'NR ' + nrNum).should('exist')
      cy.contains('td a', 'NR ' + nrNum).click()
      cy.url().should('include', '/examine?nr=' + nrNum)
    })
  })

  it('Should be able see the stats', () => {
    homePage.statsLink()
    cy.get(homePage.statsCheckbox).click()
    cy.get(homePage.getStatsButton).click()
    cy.wait(3000)

    cy.get(homePage.statsTable).should('exist')
    cy.get(homePage.statsTable)
      .find('tr')
      .then((row) => {
        cy.wrap({ len: row.length }).its('len').should('greaterThan', 0)
      })
  })
})
