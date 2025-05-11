describe('Categories Page Tests', () => {
	it('should load the categories page with products [00]', () => {
        cy.visit('/');
        cy.get('a.categories-link-responsive[href="/category/computers"]').click();
        cy.url().should('include', '/category/computers');

		cy.get('.products-container-responsive h1')
			.contains('Computers')
			.should('exist');

		cy.get('.products-container-responsive h1')
			.parent()
			.find('a')
			.should('have.length.greaterThan', 0)
			.each(($el) => {
				cy.wrap($el).find('img').should('exist');
				cy.wrap($el).find('p').first().should('exist');
				cy.wrap($el).find('p').last().should('exist');
			});
	});

    it('should load the categories page with products [01]', () => {
        cy.visit('/');
        cy.get('#categories-list').trigger('mouseover');
        cy.get('#categories_tooltip').invoke('css', 'visibility', 'visible').invoke('css', 'opacity', '1');
        cy.get('#categories_tooltip').should('be.visible');
        cy.get('#categories_tooltip a').eq(1).click(); 
         
		cy.get('.products-container-responsive h1').should('exist');

		cy.get('.products-container-responsive h1')
			.parent()
			.find('a')
			.should('have.length.greaterThan', 0)
			.each(($el) => {
				cy.wrap($el).find('img').should('exist');
				cy.wrap($el).find('p').first().should('exist');
				cy.wrap($el).find('p').last().should('exist');
			});
	});

	it('should redirect to home on invalid category slug', () => {
		cy.visit('/category/abd dg sgf sg2323');
        cy.get('.msg-responsive')
            .should('be.visible')
            .and('contain.text', 'Invalid category slug!');
	});

	it('should display error message if category not found', () => {
		cy.visit('/category/invalid-slug');
        cy.get('.msg-responsive')
            .should('be.visible')
            .and('contain.text', 'Category not found!');
	});

    it('should display favorite icon for logged in user', () => {
        cy.login()

        cy.get('.products-container-responsive a').first().trigger('mouseover');

        cy.get('.product-card-favorite').should('exist'); // Verifica ícone de favorito
    });
});
