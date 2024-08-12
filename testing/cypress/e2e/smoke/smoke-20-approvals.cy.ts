// Cypress Test: Check for ability to approve NRs.
// This spec checks that NRs can be approved with the approval button and quick approval button.
import HomePage from 'cypress/pageObjects/homePage'
import SearchPage from 'cypress/pageObjects/searchPage'
import ExaminePage from 'cypress/pageObjects/examinePage'
import { NRState } from 'cypress/constants'
const homePage = new HomePage()
const searchPage = new SearchPage()
const examinePage = new ExaminePage()

describe('Check that approving NRs works', () => {
  beforeEach(() => {
    cy.cleanGC()
    cy.setid('default')
    cy.login()
  })

  afterEach(() => {
    cy.logout()
  })


  it('Should be able to approve a NR from the Search Table', () => {
    // Get the first draft NR from the search table.
    homePage.searchLink()
    searchPage.clickAndRetrieveFirstNR(NRState.Draft)
    cy.get(examinePage.nrStatus).should('have.text', NRState.Draft)

    // Examine the NR.
    examinePage.clickExamineButton()
    cy.get(examinePage.nrStatus).should('have.text', NRState.InProgress)

    // Approve the NR.
    examinePage.clickApproveButton()

    // Verify approval.
    cy.get(examinePage.nrStatus).should('have.text', NRState.Approved)
    cy.get(examinePage.choice1CheckMark).should('be.visible')
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), NRState.Approved)
    })
  })


  it('Should be able to approve a NR with the Quick Approve button', () => {
    // Get the first NR from the Examine Names button.
    homePage.examineNamesLink()
    examinePage.retrieveCurrentNr()
    cy.get(examinePage.nrStatus).should('have.text', NRState.InProgress)

    // Approve the NR.
    examinePage.clickQuickApproveButton()

    // Verify approval.
    cy.get(examinePage.nrStatus).should('have.text', NRState.Approved)
    cy.get(examinePage.choice1CheckMark).should('be.visible')
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), NRState.Approved)
    })
  })
})
