import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('E2E Smoke Test', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })

  afterEach(() => {
    cy.logout()
  })

  it('Should have status info available', () => {
    homePage.statusInfo()
  })

  it('Should be able to click the links/items in the header', () => {
    homePage.searchLink()
    homePage.statsLink()
    homePage.prioritySwitchClick()
    homePage.adminLink()
    homePage.examineNamesLink()
  })

  it('Should be able to examine an NR', () => {
    const nrNum = '3351228'
    homePage.examineNamesLink()
  
    cy.get(homePage.searchInputField).should('exist')
      .then(($input) => {
        cy.wrap($input).type(nrNum, { force: true })}
      )
    
    cy.intercept('GET', '**/api/v1/requests/NR*').as('getRequest')
    cy.get(homePage.searchButton).should('exist').click({ force: true })
    cy.wait('@getRequest')
    cy.contains(homePage.nrNumberHeader, nrNum).should('exist')
  })
  

  it('Should be able to search an NR', () => {
    const nrNum = '3351228'
    homePage.searchLink()
    // Change the order of Submitted
    cy.get(homePage.headerRowSubmittedOrder, { timeout: 10000 }).click({ force: true })

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
    cy.get(homePage.searchTable, { timeout: 10000 } ).within(() => {
      cy.get(homePage.headerRowNRNumber).type(nrNum + '{enter}')
      cy.contains('td', 'NR ' + nrNum).should('exist')
      cy.contains('td a', 'NR ' + nrNum).click()
      cy.url().should('include', '/examine?nr=' + nrNum)
    })
  })

  it('Should be able see the stats', () => {
    homePage.statsLink()
    cy.get(homePage.statsCheckbox, { timeout: 10000 }).click({ force: true })
    cy.get(homePage.getStatsButton, { timeout: 10000 }).click({ force: true })

    cy.get(homePage.statsTable, { timeout: 10000 }).should('exist')
    cy.get(homePage.statsTable)
      .find('tr')
      .then((row) => {
        cy.wrap({ len: row.length }).its('len').should('greaterThan', 0)
      })
  })
})
