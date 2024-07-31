// // Cypress Test: Check for ability to approve NRs
// // This spec checks that NRs can be approved starting from the search table,
// // Examine Names button, and Get Next Button. It also checks the Quck Approve.
// import HomePage from '../../pageObjects/homePage'
// const homePage = new HomePage()

// describe('Check that approving NRs works', () => {
//   beforeEach(() => {
//     cy.cleanGC()
//     cy.setid('default')
//     cy.login()
//   })

//   afterEach(() => {
//     cy.logout()
//   })


//   it('Should be able to approve a NR from the Search Table', () => {
//     // Go to the search table and filter by DRAFT.
//     homePage.searchLink()
//     homePage.headerRowDropdownSelect(homePage.headerRowStatus, 'DRAFT')

//     // Select the first one and store the NR number
//     cy.wait(1000)
//     cy.get(homePage.searchTable).should('be.visible').within(() => {
//       cy.get('tbody tr:first-child td:nth-child(3) a')
//         .should('be.visible')
//         .invoke('text')
//         .then((text) => {
//           cy.wrap(text.trim()).as('nrNum')
//         })
//       cy.get('tbody tr:first-child td:nth-child(3) a').click( {force: true })
//     })

//     // Examine the NR.
//     cy.get(homePage.actionExamineBtn).should('be.visible').click({ force: true })
    
//     // Approve the NR.
//     cy.get(homePage.primaryApproveBtn).should('be.visible').click({ force: true })
    
//     // Confirm the NR was approved in the search table.
//     cy.get('@nrNum').then((nrNum) => {
//       cy.verifyNRState(nrNum.toString(), 'APPROVED')
//     })
//   })


//   it('Should be able to approve a NR from the Examine Names button', () => {
//     // Approve a NR via the Examine Names link
//     homePage.examineNamesLink()
//     cy.examineNR()
//     cy.get(homePage.primaryApproveBtn).should('exist').click({ force: true })

//     // Confirm the NR was approved in the search table.
//     cy.get('@nrNum').then((nrNum) => {
//       cy.verifyNRState(nrNum.toString(), 'APPROVED')
//     })
//   })

//   it('Should be able to approve a NR from the Get Next button', () => {
//     // Approve a NR and then press the Get Next button
//     homePage.examineNamesLink()
//     cy.get(homePage.primaryApproveBtn).should('exist').click({ force: true })
//     cy.waitForSpinner()
//     cy.get(homePage.actionNextBtn).should('exist').click({ force: true })
//     cy.waitForSpinner()

//     // Store the NR num that is generated
//     cy.get(homePage.nrNumberHeader) 
//       .should('exist')
//       .find('span') 
//       .should('exist') 
//       .invoke('text')
//       .then((text) => {
//         cy.wrap(text.trim()).as('nrNum') 
//     })
    
//     // Approve the NR.
//     cy.get(homePage.primaryApproveBtn).should('exist').click({ force: true })

//     // Confirm it was approved back in the search table.
//     cy.get('@nrNum').then((nrNum) => {
//       cy.verifyNRState(nrNum.toString(), 'APPROVED')
//     })
//   })

//   it('Quick Approve button should work', () => {
//     // Click the Examine Names button and examine the NR.
//     homePage.examineNamesLink()
//     cy.examineNR()
    
//     // Approve the NR.
//     cy.get(homePage.quickApproveBtn, { timeout: 10000 }).click({ force: true })

//     // Confirm it was approved back in the search table.
//     cy.get('@nrNum').then((nrNum) => {
//       cy.verifyNRState(nrNum.toString(), 'APPROVED')
//     })
//   })
// })
