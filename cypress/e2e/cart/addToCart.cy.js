describe('Add to Cart - E2E Tests', () => {
	it('should add a product to cart with valid data', () => {
		cy.login();
		cy.visit('/product/bluetooth-speaker');

		cy.get('button[type="submit"].btn-prod-responsive').click();
		cy.wait(1000);

		cy.get('.msg-responsive').should('contain.text', 'Product added to cart');
	});

    it('should show error when user is not authenticated', () => {
		cy.visit('/')
		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'POST',
				headers: { 'X-CSRF-token': csrfToken, test: true },
				url: '/cart/addToCart',
				failOnStatusCode: false,
				body: { slug: 'bluetooth-speaker', quantity: 1 }
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(response.body.error).to.eq('User Not authenticated.');
			});
		});
	});

	it('should show error for invalid slug', () => {
		cy.login();
		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'POST',
				headers: { 'X-CSRF-token': csrfToken, test: true },
				url: '/cart/addToCart',
				failOnStatusCode: false,
				body: { slug: 'invalid slug', quantity: 1 }
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(response.body.error).to.eq('Invalid slug.');
			});
		});
	});

	it('should show error for product not found', () => {
		cy.login();
		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'POST',
				headers: { 'X-CSRF-token': csrfToken, test: true },
				url: '/cart/addToCart',
				failOnStatusCode: false,
				body: { slug: 'non-existent-product', quantity: 1 }
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(response.body.error).to.eq('Product not found.');
			});
		});
	});

	it('should show error for invalid quantity', () => {
		cy.login();
		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'POST',
				headers: { 'X-CSRF-token': csrfToken, test: true },
				url: '/cart/addToCart',
				failOnStatusCode: false,
				body: { slug: 'bluetooth-speaker', quantity: 0 }
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(response.body.error).to.eq('Invalid quantity.');
			});
		});
	});

	it('should increase product quantity if already in cart', () => {
		cy.login();
		cy.visit('/product/bluetooth-speaker');
		cy.get('button[type="submit"].btn-prod-responsive').click();
		cy.wait(1000);
		cy.get('.msg-responsive').should('contain.text', 'Product added to cart');

		cy.get('button[type="submit"].btn-prod-responsive').click();
		cy.wait(1000);
		cy.get('.msg-responsive').should('contain.text', 'Product added to cart');

		// Abrir modal do carrinho e verificar a quantidade
		cy.get('#openModalIcon').click();
		// it verify if the input value is greater than one
		cy.get('.cart-item-qty-input-responsive').should(($input) => {
			expect(parseInt($input.val(), 10)).to.be.greaterThan(1);
		});
	});
});
