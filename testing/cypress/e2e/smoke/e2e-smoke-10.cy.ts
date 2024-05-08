import HomePage from '../../pageObjects/homePage'
let homePage = new HomePage()

describe('E2E Smoke Test 10', () => {
  beforeEach(() => {
    cy.setid('default')
    cy.login()
  })

  afterEach(() => {
    cy.logout()
  })
  it('Should be able to click the links in the header', () => {
    homePage.examineNamesLink()
    cy.url().then(($url) => {
      expect($url).to.contain('/examine')
    })
    homePage.searchLink()
    cy.url().then(($url) => {
      expect($url).to.contain('/search')
    })

    homePage.statsLink()
    cy.url().then(($url) => {
      expect($url).to.contain('/stats')
    })

    homePage.prioritySwitchClick()
    cy.pause()

    homePage.adminLink()
    cy.url().then(($url) => {
      expect($url).to.contain('https://dev.namex.bcregistry.gov.bc.ca')
    })
  })
})
