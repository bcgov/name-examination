class TeamPage {
  path: string = '/my-dashboard/teams';

  addiEmail: string = 'input[type="email"][data-testid="addi-email"]';
  confirmDeleteTeam: string = '[data-testid="confirm-delete-delete-team"]';
  confirmDeleteTeamMember: string = '[data-testid="confirm-delete-delete-team-member"]';
  confirmDeleteAddTeamMember: string = '[data-testid="confirm-delete-add-a-new-team-member"]';
  editTeamButton: string = '[data-testid="edit-team-button"]';
  deleteTeamButton: string = '[data-testid="delete-team-button"]';
  teamName: string = '[data-testid="team-name"]';
  sendInvitation: string = 'button[data-testid="send-invitation"]';
  modalCancelBtn: string = 'button[data-testid^="modal-cancel-btn"]';
  modalConfirmBtn: string = 'button[data-testid^="modal-confirm-btn"]';
  modalCreateTeam: string = '#create-team-modal';
  modalDeleteTeam: string = '#delete-team-modal';
  modalAddMember: string = 'div#add-member-modal';
  modalEditTeam: string = '#edit-team-name-modal';
  modalDeleteMember: string = '#delete-member-modal';
  deleteUser: string = '[data-testid="delete-user-role"]';
  addUser: string = '[data-testid="add-user-role"]';
  userEmail: string = 'input.select-inner__input';
  userRole: string = '[data-testid="user-role"]';
  deleteUserRole: string = '[data-testid="delete-user-role"]';
  editTeamName: string = '[data-testid="edit-name"]';
  saveEditTeamName: string = '[data-testid="save-edit-name"]';
  cancelEditTeamName: string = '[data-testid="cancel-edit-name"]';
  resendInvitation: string = '[data-testid="resend-invitation"]';
  deleteMember: string = '[data-testid="delete-member"]';
  addNewTeamMember: string = '[data-testid="add-new-team-member"]';

  startTeam() {
    cy.visit(this.path);
    cy.get('button').contains('+ Create a New Team').should('be.visible');
  }

  getFirstTeamName(): string {
    let name: string;
    cy.get('table')
      .first()
      .then(($name) => {
        name = $name.text();
      });
    return name;
  }
}

export default TeamPage;
