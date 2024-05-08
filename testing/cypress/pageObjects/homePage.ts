class HomePage {
  path: string = '/'
  title: string = 'BC Registry: Name Examination - Home'

  // Elements
  header: string = '#app-header'
  headlessuiSwitch1: string = '#headlessui-switch-1'
  headlessuiLabel2: string = '#headlessui-label-2'
  displayDate: string = 'span#date'
  notExamined: string = 'span#notExamined'
  hold: string = 'span#hold'

  // Link bar

  prioritySwitch: string = '#headlessui-switch-1'

  // Actions
  logOut() {
    cy.contains('a', 'Log Out').click()
  }
  adminLink() {
    cy.contains('a', 'Admin').click()
  }
  examineNamesLink() {
    cy.contains('a', 'Examine Names').click()
  }
  searchLink() {
    cy.contains('a', 'Search').click()
  }
  statsLink() {
    cy.contains('a', 'Stats').click()
  }

  prioritySwitchClick() {
    cy.get(this.prioritySwitch).click()
  }
}

export default HomePage
