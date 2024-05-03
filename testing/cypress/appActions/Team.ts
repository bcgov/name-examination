import { v4 as uuidv4 } from 'uuid';
import TeamPage from '../pageObjects/teamPage';
const regex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

/**
 * Represents a team and its actions.
 */
class Team {
  teamPage = new TeamPage();

  teamName: string;
  userRole: string[];
  userEmail: string[];

  // For Update Purposes
  teamNameNew: string;
  deleteUser: string[];
  addUser: string[];
  addRole: string[];

  // Actions
  createTeam(): boolean {
    this.teamPage.startTeam();
    cy.get('button', { timeout: 10000 }).contains('+ Create a New Team').click({ force: true });
    cy.get(this.teamPage.modalCreateTeam, { timeout: 10000 })
      .should('be.visible')
      .then(() => {
        let myuuid = uuidv4();
        cy.log('Team Name: ' + this.teamName);
        cy.get(this.teamPage.teamName, { timeout: 10000 })
          .clear()
          .type(this.teamName + '-' + myuuid);
        if (this.userEmail.length == 0) {
          cy.get(this.teamPage.deleteUserRole, { timeout: 10000 }).eq(0).click({ force: true });
        } else {
          let n = 0;
          while (this.userEmail.length > n) {
            if (n > 0) {
              cy.get(this.teamPage.addUser, { timeout: 10000 }).first().click({ force: true });
            }
            cy.get(this.teamPage.userEmail, { timeout: 10000 }).eq(n).type(this.userEmail[n]).trigger('select');
            cy.wait(3000);
            cy.realPress('Tab');
            cy.realPress('Tab');
            cy.wait(3000);
            cy.get(this.teamPage.userRole, { timeout: 10000 }).eq(n).select(this.userRole[n]);
            n++;
          }
        }
        cy.get(this.teamPage.sendInvitation, { timeout: 10000 }).click({ force: true }); // or Member
      });
    cy.get(this.teamPage.modalCreateTeam, { timeout: 10000 }).should('not.be.visible');
    return true;
  }

  validateTeam(teamName: string) {}

  updateTeam(): boolean {
    this.teamPage.startTeam();
    //let regex = RegExp(this.teamName + " Updated-");
    let regex = RegExp(this.teamName + '-');

    cy.get('table > tbody > tr > td:nth-child(1)', { timeout: 10000 }).each(($elm, index, $list) => {
      // text captured from column1
      let t = $elm.text();
      // matching criteria
      if (regex.test(t)) {
        this.teamName = t;
        cy.get('table > tbody > tr', { timeout: 10000 }).eq(index).click({ force: true }); // first click to focus and set the row to Active
        if (this.teamNameNew !== '') {
          cy.get(this.teamPage.editTeamButton, { timeout: 10000 }).eq(index).click({ force: true }); // Second on to Edit
          cy.wait(1000);
          cy.get(this.teamPage.modalEditTeam, { timeout: 10000 })
            .should('be.visible')
            .then(() => {
              this.teamNameNew = this.teamNameNew + '-' + uuidv4();
              cy.get(this.teamPage.editTeamName, { timeout: 10000 }).clear().type(this.teamNameNew);
              cy.get(this.teamPage.saveEditTeamName, { timeout: 10000 }).click({ force: true }); // or Member
            });
        }

        // Delete User
        if (this.teamNameNew !== '') {
          cy.get('table').eq(0).click();
          cy.contains('td', this.teamNameNew, { timeout: 10000 }).parent().click({ force: true });
          cy.contains('td', this.teamNameNew, { timeout: 10000 }).parent().click({ force: true });
          cy.wait(2000);
        } else {
          cy.get('table').eq(0).click();
          cy.contains('td', this.teamName, { timeout: 10000 }).parent().click({ force: true });
          cy.contains('td', this.teamName, { timeout: 10000 }).parent().click({ force: true });
          cy.wait(2000);
        }
        let n = 0;
        while (this.deleteUser.length > n) {
          cy.get('table').eq(1).click();
          cy.contains('td', this.deleteUser[n]['useremail'], { timeout: 10000 })
            .parent()
            .within(($tr) => {
              cy.get(this.teamPage.deleteMember, { timeout: 10000 }).click({ force: true }); // clicks the button
            });

          cy.get(this.teamPage.modalDeleteMember, { timeout: 10000 })
            .find(this.teamPage.confirmDeleteTeamMember)
            .click({ force: true });
          n++;
        }

        // Add User
        if (this.addUser.length > 0) {
          if (this.teamNameNew !== '') {
            cy.get('table').eq(0).click();
            cy.contains('td', this.teamNameNew, { timeout: 10000 }).parent().click({ force: true });
            cy.contains('td', this.teamNameNew, { timeout: 10000 }).parent().click({ force: true });
          } else {
            cy.get('table').eq(0).click();
            cy.contains('td', this.teamName, { timeout: 10000 }).parent().click({ force: true });
            cy.contains('td', this.teamName, { timeout: 10000 }).parent().click({ force: true });
          }
          cy.wait(2000);
          cy.get(this.teamPage.addNewTeamMember, { timeout: 10000 }).click();
          cy.wait(2000);

          cy.get(this.teamPage.modalAddMember, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
              let n = 0;
              while (this.addUser.length > n) {
                if (n > 0) {
                  cy.get(this.teamPage.addUser, { timeout: 10000 }).first().click({ force: true });
                }
                cy.wait(2000);
                cy.get(this.teamPage.userEmail, { timeout: 10000 })
                  .eq(n)
                  .type(this.addUser[n]['useremail'].toString())
                  .trigger('input', { timeout: 10000 });
                cy.get(this.teamPage.userRole, { timeout: 10000 }).eq(n).select(this.addUser[n]['userrole'].toString());
                n++;
              }
              cy.get(this.teamPage.confirmDeleteAddTeamMember, { timeout: 10000 }).first().click({
                force: true,
              }); // or Member
            });
        }
      }
    });
    return true;
  }

  deleteTeam(teamName: string) {}

  deleteAllTeams(): boolean {
    let i = 0;
    let deleteTeams = [];
    let teamPage = new TeamPage();
    cy.visit(this.teamPage.path);
    cy.get('button').contains('+ Create a New Team', { timeout: 10000 }).should('be.visible');

    cy.get('table > tbody > tr > td:nth-child(1)')
      .each(($elm, index, $list) => {
        // text captured from column1
        let t = $elm.text();
        // matching criteria
        if (regex.test(t)) {
          deleteTeams[i] = index;
          i++;
        }
      })
      .then(() => {
        i = 0;
        let n = 0;
        while (deleteTeams.length > i) {
          cy.get('table > tbody > tr')
            .eq(deleteTeams[i] - n)
            .click({ force: true }); // first click to focus and set the row to Active
          cy.get(this.teamPage.deleteTeamButton)
            .eq(deleteTeams[i] - n)
            .click({ force: true }); // Second on to delete
          cy.wait(1000);
          cy.get(this.teamPage.modalDeleteTeam).find(this.teamPage.confirmDeleteTeam).click({ force: true });
          cy.wait(2000);
          i++;
          n++;
        }
      });
    return true;
  }

  populateCreateContent(value: any) {
    this.teamName = value.create.teamname;
    this.userRole = value.create.userrole;
    this.userEmail = value.create.useremail;
  }

  populateUpdateContent(value: any) {
    this.teamName = value.create.teamname;
    this.teamNameNew = value.update.teamname;
    this.deleteUser = value.update.deleteuser;
    this.addUser = value.update.adduser;
  }

  showPopulatedContent() {
    cy.log('this.teamName: ' + this.teamName);
    cy.log('this.userRole: ' + this.userRole);
    cy.log('this.userEmail: ' + this.userEmail);
    cy.log('this.teamNameNew: ' + this.teamNameNew);
    cy.log('this.deleteUser: ' + this.deleteUser);
    cy.log('this.addUser: ' + this.addUser);
  }
}
export default Team;
