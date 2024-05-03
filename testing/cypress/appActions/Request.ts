import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import RequestPage from '../pageObjects/requestPage';
import TeamPage from '../pageObjects/teamPage';
import Utilities from '../appActions/Utilities';
let util = new Utilities();

const regex = new RegExp('@[0-9]{8}');

// IDP Mapping
const idpMap: any = {
  IDIR: 'idir',
  'IDIR - MFA': 'azureidir',
  'Basic BCeID': 'bceidbasic',
  'Business BCeID': 'bceidbusiness',
  'Basic or Business BCeID': 'bceidboth',
  'GitHub BC Gov': 'githubbcgov',
  GitHub: 'githubpublic',
};

// Dealing with tracking file
const filePath = 'cypress/fixtures/createdrequest.json';
// The content to write to the file if it doesn't exist
const fileContent = [];

class Request {
  // Instantiate the page objects we'll be working with
  reqPage = new RequestPage();
  teamPage = new TeamPage();

  // Request Variables
  actionNumber: number;
  additionalRoleAttribute: string;
  agreeWithTerms: boolean;
  apiServiceAccount: boolean;
  authType: string;
  browserFlowOverride: string;
  clientId: string;
  clientName: string;
  conFirm: boolean;
  devDisplayHeaderTitle: boolean;
  devLoginTitle: string;
  devRoles: string[];
  devSamlLogoutPostBindingUri: string;
  devValidRedirectUris: string[];
  environments: string[];
  hasUnreadNotifications: boolean;
  id: string;
  identityProvider: string[];
  idirUserid: string;
  newToSso: boolean;
  newteam: boolean;
  prNumber: number;
  prodDisplayHeaderTitle: boolean;
  prodLoginTitle: string;
  prodRoles: string[];
  prodSamlLogoutPostBindingUri: string;
  prodValidRedirectUris: string[];
  projectLead: boolean;
  projectName: string;
  protocol: string;
  publicAccess: boolean;
  realm: string;
  serviceType: string;
  subMit: boolean;
  team: any;
  teamId: string;
  teamName: string;
  testDisplayHeaderTitle: boolean;
  testLoginTitle: string;
  testRoles: string[];
  testSamlLogoutPostBindingUri: string;
  testValidRedirectUris: string[];
  user: any;
  userId: number;
  usesTeam: boolean;

  // The following are currently not used but are here for future usage
  /*   archived: boolean;
  bceidApproved: boolean;
  createdAt: string;
  devAccessTokenLifespan: number;
  devAssertionLifespan: number;
  devIdps: string[];
  devOfflineSessionIdleTimeout: number;
  devOfflineSessionMaxLifespan: number;
  devSessionIdleTimeout: number;
  devSessionMaxLifespan: number;
  githubApproved: boolean;
  idirUserDisplayName: string;
  lastChanges: any[] | null;
  prodAccessTokenLifespan: number;
  prodAssertionLifespan: number;
  prodIdps: string[];
  prodOfflineSessionIdleTimeout: number;
  prodOfflineSessionMaxLifespan: number;
  prodSessionIdleTimeout: number;
  prodSessionMaxLifespan: number;
  provisioned: boolean;
  provisionedAt: string;
  requester: string;
  status: string;
  testAccessTokenLifespan: number;
  testAssertionLifespan: number;
  testIdps: string[];
  testOfflineSessionIdleTimeout: number;
  testOfflineSessionMaxLifespan: number;
  testSessionIdleTimeout: number;
  testSessionMaxLifespan: number;
  updatedAt: string;
  userTeamRole: string; */
  // ************************************************************************

  // Actions
  createRequest() {
    this.reqPage.startRequest();

    // Tab 1: Requester Info
    this.reqPage.setProjectName(this.projectName + '@' + util.getDate());
    this.reqPage.setTeam(this.usesTeam);
    if (this.usesTeam) {
      if (this.newteam) {
        this.createTeamfromRequest();
        cy.contains('successfully created');
      } else {
        this.reqPage.setTeamName(this.teamName);
      }
    } else {
      this.reqPage.setProjectLead(this.projectLead);
      if (!this.projectLead) {
        this.reqPage.confirmClose();
        cy.visit('/my-dashboard'); // return to dashboard
        return;
      }
    }
    cy.wait(1000);
    this.reqPage.pageNext();
    cy.wait(2000);

    // Tab 2: Basic Info
    this.reqPage.setClientProtocol(this.protocol);
    if (this.protocol === 'oidc') {
      this.reqPage.setAuthType(this.authType);
      if (this.authType != 'service-account') {
        if (this.authType != 'both') {
          this.reqPage.setPublicAccess(this.publicAccess);
        }
        this.reqPage.setIdentityProvider(this.identityProvider);
      }
    } else {
      this.reqPage.setIdentityProvider(this.identityProvider);
    }

    this.reqPage.setEnvironment(this.environments);
    if (this.protocol === 'oidc') {
      this.reqPage.setadditionalRoleAttribute(this.additionalRoleAttribute);
    }
    cy.get('p').contains('Last saved at').wait(2000);
    this.reqPage.pageNext();

    // Tab 3: Development
    if (this.authType != 'service-account') {
      this.reqPage.setLoginNameDev(this.devLoginTitle || this.projectName);
      this.reqPage.setHeaderTitleDev(this.devDisplayHeaderTitle);
      this.setDevUri(this.devValidRedirectUris);
    }
    cy.get('p').contains('Last saved at').wait(2000);
    this.reqPage.pageNext();

    // Tab 3: Test
    if (this.environments.includes('test')) {
      if (this.authType != 'service-account') {
        this.reqPage.setLoginNameTest(this.testLoginTitle || this.projectName);
        this.reqPage.setHeaderTitleTest(this.testDisplayHeaderTitle);
        this.setTestUri(this.testValidRedirectUris);
      }
      cy.get('p').contains('Last saved at').wait(2000);
      this.reqPage.pageNext();
    }

    // Tab 3: Production
    if (this.environments.includes('prod')) {
      if (this.authType != 'service-account') {
        this.reqPage.setLoginNameProd(this.prodLoginTitle || this.projectName);
        this.reqPage.setHeaderTitleProd(this.prodDisplayHeaderTitle);
        this.setProdUri(this.prodValidRedirectUris);
      }
      cy.get('p').contains('Last saved at').wait(2000);
      this.reqPage.pageNext();
    }

    this.reqPage.agreeWithTrms(this.agreeWithTerms);
    cy.get('p').contains('Last saved at').wait(2000);
    this.reqPage.pageNext();

    this.reqPage.submitRequest(this.subMit);
    cy.wait(3000);
    this.reqPage.confirmDelete(this.conFirm);
    cy.wait(3000);

    // Navigate to the page if not there already (e.g for admins)
    cy.visit(this.reqPage.path);

    // Make sure the commit has been done.
    cy.get(this.reqPage.integrationsTable, { timeout: 20000 });

    cy.task('checkFileExists', filePath).then((exists) => {
      if (!exists) {
        // File doesn't exist, so create it
        cy.writeFile(filePath, fileContent);
      }
    });

    // Get the ID of the request just created make it available to the class
    // and write it to a file, so that it can be deleted later.
    cy.get(this.reqPage.integrationsTable)
      .first()
      .then(($id) => {
        this.id = $id.text();
        Cypress.env(util.md5(this.projectName), $id.text());
        cy.log('Request ID: ' + this.id);
        cy.readFile('cypress/fixtures/createdrequest.json').then((data) => {
          data.push(this.id);
          cy.writeFile('cypress/fixtures/createdrequest.json', data);
        });
      });
  }

  validateRequest(id: string): boolean {
    let n = 0;
    cy.log('Validate Request: ' + id);
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 })
      .parent()
      .click()
      .scrollIntoView()
      .within(() => {
        cy.get(this.reqPage.editButton).click({ force: true });
      });

    // Goto the preview tab
    cy.get(this.reqPage.prev_Tab).click();
    cy.get('h1').contains('Review and Submit');

    if (this.usesTeam) {
      cy.get(this.reqPage.prev_AssociatedTeam).contains(this.teamName);
    }

    if (this.protocol === 'oidc') {
      cy.get(this.reqPage.prev_clientProtocol).contains('OpenID Connect');
    } else {
      cy.get(this.reqPage.prev_clientProtocol).contains('SAML');
    }

    // Check Public or Confidential access, only when protocol is not SAML
    if (this.protocol !== 'saml') {
      if (this.publicAccess == true) {
        cy.get(this.reqPage.prev_ClientTypeTeam).contains('Public');
      } else {
        cy.get(this.reqPage.prev_ClientTypeTeam).contains('Confidential');
      }
    }

    // Check the Auth Type/Use Case
    if (this.authType === 'browser-login') {
      cy.get(this.reqPage.prev_UseCase).contains('Browser Login');
    } else if (this.authType === 'service-account') {
      cy.get(this.reqPage.prev_UseCase).contains('Service Account');
    } else {
      if (this.authType !== '') {
        cy.get(this.reqPage.prev_UseCase).contains('Browser Login & Service Account');
      }
    }

    // Check the Project Name
    cy.get(this.reqPage.prev_ProjectName).contains(this.projectName);

    // Check the Additional Role Attribute
    if (this.additionalRoleAttribute) {
      if (this.protocol === 'oidc') {
        cy.get(this.reqPage.prev_AddRoleAttribute).contains(this.additionalRoleAttribute);
      }
    }

    // Check the identity providers
    if (this.identityProvider[0] !== '') {
      n = 0;
      while (n < this.identityProvider.length) {
        if (this.identityProvider[n] !== '') {
          cy.get(this.reqPage.prev_IdpRequired).contains(this.identityProvider[n]);
        }
        n++;
      }
    }

    if (this.authType != 'service-account') {
      // Check the redirect URIs per environment
      // Dev
      if (this.devValidRedirectUris[0] !== '') {
        n = 0;
        while (n < this.devValidRedirectUris.length) {
          if (this.devValidRedirectUris[n] !== '') {
            if (this.devValidRedirectUris.length == 1) {
              cy.get(this.reqPage.prev_DevUri).contains(this.devValidRedirectUris[n]);
            } else {
              cy.contains('td', this.devValidRedirectUris[n]);
            }
          }
          n++;
        }
      }

      // Test
      if (this.testValidRedirectUris[0] !== '') {
        n = 0;
        while (n < this.testValidRedirectUris.length) {
          if (this.testValidRedirectUris[n] !== '') {
            if (this.testValidRedirectUris.length == 1) {
              cy.get(this.reqPage.prev_TestUri).contains(this.testValidRedirectUris[n]);
            } else {
              cy.contains('td', this.testValidRedirectUris[n]);
            }
          }
          n++;
        }
      }

      // Prod
      if (this.prodValidRedirectUris[0] !== '') {
        n = 0;
        while (n < this.prodValidRedirectUris.length) {
          if (this.prodValidRedirectUris[n] !== '') {
            if (this.prodValidRedirectUris.length == 1) {
              cy.get(this.reqPage.prev_ProdUri).contains(this.prodValidRedirectUris[n]);
            } else {
              cy.contains('td', this.prodValidRedirectUris[n]);
            }
          }
          n++;
        }
      }
    }

    // Back to the dashboard page
    cy.visit(this.reqPage.path);

    return true;
  }

  updateRequest(id: string): boolean {
    cy.log('Update Request: ' + id);
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 })
      .parent()
      .click()
      .scrollIntoView()
      .within(() => {
        cy.get(this.reqPage.editButton).click({ force: true });
      });

    // Tab 1: Requester Info
    if (this.projectName !== '') {
      this.reqPage.setProjectName(this.projectName + '@' + util.getDate());
    }
    if (this.reqPage.usesTeam) {
      this.reqPage.setTeam(this.usesTeam);
      if (this.teamName) {
        if (this.newteam) {
          this.createTeamfromRequest();
          cy.wait(2000);
        } else {
          this.reqPage.setTeamName(this.teamName);
        }
      }
    } else {
      if (this.projectLead) {
        this.reqPage.setProjectLead(this.projectLead);
      } else {
        if (!this.projectLead) {
          this.reqPage.confirmClose();
          cy.visit('/my-dashboard'); // return to dashboard
          return false;
        }
      }
    }

    this.reqPage.pageNext();
    cy.wait(2000);

    // Tab 2: Basic Info

    if (this.protocol == 'oidc') {
      if (this.publicAccess != null) {
        this.reqPage.setPublicAccess(this.publicAccess);
      }
    }
    if (this.authType != 'service-account') {
      if (this.identityProvider[0] !== '') {
        this.reqPage.setIdentityProvider(this.identityProvider);
      }
    }

    if (this.additionalRoleAttribute) {
      if (this.protocol === 'oidc') {
        this.reqPage.setadditionalRoleAttribute(this.additionalRoleAttribute);
      }
    }
    cy.wait(2000);
    this.reqPage.pageNext();

    // Tab 3: Development
    if (this.authType != 'service-account') {
      if (this.devLoginTitle) {
        this.reqPage.setLoginNameDev(this.devLoginTitle);
      }
      if (this.devDisplayHeaderTitle) {
        this.reqPage.setHeaderTitleDev(this.devDisplayHeaderTitle);
      }
      if (this.devValidRedirectUris[0] !== '') {
        this.setDevUri(this.devValidRedirectUris);
      }
    }

    cy.wait(2000);
    this.reqPage.pageNext();

    // Tab 3: Test
    if (this.environments.includes('test')) {
      if (this.authType != 'service-account') {
        if (this.testLoginTitle) {
          this.reqPage.setLoginNameTest(this.testLoginTitle || this.projectName);
        }
        if (this.testDisplayHeaderTitle) {
          this.reqPage.setHeaderTitleTest(this.testDisplayHeaderTitle);
        }
        if (this.testValidRedirectUris[0] !== '') {
          this.setTestUri(this.testValidRedirectUris);
        }
        cy.wait(2000);
        this.reqPage.pageNext();
      }
    }

    // Tab 3: Production
    if (this.environments.includes('prod')) {
      if (this.authType != 'service-account') {
        if (this.prodLoginTitle) {
          this.reqPage.setLoginNameProd(this.prodLoginTitle);
        }
        if (this.prodDisplayHeaderTitle) {
          this.reqPage.setHeaderTitleProd(this.prodDisplayHeaderTitle);
        }
        if (this.prodValidRedirectUris[0] !== '') {
          this.setProdUri(this.prodValidRedirectUris);
        }
      }
      cy.wait(2000);
      this.reqPage.pageNext();
    }

    cy.get(this.reqPage.stageReviewSubmit).click();
    cy.wait(2000);

    this.reqPage.updateRequest(this.subMit);
    this.reqPage.confirmDelete(this.conFirm);
    cy.get(this.reqPage.integrationsTable, { timeout: 20000 });

    return true;
  }

  deleteRequest(id: string) {
    cy.log('Delete Request: ' + id);
    cy.visit(this.reqPage.path);
    // identify first column
    cy.get(this.reqPage.integrationsTable, { timeout: 10000 }).each(($elm, index) => {
      // text captured from column1
      let t = $elm.text();
      // matching criteria
      if (t.includes(id)) {
        cy.get(this.reqPage.integrationsTable).eq(index).scrollIntoView();
        cy.get(this.reqPage.integrationsTableStatus)
          .eq(index)
          .then(($status) => {
            cy.log($status.text());

            // Wait for the request to complete before deleting
            while (!$status.text().includes('Completed')) {
              cy.wait(10000);
              cy.reload();
              cy.get(this.reqPage.integrationsTableStatus)
                .eq(index)
                .then(($status) => {
                  cy.log($status.text());
                });
            }
            if ($status.text().includes('Completed')) {
              cy.get(this.reqPage.deleteButton).eq(index).click({ force: true });
              cy.wait(3000);
              this.reqPage.confirmDeleteIntegration(id);
              cy.log('Delete Request: ' + id.toString());
            } else {
              cy.log('Request is not in Completed status. Cannot delete.');
            }
          });
      }
    });
  }

  deleteAllRequests() {
    cy.visit(this.reqPage.path);

    // identify first column
    cy.get(this.reqPage.integrationsTableName).each(($elm, index) => {
      // text captured from column1
      let t = $elm.text();
      let id = $elm.prev().text();
      // matching criteria
      if (regex.test(t)) {
        cy.get(this.reqPage.integrationsTable).eq(index).scrollIntoView();
        cy.get(this.reqPage.deleteButton).eq(index).click({ force: true });
        cy.wait(3000);
        this.reqPage.confirmDeleteIntegration(id);
        cy.log('Delete Request: ' + id.toString());
      }
    });
  }

  addRoles() {
    let env = 'dev';
    if (this.devRoles.add) {
      let env = 'dev';
      let addRole = this.devRoles.add;
      let n = 0;
      while (n < addRole.length) {
        this.addRole(this.id, addRole[n].role, env);
        cy.wait(5000);
        n++;
      }
    }
    if (this.testRoles.add) {
      let env = 'test';
      let addRole = this.testRoles.add;
      let n = 0;
      while (n < addRole.length) {
        this.addRole(this.id, addRole[n].role, env);
        cy.wait(5000);
        n++;
      }
    }
    if (this.prodRoles.add) {
      let env = 'prod';
      let addRole = this.prodRoles.add;
      let n = 0;
      while (n < addRole.length) {
        this.addRole(this.id, addRole[n].role, env);
        cy.wait(5000);
        n++;
      }
    }
  }

  processRoles(roles: any, environment: string) {
    console.log(roles);
    if (roles?.addusertorole) {
      roles.addusertorole.forEach((role: any) => {
        this.addUsertoRole(this.id, role.role, environment, role.user);
        cy.wait(5000); // Consider alternative approaches to avoid blocking operation
      });
    }
  }

  addUserToRoles() {
    this.processRoles(this.devRoles, 'dev');
    this.processRoles(this.testRoles, 'test');
    this.processRoles(this.prodRoles, 'prod');
  }

  addRole(id: string, role: string, env: string) {
    cy.log('Add Role ' + id);
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 }).parent().click().scrollIntoView();

    cy.get(this.reqPage.tabTechDetails).click();
    cy.get(this.reqPage.tabRoleManagement).click();
    if (env === 'dev') {
      cy.get('#rc-tabs-2-tab-dev').click();
    } else if (env === 'test') {
      cy.get('#rc-tabs-2-tab-test').click();
    } else if (env === 'prod') {
      cy.get('#rc-tabs-2-tab-prod').click();
    }
    cy.get(this.reqPage.createRoleButton).click();
    cy.get(this.reqPage.roleNameInputField).first().clear().type(role);
    cy.get(this.reqPage.roleEnvironment)
      .first()
      .clear()
      .type(env + '{enter}');

    cy.get(this.reqPage.confirmCreateNewRole).click({
      force: true,
    });
  }

  addUsertoRole(id: string, role: string, env: string, user: string): boolean {
    cy.log('Add User to Role ' + id);
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 }).parent().click().scrollIntoView();

    if (this.authType === 'service-account') {
      cy.get('#rc-tabs-1-tab-service-account-role-management', { timeout: 10000 }).click();
      cy.wait(2000);
      cy.get('#rc-tabs-1-tab-service-account-role-management', { timeout: 10000 }).then(() => {
        cy.get('#rc-tabs-2-tab-' + env).click();
        cy.get('input[id^="react-select-"]').type(role + '{enter}');
        cy.wait(2000);
      });
    } else {
      cy.get(this.reqPage.tabUserRoleManagement).click();
      cy.wait(2000);
      cy.get(this.reqPage.tabUserRoleManagement).then(() => {
        this.reqPage.setRoleEnvironment(env);
        this.reqPage.setRoleIdp(this.identityProvider[0]);
        this.reqPage.setRoleCriterion('First Name');
        this.reqPage.setRoleSearch(user);
        cy.wait(2000);
        //this.reqPage.setRolePaging('15');
        this.reqPage.setRolePickUser(user);
        cy.wait(2000);
        this.reqPage.setRoleAssignSelect(role);
        cy.wait(2000);
      });
    }

    return true;
  }

  createCompositeRole(id: string, role_main: string, role_second: string, env: string): boolean {
    cy.log('Add Composite Role ' + id);
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 }).parent().click().scrollIntoView();

    cy.get(this.reqPage.tabTechDetails).click();
    cy.get(this.reqPage.tabRoleManagement)
      .click()
      .then(() => {
        cy.wait(2000);
        cy.get('#rc-tabs-2-tab-' + env).click();
        cy.contains('td', role_main)
          .parent()
          .within(($el) => {
            cy.wrap($el).click();
          });
        //cy.get('[id*="-tab-Composite"]').click();
        cy.findByRole('tab', { name: 'Composite Roles' }).click();
        cy.wait(3000);
        cy.get('input[id^="react-select-"][role ="combobox"]')
          .eq(0)
          .type(role_second + '{enter}');
        //cy.findByRole('combobox').type(role_second + "{enter}" );
        cy.wait(3000);
      });

    return true;
  }

  processCreateCompositeRoles(roles: any, environment: string) {
    if (roles?.composite) {
      roles.composite.forEach((role: any) => {
        this.createCompositeRole(this.id, role.role_main, role.role_second, environment);
        cy.wait(3000); // Consider alternative approaches to avoid blocking operation
      });
    }
  }

  createCompositeRoles() {
    this.processCreateCompositeRoles(this.devRoles, 'dev');
    this.processCreateCompositeRoles(this.testRoles, 'test');
    this.processCreateCompositeRoles(this.prodRoles, 'prod');
  }

  processRolesRemoval(roles: any, environment: string) {
    if (roles?.remove) {
      roles.remove.forEach((role: any) => {
        this.removeRole(this.id, role.role, environment);
        cy.wait(3000); // Consider alternative approaches to avoid blocking operation
      });
    }
  }

  removeRoles() {
    this.processRolesRemoval(this.devRoles, 'dev');
    this.processRolesRemoval(this.testRoles, 'test');
    this.processRolesRemoval(this.prodRoles, 'prod');
  }

  removeRole(id: string, role: string, env: string): boolean {
    cy.log('Remove Role ' + id);
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 }).parent().click().scrollIntoView();

    cy.get(this.reqPage.tabTechDetails).click();
    cy.get(this.reqPage.tabRoleManagement)
      .click()
      .then(() => {
        cy.wait(2000);
        cy.get('#rc-tabs-2-tab-' + env).click();
        cy.contains('td', role)
          .parent()
          .within(($el) => {
            cy.wrap($el).click();
            cy.wait(3000);
            cy.get('svg').click();
          });
        cy.get(this.reqPage.confirmDeleteRole).click({ force: true });
        cy.wait(3000);
      });

    return true;
  }

  searchUser(id: string, environment: string, idp: string, criterion: string, error: boolean, search_value: string) {
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 }).parent().click().scrollIntoView();

    cy.get(this.reqPage.tabUserRoleManagement).click();
    cy.wait(2000);
    cy.get(this.reqPage.tabUserRoleManagement).then(() => {
      this.reqPage.setRoleEnvironment(environment);
      this.reqPage.setRoleIdp(idp);
      this.reqPage.setRoleCriterion(criterion);
      this.reqPage.setRoleSearch(search_value);
      cy.wait(3000);
      if (error) {
        cy.contains('div', 'The user you searched for does not exist.').should('be.visible');
      } else {
        if (criterion !== 'IDP GUID') {
          this.reqPage.setRolePickUser(search_value);
        }
      }
    });
  }

  searchIdim(id: string, environment: string, idp: string, criterion: string, error: boolean, search_value: string) {
    cy.visit(this.reqPage.path);

    cy.contains('td', id, { timeout: 10000 }).parent().click().scrollIntoView();

    cy.get(this.reqPage.tabUserRoleManagement).click();
    cy.wait(2000);
    cy.get(this.reqPage.tabUserRoleManagement).then(() => {
      this.reqPage.setRoleEnvironment(environment);
      //this.reqPage.setRoleIdp(idp);
      //this.reqPage.setRoleCriterion(criterion);
      this.reqPage.setRoleSearch(faker.string.uuid()); // just a fake value to trigger an error response
      cy.contains('div', 'The user you searched for does not exist.', { timeout: 10000 }).should('be.visible');
      cy.get(this.reqPage.idimSearchButton).click({ force: true });
      cy.get(this.reqPage.idimWebserviceLookup, { timeout: 10000 }).should('be.visible');
      cy.get(this.reqPage.idimWebserviceLookup).within(() => {
        cy.get('input')
          .first()
          .type(idp + '{enter}');
        cy.get('input[id^="react-select-"]')
          .eq(1)
          .type(criterion + '{enter}');
        cy.get('input').eq(2).clear().type(search_value);
        cy.get('button[type="button"]').contains('Search').click({ force: true });
        cy.wait(1000);
        cy.contains('td', search_value).should('be.visible');
        cy.contains('td', search_value)
          .first()
          .parent()
          .within(() => {
            cy.get(this.reqPage.idimViewDetails).click({ force: true });
          });
      });
      cy.get(this.reqPage.idimAdditionalUserInfo, { timeout: 10000 }).within(() => {
        cy.contains('div', search_value).should('be.visible');
        cy.get(this.reqPage.idimCancelAddUserInfo, { timeout: 10000 }).click({ force: true });
      });

      cy.get(this.reqPage.idimWebserviceLookup).within(() => {
        cy.contains('td', search_value)
          .first()
          .parent()
          .within(() => {
            cy.get(this.reqPage.idimDownloadUser).click({ force: true });
          });
      });
    });
  }

  // Tools
  showCreateContent(value: any) {
    cy.log('test_id: ' + value.create.test_id);
    cy.log('projectname: ' + value.create.projectname);
    cy.log('team: ' + value.create.team);
    cy.log('teamname: ' + value.create.teamname);
    cy.log('newteam: ' + value.create.newteam);
    cy.log('publicaccess: ' + value.create.publicaccess);
    cy.log('protocol: ' + value.create.protocol);
    cy.log('authtype: ' + value.create.authtype);
    cy.log('identityprovider: ' + value.create.identityprovider);
    cy.log('additionalroleattribute: ' + value.create.additionalroleattribute);
    cy.log('redirecturi: ' + value.create.redirecturi);
    cy.log('redirecturitest: ' + value.create.redirecturitest);
    cy.log('redirecturiprod: ' + value.create.redirecturiprod);
    cy.log('displayheader: ' + value.create.displayheader);
    cy.log('displayheadertest: ' + value.create.displayheadertest);
    cy.log('displayheaderprod: ' + value.create.displayheaderprod);
    cy.log('ssoheaderdev: ' + value.create.ssoheaderdev);
    cy.log('ssoheadertest: ' + value.create.ssoheadertest);
    cy.log('ssoheaderprod: ' + value.create.ssoheaderprod);
    cy.log('Environments: ' + value.create.environments);
    cy.log('agreeWithTermstrue: ' + value.create.agreeWithTermstrue);
    cy.log('submit: ' + value.create.submit);
    cy.log('confirm: ' + value.create.confirm);
    cy.log('description: ' + value.create.description);
    cy.log('Dev Roles: ' + JSON.stringify(value.devroles, null, 2));
    cy.log('Test Roles: ' + JSON.stringify(value.testroles, null, 2));
    cy.log('Prod Roles: ' + JSON.stringify(value.prodroles, null, 2));
  }

  showUpdateContent(value: any) {
    cy.log('id: ' + value.id);
    cy.log('test_id: ' + value.update.test_id);
    cy.log('projectname: ' + value.update.projectname);
    cy.log('team: ' + value.update.team);
    cy.log('teamname: ' + value.update.teamname);
    cy.log('newteam: ' + value.create.newteam);
    cy.log('publicaccess: ' + value.update.publicaccess);
    cy.log('protocol: ' + value.update.protocol);
    cy.log('authtype: ' + value.update.authtype);
    cy.log('identityprovider: ' + value.update.identityprovider);
    cy.log('additionalroleattribute: ' + value.update.additionalroleattribute);
    cy.log('redirecturi: ' + value.update.redirecturi);
    cy.log('redirecturitest: ' + value.update.redirecturitest);
    cy.log('redirecturiprod: ' + value.update.redirecturiprod);
    cy.log('displayheader: ' + value.update.displayheader);
    cy.log('displayheadertest: ' + value.update.displayheadertest);
    cy.log('displayheaderprod: ' + value.update.displayheaderprod);
    cy.log('ssoheaderdev: ' + value.create.ssoheaderdev);
    cy.log('ssoheadertest: ' + value.create.ssoheadertest);
    cy.log('ssoheaderprod: ' + value.create.ssoheaderprod);
    cy.log('Environments: ' + value.update.environments);
    cy.log('Dev Roles: ' + JSON.stringify(value.devroles, null, 2));
    cy.log('Test Roles: ' + JSON.stringify(value.testroles, null, 2));
    cy.log('Prod Roles: ' + JSON.stringify(value.prodroles, null, 2));
  }

  populateCreateContent(value: any) {
    this.id = value.id;
    this.projectName = value.create.projectname; // faker.company.catchPhrase(); when no value is supplied
    this.usesTeam = value.create.team;
    this.teamName = value.create.teamname;
    this.newteam = value.create.newteam;
    this.projectLead = value.create.projectlead;
    this.publicAccess = value.create.publicaccess;
    this.protocol = value.create.protocol;
    this.authType = value.create.authtype;
    this.identityProvider = value.create.identityprovider;
    this.additionalRoleAttribute = value.create.additionalroleattribute;
    this.devValidRedirectUris = value.create.redirecturi;
    this.testValidRedirectUris = value.create.redirecturitest;
    this.prodValidRedirectUris = value.create.redirecturiprod;
    this.devDisplayHeaderTitle = value.create.displayheader;
    this.testDisplayHeaderTitle = value.create.displayheadertest;
    this.prodDisplayHeaderTitle = value.create.displayheaderprod;
    this.devLoginTitle = value.create.ssoheaderdev;
    this.testLoginTitle = value.create.ssoheadertest;
    this.prodLoginTitle = value.create.ssoheaderprod;
    this.environments = value.create.environments;
    this.agreeWithTerms = value.create.agreeWithTermstrue;
    this.subMit = value.create.submit;
    this.conFirm = value.create.confirm;
    this.devRoles = value.devroles;
    this.testRoles = value.testroles;
    this.prodRoles = value.prodroles;
  }
  showPopulatedContent() {
    cy.log('this.id: ' + this.id);
    cy.log('this.projectName: ' + this.projectName);
    cy.log('this.usesTeam: ' + this.usesTeam);
    cy.log('this.teamName: ' + this.teamName);
    cy.log('this.newteam: ' + this.newteam);
    cy.log('this.projectLead: ' + this.projectLead);
    cy.log('this.publicAccess: ' + this.publicAccess);
    cy.log('this.protocol: ' + this.protocol);
    cy.log('this.authType: ' + this.authType);
    cy.log('this.identityProvider: ' + this.identityProvider);
    cy.log('this.additionalRoleAttribute: ' + this.additionalRoleAttribute);
    cy.log('this.devValidRedirectUris: ' + this.devValidRedirectUris);
    cy.log('this.testValidRedirectUris: ' + this.testValidRedirectUris);
    cy.log('this.prodValidRedirectUris: ' + this.prodValidRedirectUris);
    cy.log('this.devDisplayHeaderTitle: ' + this.devDisplayHeaderTitle);
    cy.log('this.testDisplayHeaderTitle: ' + this.testDisplayHeaderTitle);
    cy.log('this.prodDisplayHeaderTitle: ' + this.prodDisplayHeaderTitle);
    cy.log('this.devLoginTitle: ' + this.devLoginTitle);
    cy.log('this.testLoginTitle: ' + this.testLoginTitle);
    cy.log('this.prodLoginTitle: ' + this.prodLoginTitle);
    cy.log('this.environments: ' + this.environments);
    cy.log('this.agreeWithTerms: ' + this.agreeWithTerms);
    cy.log('this.subMit: ' + this.subMit);
    cy.log('this.conFirm: ' + this.conFirm);
  }

  populateUpdateContent(value: any) {
    this.id = value.id;
    this.projectName = value.update.projectname;
    this.usesTeam = value.update.team;
    this.teamName = value.update.teamname;
    this.newteam = value.update.newteam;
    this.projectLead = value.update.projectlead;
    this.publicAccess = value.update.publicaccess;
    this.protocol = value.create.protocol; // unchangeable so we capture the set value
    this.authType = value.create.authtype; // unchangeable so we capture the set value
    this.identityProvider = value.update.identityprovider;
    this.additionalRoleAttribute = value.update.additionalroleattribute;
    this.devValidRedirectUris = value.update.redirecturi;
    this.testValidRedirectUris = value.update.redirecturitest;
    this.prodValidRedirectUris = value.update.redirecturiprod;
    this.devDisplayHeaderTitle = value.update.displayheader;
    this.testDisplayHeaderTitle = value.update.displayheadertest;
    this.prodDisplayHeaderTitle = value.update.displayheaderprod;
    this.devLoginTitle = value.update.ssoheaderdev;
    this.testLoginTitle = value.update.ssoheadertest;
    this.prodLoginTitle = value.update.ssoheaderprod;
    this.environments = value.create.environments;
    this.subMit = value.create.submit;
    this.conFirm = value.create.confirm;
    this.devRoles = value.devroles;
    this.testRoles = value.testroles;
    this.prodRoles = value.prodroles;
  }

  populateUpdateValidationContent(value: any) {
    this.id = value.id;
    if (value.update.projectname !== '' && value.update.projectname !== value.create.projectname) {
      this.projectName = value.update.projectname;
    }
    if (value.update.team !== null && value.update.team !== value.create.team) {
      this.usesTeam = value.update.team;
    }
    if (value.update.teamname !== '' && value.update.teamname !== value.create.teamname) {
      this.teamName = value.update.teamname;
    }
    if (value.update.newteam !== null && value.update.newteam !== value.create.newteam) {
      this.newteam = value.update.newteam;
    }
    if (value.update.projectlead !== '' && value.update.projectlead !== value.create.projectlead) {
      this.projectLead = value.update.projectlead;
    }
    if (value.update.publicaccess !== null && value.update.publicaccess !== value.create.publicaccess) {
      this.publicAccess = value.update.publicaccess;
    }
    this.protocol = value.create.protocol; // unchangeable so we capture the set value
    this.authType = value.create.authtype; // unchangeable so we capture the set value

    if (value.update.identityprovider !== '' && value.update.identityprovider !== value.create.identityprovider) {
      this.identityProvider = value.update.identityprovider;
    }
    if (value.update.additionalroleattribute !== value.create.additionalroleattribute) {
      this.additionalRoleAttribute = value.update.additionalroleattribute;
    }
    if (value.update.redirecturi.length !== 0) {
      this.devValidRedirectUris = value.update.redirecturi;
    }
    if (value.update.redirecturitest.length !== 0) {
      this.testValidRedirectUris = value.update.redirecturitest;
    }
    if (value.update.redirecturiprod.length !== 0) {
      this.prodValidRedirectUris = value.update.redirecturiprod;
    }
    if (value.update.displayheader !== null && value.update.displayheader !== value.create.displayheader) {
      this.devDisplayHeaderTitle = value.update.displayheader;
    }
    if (value.update.displayheadertest !== null && value.update.displayheadertest !== value.create.displayheadertest) {
      this.testDisplayHeaderTitle = value.update.displayheadertest;
    }
    if (value.update.displayheaderprod !== null && value.update.displayheaderprod !== value.create.displayheaderprod) {
      this.prodDisplayHeaderTitle = value.update.displayheaderprod;
    }
    if (value.update.ssoheaderdev !== '' && value.update.ssoheaderdev !== value.create.ssoheaderdev) {
      this.devLoginTitle = value.update.ssoheaderdev;
    }
    if (value.update.ssoheadertest !== '' && value.update.ssoheadertest !== value.create.ssoheadertest) {
      this.testLoginTitle = value.update.ssoheadertest;
    }
    if (value.update.ssoheaderprod !== '' && value.update.ssoheaderprod !== value.create.ssoheaderprod) {
      this.prodLoginTitle = value.update.ssoheaderprod;
    }

    this.environments = value.create.environments;
    this.subMit = value.create.submit;
    this.conFirm = value.create.confirm;
    this.devRoles = value.devroles;
    this.testRoles = value.testroles;
    this.prodRoles = value.prodroles;
  }

  createTeamfromRequest() {
    cy.get('#root > div > svg').click({ force: true });
    cy.get('#create-team-modal')
      .should('be.visible')
      .then(() => {
        let myuuid = uuidv4();
        cy.log('Team Name: ' + this.teamName);
        cy.get('[data-testid="team-name"]')
          .clear()
          .type(this.teamName + '-' + myuuid);
        cy.get('#react-select-2-input').focus().clear();
        cy.get('#react-select-2-input')
          .type('pathfinder.ssotraining2@gov.bc.ca', {
            force: true,
            delay: util.getRandomInt(50, 500),
          })
          .trigger('select');
        cy.wait(3000);
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.wait(3000);

        cy.get(this.teamPage.userRole).eq(0).select('Admin');
        cy.get('[data-testid="send-invitation"]').click({ force: true });
      });
  }

  setDevUri(tempUri: string[]) {
    let n = 0;
    while (tempUri.length > n) {
      if (n > 0) {
        cy.get('[data-testid="add-uri"]').click({ force: true });
      }
      cy.get('#root_devValidRedirectUris_' + n.toString()).clear();
      cy.get('#root_devValidRedirectUris_' + n.toString()).type(tempUri[n]);
      n++;
    }
  }
  setTestUri(tempUri: string[]) {
    let n = 0;
    while (tempUri.length > n) {
      if (n > 0) {
        cy.get('[data-testid="add-uri"]').click({ force: true });
      }
      cy.get('#root_testValidRedirectUris_' + n.toString()).clear();
      cy.get('#root_testValidRedirectUris_' + n.toString()).type(tempUri[n]);
      n++;
    }
  }
  setProdUri(tempUri: string[]) {
    let n = 0;
    while (tempUri.length > n) {
      if (n > 0) {
        cy.get('[data-testid="add-uri"]').click({ force: true });
      }
      cy.get('#root_prodValidRedirectUris_' + n.toString()).clear();
      cy.get('#root_prodValidRedirectUris_' + n.toString()).type(tempUri[n]);
      n++;
    }
  }

  getID(name: string) {
    return cy
      .log('Get ID: ' + name) // Start the command chain with a log.
      .visit(this.reqPage.path) // Visit the page.
      .contains('td', name, { timeout: 10000 })
      .scrollIntoView() // Find the name and scroll into view.
      .contains('td', name, { timeout: 10000 }) // Find the name again to ensure visibility.
      .prev() // Get the previous element, presumably the ID.
      .then(($id) => {
        const idText = $id.text();
        Cypress.env('integration_id', idText);
        this.id = idText; // Set the ID on your class instance.
        cy.log('Found ID: ' + idText); // Log the found ID.
      });
  }
}

export default Request;
