import geb.Page

class NamexLandingPage extends Page {

    static url = "/"

    static at = { title == "BC Registry: Name Examination" }

    static content = {
        unauthenticatedWarning  { $("#app > div:nth-child(2) > div > h2") }
        homeLink { $("#navbarSupportedContent > ul > li:nth-child(1) > a") }
    }
}




