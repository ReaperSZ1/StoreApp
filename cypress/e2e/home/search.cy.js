describe('Search Functionality', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('should display products correctly when searching for a valid term', () => {
		cy.get('#searchInput').type('rtx');
		cy.get('#searchIcon').click();

		cy.get('.products-title-responsive').should(
			'contain',
			'Resultados para "rtx"'
		);
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

	it('should display "No products found." message for search with no results', () => {
		cy.get('#searchInput').type('joooj');
		cy.get('#searchIcon').click();

		cy.get('.text-gray-500').should('contain', 'No products found.');
	});

	it('should display favorite icon for logged in user', () => {
        cy.login()
        
		cy.get('#searchInput').type('rtx');
		cy.get('#searchIcon').click();

		cy.get('.products-container-responsive a').first().trigger('mouseover');

		cy.get('.product-card-favorite').should('exist'); // Verifica ícone de favorito
	});
});
