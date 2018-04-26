import geb.spock.GebReportingSpec

class NamexLandingSpec extends GebReportingSpec {

    def "Basic Landing Page Test"(){
        given:
        to NamexLandingPage

        when:
        homeLink.click()

        then:
        assert unauthenticatedWarning.text() == "You should only see this page if you got here un-authenticated. Please login"
    }

}