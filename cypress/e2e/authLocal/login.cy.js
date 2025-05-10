describe('Login tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#account').click();
        cy.get('#openLogin').click();
    });

	it('should display the Login modal', () => {
		cy.get('#modalLogin h2.h2-modal-responsive')
			.should('be.visible')
			.and('contain.text', 'Login');
		cy.get('#modalLogin').should('be.visible');
		cy.get('#closeLoginBtn').should('be.visible');
		cy.get('.form-submit-responsive')
			.should('be.visible')
			.and('contain.text', 'Login');
	});

	it('should complete Login form and show success message', () => {
        cy.fillLoginForm('ws4t20177@gmail.com', '123123');

		// Enviar o formulário
		cy.get('#modalLogin .form-submit-responsive').click();

		// Verificar a mensagem flash de sucesso (exemplo)
		cy.get('.msg-responsive')
			.should('be.visible')
			.and('contain.text', 'Logged in successfully!');

		cy.url().should('include', '/');
	});

    it('should show error for short password', () => {
        cy.fillLoginForm('ws4t20177@gmail.com', '123');
        cy.get('#modalLogin .form-submit-responsive').click();

        cy.get('.msg-responsive')
            .should('be.visible')
            .and('contain.text', 'Password must be at least 6 characters');
        cy.url().should('include', '/');
    });

    it('should show error for non-existing user', () => {
        cy.fillLoginForm('nonexistent@example.com', 'password123');
        cy.get('#modalLogin .form-submit-responsive').click();

        cy.get('.msg-responsive')
            .should('be.visible')
            .and('contain.text', 'User Not Found');
        cy.url().should('include', '/');
    });

    it('should show error for incorrect password', () => {
        cy.fillLoginForm('ws4t20177@gmail.com', 'wrongpassword');
        cy.get('#modalLogin .form-submit-responsive').click();

        cy.get('.msg-responsive')
            .should('be.visible')
            .and('contain.text', 'Invalid credentials');
        cy.url().should('include', '/');
    });

    it('should show error when try to access a Oath account from local auth', () => {
        cy.fillLoginForm('gabrielsil20177@gmail.com', 'google-login');
        cy.get('#modalLogin .form-submit-responsive').click();

        cy.get('.msg-responsive')
            .should('be.visible')
            .and('contain.text', 'Invalid credentials');
            
        cy.url().should('include', '/');
    });
});
