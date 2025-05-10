Cypress.Commands.add('fillSignUpForm', (name, email, password, password2) => {
    cy.get('#name').type(name);
    cy.get('#modalSignUp input[name="email"]').type(email);
    cy.get('#modalSignUp input[name="password"]').type(password);
    cy.get('#modalSignUp input[name="password2"]').type(password2);
});

Cypress.Commands.add('fillLoginForm', (email, password) => {
    cy.get('#modalLogin input[name="email"]').type(email);
    cy.get('#modalLogin input[name="password"]').type(password);
});

Cypress.Commands.add('login', () => { 
    cy.visit('/');
    cy.get('#account').click();
    cy.get('#openLogin').click();

	cy.fillLoginForm('ws4t20177@gmail.com', '123123');

	cy.get('#modalLogin .form-submit-responsive').click();

    cy.url().should('include', '/');
});
