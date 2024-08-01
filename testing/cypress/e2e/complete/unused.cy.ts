// it('Should be able to approve a NR from the Examine Names button', () => {
//   homePage.examineNamesLink()
//   examinePage.retrieveCurrentNr()

//   examinePage.clickApproveButton()

//   cy.get(examinePage.detailsNameChoice1CheckMark).should('be.visible')
//   cy.get('@nrNum').then((nrNum) => {
//     cy.verifyNRState(nrNum.toString(), NRState.Approved)
//   })
// })


// it('Should be able to reject a NR from the Examine Names button', () => {
//   homePage.examineNamesLink()
//   examinePage.retrieveCurrentNr()

//   examinePage.clickRejectButton()

//   cy.get('@nrNum').then((nrNum) => {
//     cy.verifyNRState(nrNum.toString(), NRState.Rejected)
//   })
// })


// it('Should be able to hold a NR from the Examine Names button', () => {
//   homePage.examineNamesLink()
//   examinePage.retrieveCurrentNr()

//   examinePage.clickHoldButton()

//   cy.get('@nrNum').then((nrNum) => {
//     cy.verifyNRState(nrNum.toString(), NRState.Hold)
//   })
// })


// it('Should be able to approve 2 NRs in a row using the Get Next button', () => {
//   homePage.examineNamesLink()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.InProgress)

//   examinePage.clickApproveButton()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.Approved)

//   examinePage.clickNextButton()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.InProgress)
//   examinePage.retrieveCurrentNr()
//   examinePage.clickApproveButton()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.Approved)

//   cy.get(examinePage.detailsNameChoice1CheckMark).should('be.visible')
//   cy.get('@nrNum').then((nrNum) => {
//     cy.verifyNRState(nrNum.toString(), NRState.Approved)
//   })
// })


// it('Should be able to reject 2 NRs in a row using the Get Next button', () => {
//   // Get the first NR from the Examine Names button.
//   homePage.examineNamesLink()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.InProgress)

//   // Reject the NR (all 3 choices if available).
//   nameChoices.forEach((choice, i) => {
//     cy.get(choice, { timeout: 0 }).then($el => {
//       if ($el.is(':visible')) {
//         examinePage.clickRejectButton()
//         cy.get(examinePage[`detailsNameChoice${i + 1}XMark`]).should('be.visible')
//       }
//     })
//   })
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.Rejected)

//   // Get the next NR from the get next button.
//   examinePage.clickNextButton()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.InProgress)
//   examinePage.retrieveCurrentNr()

//   // Reject the NR (all 3 choices if available).
//   nameChoices.forEach((choice, i) => {
//     cy.get(choice, { timeout: 0 }).then($el => {
//       if ($el.is(':visible')) {
//         examinePage.clickRejectButton()
//         cy.get(examinePage[`detailsNameChoice${i + 1}XMark`]).should('be.visible')
//       }
//     })
//   })

//   // Verify Rejection
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.Rejected)
//   cy.get('@nrNum').then((nrNum) => {
//     cy.verifyNRState(nrNum.toString(), NRState.Rejected)
//   })
// })


// it('Should be able to hold 2 NRs in a row using the Get Next button', () => {
//   // Get the first NR from the Examine Names button.
//   homePage.examineNamesLink()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.InProgress)

//   // Hold the NR
//   examinePage.clickHoldButton()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.Hold)

//   // Get the next NR from the get next button.
//   examinePage.clickNextButton()
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.InProgress)
//   examinePage.retrieveCurrentNr()

//   // Hold the NR
//   examinePage.clickHoldButton()

//   // Verify Hold
//   cy.get(examinePage.detailsStatus).should('have.text', NRState.Hold)
//   cy.get('@nrNum').then((nrNum) => {
//     cy.verifyNRState(nrNum.toString(), NRState.Hold)
//   })
// })
