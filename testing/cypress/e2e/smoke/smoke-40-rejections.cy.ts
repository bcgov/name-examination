// Cypress Test: Check for ability to reject NRs
// This spec checks that NRs can be rejected starting from the search table,
// Examine Names button, and Get Next Button. It also checks both the 
// quick reject distinctive and quick reject descriptive buttons.
import HomePage from '../../pageObjects/homePage'
const homePage = new HomePage()

describe('Check that rejecting NRs works', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })

  afterEach(() => {
    cy.logout()
  })


  it('Should be able to reject a NR from the Search Table', () => {
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')

    // Go to the search table and filter by DRAFT.
    homePage.searchLink()
    homePage.headerRowDropdownSelect(homePage.headerRowStatus, 'DRAFT')

    // Select the first one, store the NR number, and wait for the request to complete.
    cy.intercept('GET', '**/api/v1/requests/NR*').as('getRequest')
    cy.get(homePage.searchTable).within(() => {
      cy.get('tbody tr:first-child td:nth-child(3) a')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          cy.wrap(text.trim()).as('nrNum')
        })
      cy.get('tbody tr:first-child td:nth-child(3) a').click()
    })
    cy.wait('@getRequest').its('response.statusCode').should('eq', 200)

    // Examine the NR and wait for the request to complete.
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    cy.get(homePage.actionExamineBtn).should('exist').click({ force: true })
    cy.wait('@patchRequest').its('response.statusCode').should('eq', 200)

    // Reject the NR and wait for the request to complete.
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest2')
    cy.get(homePage.primaryRejectBtn).should('exist').click({ force: true })
    cy.wait('@patchRequest2')

    // Confirm the NR was rejected in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })


  it('Should be able to reject a NR from the Examine Names button', () => {
    // Click the "Examine Names" button and store the NR that is generated.
    homePage.examineNamesLink()
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
      })
    
    // Reject the NR and wait for network requests to finish.
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    cy.get(homePage.primaryRejectBtn).click({ force: true })
    cy.wait('@patchRequest')

    // Confirm the NR was rejected in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })


  it('Should be able to reject 2 NRs using the Get Next button', () => {
    // Click the "Examine Names" link and reject the first NR. 
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    homePage.examineNamesLink()
    cy.get(homePage.primaryRejectBtn).should('exist').click({ force: true })
    cy.wait('@patchRequest').its('response.statusCode').should('eq', 200)
  
    // Click the "Get Next" button and wait for page to be stable.
    cy.intercept('GET', '**/api/v1/requests/NR*').as('getRequest')
    cy.get(homePage.actionNextBtn).should('exist').click({ force: true })
    cy.wait('@getRequest').its('response.statusCode').should('eq', 200)
    cy.waitForSpinner()

    // Store the NR number that is generated.
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
      })
  
    // Reject the NR and wait for network request to finish.
    cy.intercept('GET', '**/api/v1/requests/NR*').as('nextGetRequest')
    cy.get(homePage.primaryRejectBtn).should('exist').click({ force: true })
    cy.wait('@nextGetRequest').its('response.statusCode').should('eq', 200)
    cy.waitForSpinner()
  
    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })
  

  it('Quick reject distinctive button should work', () => {
    // Click the Examine Names button.
    homePage.examineNamesLink()
    
    // Store the NR.
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
    })
    
    // Reject the NR and wait for network request to finish.
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    cy.get(homePage.quickRejectDist).click({ force: true })
    cy.wait('@patchRequest').its('response.statusCode').should('eq', 200)

    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })

  it('Quick reject descriptive button should work', () => {
    // Click the Examine Names button.
    homePage.examineNamesLink()

    // Store the NR.
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
      })
    
    // Reject the NR and wait for network request to finish.
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    cy.get(homePage.quickRejecetDesc, { timeout: 10000 }).click({ force: true })
    cy.wait('@patchRequest').its('response.statusCode').should('eq', 200)

    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })
})
