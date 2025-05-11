describe('Sign Up tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#account').click();
        cy.get('#openSignUp').click();
    });

    it('should display the sign-up modal', () => {
        cy.get('h2.h2-modal-responsive')
            .should('be.visible')
            .and('contain.text', 'Sign Up');
        cy.get('#modalSignUp').should('be.visible');
        cy.get('#closeSignUpBtn').should('be.visible');
        cy.get('.form-submit-responsive')
            .should('be.visible')
            .and('contain.text', 'Sign');
    });

    it('should complete sign up form and show success message', () => {
        cy.fillSignUpForm('John Doe', 'johndoe@example.com', 'password123', 'password123');

        cy.intercept('POST', '/api/auth/signup', (req) => {
            req.headers['e2e'] = 'true';
        }).as('signUpRequest');

        cy.get('#modalSignUp .form-submit-responsive').click();

        cy.wait('@signUpRequest')
            .its('request.headers.e2e')
            .should('equal', 'true');

        cy.get('.msg-responsive').should('be.visible').and('contain.text', 'User registered successfully!');
        cy.url().should('include', '/');
    });

    it('should show error for unmatched passwords', () => {
        cy.fillSignUpForm('John Doe', 'johndoe@example.com', 'password123', 'differentpassword');
        
        cy.get('#modalSignUp .form-submit-responsive').click();

        cy.get('.msg-responsive').should('be.visible').and('contain.text', 'Passwords do not match');
        cy.url().should('include', '/');
    });

    it('should show error for short password', () => {
        cy.fillSignUpForm('John Doe', 'johndoe@example.com', '123', '123');
        
        cy.get('#modalSignUp .form-submit-responsive').click();

        cy.get('.msg-responsive').should('be.visible').and('contain.text', 'Password must be at least 6 characters');
        cy.url().should('include', '/');
    });

    it('should show modal login when click in Login button', () => {
        cy.visit('/');
        cy.get('#account').click();
        cy.get('#openSignUp').click();
        cy.get('#modalSignUp').should('be.visible');
        cy.get('#accountOpenLogin').click();
        cy.get('#modalLogin').should('be.visible');
    })
});
