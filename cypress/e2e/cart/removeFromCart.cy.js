describe('Remove from Cart', () => {
    it('should remove an existing item from cart', () => {
        cy.login(); 
        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'POST',
                url: '/cart/addToCart',
                headers: { 'X-CSRF-token': csrfToken, test: true  },
                body: { slug: 'wireless-gamepad', quantity: 1 },
            }).then(() => {
                cy.request({
                    method: 'DELETE',
                    url: '/cart/removeFromCart/wireless-gamepad',
                    headers: { 'X-CSRF-token': csrfToken, test: true  },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.message).to.eq('Product removed from cart.');
                });
            });
        });
    });

    it('should show error for invalid slug', () => {
        cy.login(); 

        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'DELETE',
                url: '/cart/removeFromCart/invalid slug',
                headers: { 'X-CSRF-token': csrfToken, test: true  },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include('Invalid slug.');
            });
        });
    });

    it('should show error for unauthenticated user', () => {
        cy.visit('/');
        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'DELETE',
                url: '/cart/removeFromCart/bluetooth-speaker',
                headers: { 'X-CSRF-token': csrfToken, test: true },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include('User Not authenticated.');
            });
        });
    });

    it('should show error for non-existent product in cart', () => {
        cy.login(); 

        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'DELETE',
                url: '/cart/removeFromCart/usb-3-0-hub',
                headers: { 'X-CSRF-token': csrfToken, test: true  },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include('Item not found in cart.');
            });
        });
    });

});
