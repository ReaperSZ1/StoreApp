describe('Home Page - Basic Rendering Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    context('General Structure', () => {
        it('should display a promotions section if on sale products exist', () => {
            cy.get('.products-container-responsive h1')
                .contains('Promotions 🔥')
                .should('exist');
        });

        it('should display a new arrivals section if recent products exist', () => {
            cy.get('.products-container-responsive h1')
                .contains('New Arrivals 🚀')
                .should('exist');
        });

        it('should display a featured products section if common products exist', () => {
            cy.get('.products-container-responsive h1')
                .contains('Featured Products 🌟')
                .should('exist');
        });
    });

    context('Product Cards', () => {
        it('should display products with title, image, and price in promotions section', () => {
            cy.get('.products-container-responsive h1:contains("Promotions 🔥")')
                .parent()
                .find('a')
                .should('have.length.greaterThan', 0)
                .each(($el) => {
                    cy.wrap($el).find('img').should('exist');
                    cy.wrap($el).find('p').first().should('exist');
                    cy.wrap($el).find('p').last().should('exist');
                });
        });

        it('should display products with title, image, and price in new arrivals section', () => {
            cy.get('.products-container-responsive h1:contains("New Arrivals 🚀")')
                .parent()
                .find('a')
                .should('have.length.greaterThan', 0)
                .each(($el) => {
                    cy.wrap($el).find('img').should('exist');
                    cy.wrap($el).find('p').first().should('exist');
                    cy.wrap($el).find('p').last().should('exist');
                });
        });

        it('should display products with title, image, and price in featured products section', () => {
            cy.get('.products-container-responsive h1:contains("Featured Products 🌟")')
                .parent()
                .find('a')
                .should('have.length.greaterThan', 0)
                .each(($el) => {
                    cy.wrap($el).find('img').should('exist');
                    cy.wrap($el).find('p').first().should('exist');
                    cy.wrap($el).find('p').last().should('exist');
                });
        });

        it('should display favorite icon for logged in user', () => {
            cy.login()
    
            cy.get('.products-container-responsive a').first().trigger('mouseover');
    
            cy.get('.product-card-favorite').should('exist'); // Verifica ícone de favorito
        });
    });
});
