# In this directory we store the page objects for the Cypress tests

Page objects are used to store selectors and methods for interacting with the application.
This way we centralize the selectors and methods and can reuse them in multiple tests or when the application changes we would only have one location to change the definition.

```
class HomePage {
  path: string = "/sso-requests-sandbox";

  clickLoginButton(){
    cy.get("button").contains("Log in").click();
  }
}

export default HomePage;
```
