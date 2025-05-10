describe('Product Page - E2E Tests', () => {
    it('should display product details correctly and favorite button', () => {
        cy.login();
        cy.get('.justify-between > [href="/category/audio"]').click();
        cy.get('[href="/product/bluetooth-speaker"]').click();

        cy.get('.product-card-favorite').should('exist');
        cy.get('.title-prod-responsive').should('exist');
        cy.get('.price-prod-responsive').should('exist');
        cy.get('.desc-prod-responsive').should('exist');
        cy.get('.cat-prod-responsive').should('exist');
    });
  
    it('should add product to cart with default quantity', () => {
        cy.login();
        cy.visit('/product/bluetooth-speaker');
        cy.get('button[type="submit"].btn-prod-responsive').click();
        cy.wait(1000);
        cy.get('.msg-responsive').should('contain.text', 'Product added to cart');
    });
  
    it('should increase and decrease quantity', () => {
        cy.visit('/product/bluetooth-speaker');
        cy.get('#quantityInput').should('have.value', '1');

        cy.get('#increaseBtn').click();
        cy.get('#quantityInput').should('have.value', '2');
    
        cy.get('#decreaseBtn').click();
        cy.get('#quantityInput').should('have.value', '1');
    });
  
    it('should show error when has no product for slug', () => {
        cy.visit('/product/non-existent-product');
        cy.url().should('include', '/');
        cy.get('.msg-responsive').should('contain.text', 'product not found.');
    });

    it('should show error for invalid slug', () => {
        cy.visit('/product/invalid slug');
        cy.url().should('include', '/');
        cy.get('.msg-responsive').should('contain.text', 'Invalid product slug!');
    });
});
  