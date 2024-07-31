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
    // Go to the search table and filter by DRAFT.
    homePage.searchLink()
    homePage.headerRowDropdownSelect(homePage.headerRowStatus, 'DRAFT')

    // Select the first one and store the NR number
    cy.wait(1000)
    cy.intercept('GET', '**/api/v1/requests/NR*').as('getRequest')
    cy.get(homePage.searchTable).within(() => {
      cy.get('tbody tr:first-child td:nth-child(3) a')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          cy.wrap(text.trim()).as('nrNum')
        })
      cy.get('tbody tr:first-child td:nth-child(3) a').click();
    })
    cy.wait('@getRequest')
    cy.wait(5000)

    // Examine the NR and wait for request to finish.
    // THIS IS WHERE IT IS MAKING IT TO, cant find button
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    cy.get(homePage.actionExamineBtn).should('exist').click({ force: true })
    cy.wait('@patchRequest')

    // Reject the NR and wait for network requests to finish.
    cy.get(homePage.primaryRejectBtn).should('exist').click({ force: true })
    cy.wait('@patchRequest')

    // Confirm the NR was rejected in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })

  it('Should be able to reject a NR from the Search Table2', () => {
    // Go to the search table and filter by DRAFT.
    homePage.searchLink()
    homePage.headerRowDropdownSelect(homePage.headerRowStatus, 'DRAFT')

    // Select the first one and store the NR number
    cy.wait(1000)
    cy.get(homePage.searchTable).within(() => {
      cy.get('tbody tr:first-child td:nth-child(3) a')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          cy.wrap(text.trim()).as('nrNum')
        })
      cy.get('tbody tr:first-child td:nth-child(3) a').click();
    })
    cy.wait(3000)

    // Examine the NR and wait for request to finish.
    // THIS IS WHERE IT IS MAKING IT TO, cant find button
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    cy.get(homePage.actionExamineBtn).should('exist').click({ force: true })
    cy.wait('@patchRequest')

    // Reject the NR and wait for network requests to finish.
    cy.get(homePage.primaryRejectBtn).should('exist').click({ force: true })
    cy.wait('@patchRequest')

    // Confirm the NR was rejected in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })


  it('Should be able to reject a NR from the Examine Names button', () => {
    cy.intercept('GET', '**/api/v1/requests/NR*').as('getRequest')
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('patchRequest')
    homePage.examineNamesLink()
    cy.wait('@getRequest')

    // Store the NR
    cy.wait(3000)
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
      })
    
    // Reject the NR and wait for network requests to finish
    // MISTAKE ON THIS REQUEST
    cy.get(homePage.primaryRejectBtn).click({ force: true })
    cy.wait('@patchRequest')

    // Confirm the NR was rejected in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })


  it('Should be able to reject 2 NRs using the Get Next button', () => {
    homePage.examineNamesLink()
    cy.wait(3000)
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('rejectPatchRequest');
    
    // Reject the first NR and wait for network requests to finish
    // TIMED OUT FINDING THIS BUTTON
    cy.wait(5000)
    cy.get(homePage.primaryRejectBtn).should('exist').click({ force: true });
    cy.wait('@rejectPatchRequest').its('response.statusCode').should('eq', 200);
  
    // Click the "Get Next" button and wait for the next NR request to finish
    cy.get(homePage.actionNextBtn).should('exist').click({ force: true });
    cy.waitForSpinner()

    // Store the NR number that is generated
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum');
      });
  
    // Reject the next NR and wait for network requests to finish
    cy.get(homePage.primaryRejectBtn).should('exist').click({ force: true });
    cy.wait('@rejectPatchRequest').its('response.statusCode').should('eq', 200);
    cy.waitForSpinner();
  
    // Confirm it was rejected back in the search table
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED');
    });
  });
  

  it('Quick reject distinctive button should work', () => {
    // Click the Examine Names button and examine the NR.
    homePage.examineNamesLink()
    
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
    })
    
    // Reject the NR.
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('rejectPatchRequest');
    cy.get(homePage.quickRejectDist, { timeout: 10000 }).click({ force: true })
    cy.wait('@rejectPatchRequest').its('response.statusCode').should('eq', 200);

    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })

  it('Quick reject descriptive button should work', () => {
    // Click the Examine Names button and examine the NR.
    homePage.examineNamesLink()
    cy.wait(3000)
    
    cy.get(homePage.nrNumberHeader)
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.wrap(text.trim()).as('nrNum')
      })
    
    // Reject the NR.
    cy.intercept('PATCH', '**/api/v1/requests/NR*').as('rejectPatchRequest');
    cy.get(homePage.quickRejecetDesc, { timeout: 10000 }).click({ force: true })
    cy.wait('@rejectPatchRequest').its('response.statusCode').should('eq', 200);

    // Confirm it was rejected back in the search table.
    cy.get('@nrNum').then((nrNum) => {
      cy.verifyNRState(nrNum.toString(), 'REJECTED')
    })
  })
})
