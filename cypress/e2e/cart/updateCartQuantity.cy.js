describe('Cart Quantity Update', () => {
	it('should update quantity of an existing item in cart', () => {
		cy.login();

		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'POST',
				url: '/cart/addToCart',
				headers: { 'X-CSRF-token': csrfToken, test: true },
				body: { slug: 'silicone-iphone-case', quantity: 1 }
			}).then(() => {
				cy.request({
					method: 'PUT',
					url: '/cart/updateQuantity',
					headers: { 'X-CSRF-token': csrfToken, test: true },
					body: { slug: 'silicone-iphone-case', quantity: 3 }
				}).then((response) => {
					expect(response.status).to.eq(200);
					expect(response.body.success).to.be.true;
					expect(response.body.message).to.eq('quantity updated.');
				});
			});
		});
	});

	it('should show error for invalid slug', () => {
		cy.login();

		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'PUT',
				url: '/cart/updateQuantity',
				headers: { 'X-CSRF-token': csrfToken },
				body: { slug: 'invalid slug', quantity: 1 },
				failOnStatusCode: false
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(response.body.error).to.include('Invalid slug.');
			});
		});
	});

	it('should show error for invalid quantity', () => {
		cy.login();

		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'PUT',
				url: '/cart/updateQuantity',
				headers: { 'X-CSRF-token': csrfToken },
				body: { slug: 'bluetooth-speaker', quantity: 0 },
				failOnStatusCode: false
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(response.body.error).to.include('Invalid quantity.');
			});
		});
	});

	it('should show error for unauthenticated user', () => {
		cy.visit('/');
		cy.get('meta[name="csrf-token"]').then((meta) => {
			const csrfToken = meta.attr('content');
			cy.request({
				method: 'PUT',
				url: '/cart/updateQuantity',
				headers: { 'X-CSRF-token': csrfToken },
                body: { slug: 'silicone-iphone-case', quantity: 3 },
				failOnStatusCode: false
			}).then((response) => {
				expect(response.status).to.eq(400);
				expect(response.body.error).to.include('User Not authenticated.');
			});
		});
	});
});
