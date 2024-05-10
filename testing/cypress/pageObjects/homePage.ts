/**
 * Represents the home page of the BC Registry Name Examination application.
 */

import Utilities from '../appActions/Utilities'
const util = new Utilities()

class HomePage {
  path: '/'
  title = 'BC Registry: Name Examination - Home'

  // Elements
  header = '#app-header'
  headlessuiSwitch1 = '#headlessui-switch-1'
  headlessuiLabel2 = '#headlessui-label-2'
  displayDate = 'span#date'
  notExamined = 'span#notExamined'
  hold = 'span#hold'

  // Link bar
  prioritySwitch = '#headlessui-switch-1'

  // Actions
  /**
   * Logs out the user by clicking the "Log Out" link.
   */
  logOut() {
    cy.contains('a', 'Log Out').click()
  }

  /**
   * Navigates to the admin page by clicking the "Admin" link.
   */
  adminLink() {
    // Remove the target to stay in the same window for Cypress' sake
    cy.contains('a', 'Admin').invoke('removeAttr', 'target').click()
    cy.wait(1000)
    cy.url().should('include', 'namex-solr-dev.apps.silver.devops.gov.bc.ca')
    cy.contains('a', 'Login to administration.').click()
    cy.wait(1000)
    cy.url().then(($url) => {
      expect($url).to.contain('/admin/synonym')
    })
    cy.visit('/')
  }

  /**
   * Navigates to the examine names page by clicking the "Examine Names" link.
   */
  examineNamesLink() {
    cy.contains('a', 'Examine Names').click()
    cy.wait(1000)
    cy.url().then(($url) => {
      expect($url).to.contain('/examine')
    })
  }

  /**
   * Navigates to the search page by clicking the "Search" link.
   */
  searchLink() {
    cy.contains('a', 'Search').click()
    cy.wait(1000)
    cy.url().then(($url) => {
      expect($url).to.contain('/search')
    })
  }

  /**
   * Navigates to the stats page by clicking the "Stats" link.
   */
  statsLink() {
    cy.contains('a', 'Stats').click()
    cy.wait(1000)
    cy.url().then(($url) => {
      expect($url).to.contain('/stats')
    })
  }

  /**
   * Toggles the priority switch by clicking on it.
   */
  prioritySwitchClick() {
    if (cy.get(this.prioritySwitch).invoke('attr', 'aria-checked')) {
      cy.get(this.prioritySwitch).click()
      cy.get(this.prioritySwitch)
        .invoke('attr', 'aria-checked')
        .should('eq', 'false')
    } else if (!cy.get(this.prioritySwitch).invoke('attr', 'aria-checked')) {
      cy.get(this.prioritySwitch).click()
      cy.get(this.prioritySwitch)
        .invoke('attr', 'aria-checked')
        .should('eq', 'true')
    }
  }

  /**
   * Retrieves the status information from the home page.
   *
   * @returns {void}
   */
  statusInfo() {
    cy.get(this.displayDate).should('exist')
    cy.get(this.notExamined).should('exist')
    cy.get(this.hold).should('exist')
    cy.get(this.displayDate)
      .invoke('text')
      .then(($text) => {
        const date = util.getDate()
        const formattedDate = `${date.substring(0, 4)}-${date.substring(
          4,
          6
        )}-${date.substring(6, 8)}`
        expect($text).to.contain(formattedDate)
        cy.log($text)
      })
  }
}
export default HomePage
