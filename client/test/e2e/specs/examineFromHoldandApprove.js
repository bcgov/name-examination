
// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Start': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    // logins, navugates to the search screen and select an nr that on hold and assigned to me already.
    browser
      .url(devServer)
      .waitForElementVisible('#app', 1000)
      .assert.elementPresent('h2')
      .assert.containsText('h2', 'You should only see this page if you got here un-authenticated. Please login')
      .assert.elementPresent('.collapse.navbar-collapse')
      .pause(1000)
      .assert.elementPresent('.collapse.navbar-collapse ul.navbar-nav.mr-auto')
      .assert.elementPresent('#header-login-button')
      .click('#header-login-button')
      .pause(2000)
      .assert.urlContains('/auth?client_id=namex')
      .setValue('#username', ['names-examiner', browser.Keys.TAB])
      .setValue('#password', ['WhatEver1', browser.Keys.ENTER])
      .pause(1000)
      .assert.containsText('p.navbar-text', 'names-examiner')
    // go to the search and get a list of onholds
      .assert.elementPresent('.collapse.navbar-collapse ul.navbar-nav.mr-auto')
      .click('#header-search-link')
      .pause(1000)
      .assert.urlContains('/find')
      .pause(2000)
      .setValue('#search-filter-examiner', 'names-examiner')
      .assert.elementPresent('[name="TableBodyWrapper"] tbody tr:nth-child(1)')
      .click('[name="TableBodyWrapper"] tbody tr:nth-child(1)')
      .click('#load')
      .pause(5000)
      .assert.urlContains('/nameExamination')
      .assert.containsText('.nrNum', 'NR')
      .assert.elementPresent('#examine-button')
      .assert.elementPresent('#History1')
      .assert.elementPresent('#Conflict1')
      .assert.elementPresent('#Condition1')
      .assert.elementPresent('#Trademarks1')

      .click('#examine-button')
      .pause(5000)
      .assert.elementPresent('#examine-decide-button')
      .assert.elementPresent('#examine-hold-button')

      .assert.elementPresent('#examine-quick-approve-button')
      .assert.elementPresent('#examine-reject-descriptive-button')
      .assert.elementPresent('#examine-reject-distinctive-button')

    //approve
      .click('#examine-decide-button')
      .pause(1000)
      .assert.elementPresent('#decision-cancel-button')
      .assert.elementPresent('#decision-reject-button')
      .assert.elementPresent('#decision-approve-button')

    //add decision reason





      .end();
  },
};
