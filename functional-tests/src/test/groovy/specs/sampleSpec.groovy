import geb.spock.GebReportingSpec

import pages.app.HomePage
import pages.app.ProjectsPage
import pages.app.MapPage
import pages.app.SearchPage
import pages.app.LifecyclePage
import pages.app.TopicsOfInterestPage
import pages.app.LegislationPage
import pages.app.AuthorizationsPage
import pages.app.ComplianceOversightPage
import pages.app.ContactPage

import pages.external.CopyrightPage
import pages.external.DisclaimerPage
import pages.external.PrivacyPage
import pages.external.AccessibilityPage
import pages.external.FacebookPage
import pages.external.TwitterPage
import pages.external.GooglePlusPage

import spock.lang.Unroll
import spock.lang.Title

@Title("Functional tests for the Home page")
class HomeSpec extends GebReportingSpec {
  @Unroll
  def "Navigate Page from: HomePage, click header Link: #ItemSelector -> #SubItemSelector, Assert Page: #AssertPage"(){
    given: "I start on the HomePage"
      to HomePage
    when: "I click on the link #ItemSelector -> #SubItemSelector"
      headerModule.clickMenuItem(ItemSelector, SubItemSelector)
    then:
      at AssertPage
    where:
      ItemSelector                        | SubItemSelector                    || AssertPage
      [ text : "FIND MINES IN BC" ]       | [ text : "Find Projects by List" ] || ProjectsPage
      [ text : "FIND MINES IN BC" ]       | [ text : "Find Projects by Map" ]  || MapPage

      [ text : "FIND DOCUMENTS" ]         |   null                             || SearchPage

      [ text : "MINING IN BC" ]           | [ text : "The Mining Lifecycle" ]  || LifecyclePage
      [ text : "MINING IN BC" ]           | [ text : "Topics of Interest" ]    || TopicsOfInterestPage

      [ text : "PROCESSES & PROCEDURES" ] | [ text : "Legislation" ]           || LegislationPage
      [ text : "PROCESSES & PROCEDURES" ] | [ text : "Authorizations" ]        || AuthorizationsPage
      [ text : "PROCESSES & PROCEDURES" ] | [ text : "Compliance Oversight" ]  || ComplianceOversightPage

      [ text : "CONNECT WITH US" ]        |   null                             || ContactPage
  }

  @Unroll
  def "Navigate Page from: HomePage, click main content Link: #ClickLink, Assert Page: #AssertPage"() {
    given: "I start on the HomePage"
      to HomePage
    when: "I click on the #ClickLink"
      page."$ClickLink".click()
    then: "I arrive on the #AssertPage page"
      at AssertPage
    where:
      ClickLink                         || AssertPage
      "HomeBtn"                         || HomePage

      "ViewListBtn"                     || ProjectsPage
      "ViewMapBtn"                      || MapPage

      "LifecycleLearnMoreBtn"           || LifecyclePage
      "TopicsOfInterestLearnMoreBtn"    || TopicsOfInterestPage
      "FindMinsInBCViewListBtn"         || ProjectsPage
      "FindMinsInBCViewMapBtn"          || MapPage

      "LegislationLearnMoreBtn"         || LegislationPage
      "AuthorizationsLearnMoreBtn"      || AuthorizationsPage
      "ComplianceOversightLearnMoreBtn" || ComplianceOversightPage
  }

  @Unroll
  def "Navigate Page from: HomePage, click footer Link: #ClickLink, Assert Page: #AssertPage"() {
    given: "I start on the HomePage"
      to HomePage
    when: "I click on the #ClickLink"
      footerModule."$ClickLink".click()
    then: "I arrive on the #AssertPage page"
      at AssertPage
    where:
      ClickLink                 || AssertPage
      "FindProjectsByListLink"  || ProjectsPage
      "FindProjectsByMapLink"   || MapPage

      "TheMiningLifecycleLink"  || LifecyclePage
      "TopicsOfInterstLink"     || TopicsOfInterestPage
      "FindMinesInBCLink"       || ProjectsPage

      "LegislationLink"         || LegislationPage
      "AuthorizationsLink"      || AuthorizationsPage
      "ComplianceOversightLink" || ComplianceOversightPage

      "SubmitFeedbackBtn"       || ContactPage

      "HomeLink"                || HomePage

      "CopyrightLink"           || CopyrightPage
      "DisclaimerLink"          || DisclaimerPage
      "PrivacyLink"             || PrivacyPage
      "AccessibilityLink"       || AccessibilityPage

      "FacebookBtn"             || FacebookPage
      "TwitterBtn"              || TwitterPage
      "GooglePlusBtn"           || GooglePlusPage
  }
}