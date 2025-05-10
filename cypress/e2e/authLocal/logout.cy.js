describe('Logout tests', () => {
    it('after logged should account logout', () => {
        cy.visit('/');
        cy.get('#account').click();
        cy.get('#openLogin').click();

        cy.fillLoginForm('ws4t20177@gmail.com', '123123');

		// Enviar o formulário
		cy.get('#modalLogin .form-submit-responsive').click();

		// Verificar a mensagem flash de sucesso (exemplo)
		cy.get('.msg-responsive')
			.should('be.visible')
			.and('contain.text', 'Logged in successfully!');

		cy.url().should('include', '/');

        cy.get('#account').click();
        cy.get('#logoutBtn').click();
        
        cy.get('.msg-responsive')
			.should('be.visible')
			.and('contain.text', 'You have been logged out!');

         cy.url().should('include', '/');
    });
})