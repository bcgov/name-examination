// Cypress Test: Check for ability to put NRs on hold.
// This spec checks that NRs can be put on hold starting from the search table,
// Examine Names button, and Get Next Button. 
// import HomePage from '../../pageObjects/homePage'
// const homePage = new HomePage()

// describe('Check that rejecting NRs works', () => {
//   beforeEach(() => {
//     cy.cleanGC()
//     cy.setid('default')
//     cy.login()
//   })

//   afterEach(() => {
//     cy.logout()
//   })

//   it('Should be able to press the Examine Names Link', () => {
//     homePage.examineNamesLink()
//     homePage.searchLink()
//     homePage.examineNamesLink()
//     homePage.searchLink()
//     homePage.examineNamesLink()
//     homePage.searchLink()
//   })

  // it('Should be able to press the Examine Names Link 2', () => {
  //   cy.waitForSpinner()
  //   cy.get(homePage.examineLinkID).should('be.visible').click({ force: true })    
  //   cy.waitForSpinner()
  // })

  // it('Should be able to press the Examine Names Link 3', () => {
  //   cy.waitForSpinner()
  //   cy.get(homePage.examineLinkID).should('be.visible').click({ force: true })    
  //   cy.waitForSpinner()
  //   cy.url().should('include', '/examine')
  // })




  // it('Should be able to hold a NR from the Search Table', () => {
  //   // Go to the search table and filter by DRAFT.
  //   homePage.searchLink()
  //   homePage.headerRowDropdownSelect(homePage.headerRowStatus, 'DRAFT')

  //   // Select the first one and store the NR number
  //   cy.wait(1000)
  //   cy.get(homePage.searchTable, { timeout: 10000 }).within(() => {
  //     cy.get('tbody tr:first-child td:nth-child(3) a', { timeout: 10000 })
  //       .should('be.visible')
  //       .invoke('text')
  //       .then((text) => {
  //         cy.wrap(text.trim()).as('nrNum')
  //       })
  //     cy.get('tbody tr:first-child td:nth-child(3) a', { timeout: 10000 }).click();
  //   })

  //   // Hold the NR.
  //   cy.get(homePage.actionExamineBtn, { timeout: 10000 }).click({ force: true })
  //   cy.get(homePage.actionHoldBtn, { timeout: 10000 }).click({ force: true })

  //   // Confirm the NR was put on Hold in the search table.
  //   cy.get('@nrNum').then((nrNum) => {
  //     cy.verifyNRState(nrNum.toString(), 'HOLD')
  //   })
  // })


  // it('Should be able to hold a NR from the Examine Names button', () => {
  //   // Hold a NR via the Examine Names link
  //   homePage.examineNamesLink()
  //   cy.examineNR()
  //   cy.get(homePage.actionHoldBtn, { timeout: 10000 }).click({ force: true })

  //   // Confirm the NR was rejected in the search table.
  //   cy.get('@nrNum').then((nrNum) => {
  //     cy.verifyNRState(nrNum.toString(), 'HOLD')
  //   })
  // })

  // it('Should be able to hold a NR from the Get Next button', () => {
  //   // Hold a NR and then press the Get Next button
  //   homePage.examineNamesLink()
  //   cy.get(homePage.actionHoldBtn, { timeout: 10000 }).click({ force: true })
  //   cy.get(homePage.actionNextBtn, { timeout: 10000 }).should('exist')
  //   cy.get(homePage.actionNextBtn, { timeout: 10000 }).click({ force: true })

  //   // Store the NR num that is generated
  //   cy.get(homePage.nrNumberHeader, { timeout: 10000 })
  //     .should('be.visible')
  //     .invoke('text')
  //     .then((text) => {
  //       cy.wrap(text.trim()).as('nrNum')
  //     })
    
  //   // Hold the NR.
  //   cy.get(homePage.actionHoldBtn, { timeout: 10000 }).click({ force: true })

  //   // Confirm it was put on hold back in the search table.
  //   cy.get('@nrNum').then((nrNum) => {
  //     cy.verifyNRState(nrNum.toString(), 'HOLD')
  //   })
  // })
// })
