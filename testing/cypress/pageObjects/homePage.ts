class HomePage {
  path: string = '/';

  clickLoginButton() {
    cy.get('button').contains('Log in').click();
  }
}

export default HomePage;
