// Cypress Test: Check for ability to reject NRs
// This spec checks that NRs can be rejected starting from the search table,
// Examine Names button, and Get Next Button. It also checks both the 
// quick reject distinctive and quick reject descriptive buttons.
import HomePage from '../../../pageObjects/homePage'
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
    // Go to the search table and filter by DRAFT.
    homePage.searchLink()
    homePage.headerRowDropdownSelect(homePage.headerRowStatus, 'DRAFT')

    // Select the first one and store the NR number
    cy.wait(1000)
    cy.get(homePage.searchTable, { timeout: 10000 }).within(() => {
      cy.get('tbody tr:first-child td:nth-child(3) a', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          cy.wrap(text.trim()).as('nrNum')
        })
      cy.get('tbody tr:first-child td:nth-child(3) a', { timeout: 10000 }).click();
    })

    // Reject the NR.
    cy.get(homePage.actionExamineBtn, { timeout: 10000 }).click({ force: true })
    cy.get(homePage.primaryRejectBtn, { timeout: 10000 }).click({ force: true })

    // Confirm the NR was rejected in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })


  it('Should be able to reject a NR from the Examine Names button', () => {
    // Reject a NR via the Examine Names link
    homePage.examineNamesLink()
    cy.examineNR()
    cy.get(homePage.primaryRejectBtn, { timeout: 10000 }).click({ force: true })

    // Confirm the NR was rejected in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })

  it('Should be able to reject a NR from the Get Next button', () => {
    // Reject a NR and then press the Get Next button
    homePage.examineNamesLink()
    cy.get(homePage.primaryRejectBtn, { timeout: 10000 }).click({ force: true })
    cy.get(homePage.actionNextBtn, {timeout: 10000 }).should('exist')
    cy.get(homePage.actionNextBtn, {timeout: 10000 }).click({ force: true })

    // Store the NR num that is generated
    cy.get(homePage.nrNumberHeader, { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
      })
    
    // Reject the NR.
    cy.get(homePage.primaryRejectBtn, { timeout: 10000 }).click({ force: true })

    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })

  it('Quick reject distinctive button should work', () => {
    // Click the Examine Names button and examine the NR.
    homePage.examineNamesLink()
    cy.examineNR()
    
    // Reject the NR.
    cy.get(homePage.quickRejectDist, { timeout: 10000 }).click({ force: true })

    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })

  it('Quick reject descriptive button should work', () => {
    // Click the Examine Names button and examine the NR.
    homePage.examineNamesLink()
    cy.examineNR()
    
    // Reject the NR.
    cy.get(homePage.quickRejecetDesc, { timeout: 10000 }).click({ force: true })

    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })
})
