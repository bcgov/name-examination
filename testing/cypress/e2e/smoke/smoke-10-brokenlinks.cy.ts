// Cypress Test: Check for Broken Static Links
// This spec is used to check for broken links on the home page, which includes the header and the footer. It checks if the specified links are operational.
// It does not test if the the links are correct.

import { beforeEach } from "mocha";

describe('Check for Broken Static Link', () => {
  beforeEach(() => {
    cy.login(null,null,null,null);
  });
  it('Check All Static Links', () => {
     // Iterate through all the links on the page
    // If the link has an url specified, then check if the link is operational
    cy.get('a').each((link) => {
      if (link.prop('href') && link.prop('href').startsWith('mailto', 0) == false)
        cy.request({
          url: link.prop('href'),
          failOnStatusCode: false,
        }).as('links');

      cy.get('@links').should((response) => {
        expect(response.status).to.eq(200);
      });

      // Log the link text and the url. This is useful for debugging.
      cy.log(link.prop('innerText') + ': ' + link.prop('href'));
    });
  });
});
