describe('User Favorites', () => {
    it('should display favorite products when user is logged in', () => {
        cy.login(); 
        cy.url().should('include', '/');

        cy.get('#go-to-favorites').click();
        cy.url().should('include', '/my-favorites');
        
        cy.get('.products-container-responsive h1').contains('Favorites ❤').should('exist');        

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

    it('should show error when user is not logged in', () => {
        cy.visit('/');

        cy.get('#go-to-favorites').click();
        
        cy.get('.msg-responsive').should('contain.text', 'You need to be logged in');
    });

    it('should allow user to remove all favorites and show "No products found" message', () => {
        cy.login(); 

        cy.get('#go-to-favorites').click();
        cy.url().should('include', '/my-favorites');
    
        // Verificar se a lista de produtos favoritos está visível
        cy.get('.products-container-responsive h1')
            .parent()
            .find('a')
            .should('have.length.greaterThan', 0)
            .each(($el) => {
                cy.wrap($el).find('img').should('exist');
                cy.wrap($el).find('p').first().should('exist');
                cy.wrap($el).find('p').last().should('exist');
            });        

        // Para cada produto favorito, simula o hover e clica para remover o favorito
        cy.get('.products-container-responsive .product-card-favorite').then(($favorites) => {
            const count = $favorites.length;
            
            for (let i = 0; i < count; i++) {
                // Remove o primeiro item da lista, pois o DOM será atualizado a cada remoção
                cy.get('.products-container-responsive .product-card-favorite')
                  .first()
                  .trigger('mouseover')
                  .click();
                
                // Espera recarregar e verifica se a lista diminuiu
                cy.wait(1000);
            }
        });
    
        cy.get('.text-gray-500').should('contain.text', 'Products not found.');

        // posting some favorite products
        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'POST',
                url: 'api/favorites', 
                headers: { 'X-CSRF-token': csrfToken },
                body: { favorites: ['bluetooth-speaker', '16gb-ddr4-ram'] },     
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
            });
        });
    });
});
