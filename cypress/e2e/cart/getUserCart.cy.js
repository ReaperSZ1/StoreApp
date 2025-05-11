describe('Cart Page - E2E Tests', () => {
	before(() => {
		cy.login();

		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'POST',
				url: '/cart/addToCart',
				headers: { 'X-CSRF-token': csrfToken },
				body: { slug: '16gb-ddr4-ram', quantity: 1 },
				failOnStatusCode: false
			}).then((response) => {
				expect(response.status).to.eq(200);
			});
		});
	});

	it('should display cart items correctly when open cart modal', () => {
		cy.get('#openModalIcon').click();

		cy.get('.cart-item').should('have.length.at.least', 1);
		cy.get('.cart-item-title-responsive').should('exist');
		cy.get('.cart-item-img-responsive').should('exist');
		cy.get('.cart-item-qty-responsive').should('exist');
		cy.get('.cart-item-price-responsive').should('exist');
	});

	it('should increase and decrease product quantity', () => {
		cy.login();

		cy.get('#openModalIcon').click();

		cy.get('.cart-item .btn-increase').first().click();
		cy.get('.cart-item .input-quantity').first().should('have.value', '2');

		cy.get('.cart-item .btn-decrease').first().click();
		cy.get('.cart-item .input-quantity').first().should('have.value', '1');
	});

	it('should remove a product from the cart', () => {
		cy.login();
		cy.get('#openModalIcon').click();

		cy.intercept('DELETE', '/cart/removeFromCart/16gb-ddr4-ram').as(
			'removeFromCart'
		);

		cy.get('.cart-item-remove-responsive').first().click();

		cy.wait('@removeFromCart').its('response.statusCode').should('eq', 200);
	});

	it('should display error when user is not logged in', () => {
		cy.visit('/');

		cy.get('#openModalIcon').click();

		cy.get('.msg-responsive').should('contain.text', 'User Not authenticated.');
	});
});
