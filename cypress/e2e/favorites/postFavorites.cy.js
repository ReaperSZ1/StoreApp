describe('Favorites E2E Tests', () => {
      it('should save favorites when logged in', () => {
        cy.login();
        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'POST',
                url: 'api/favorites', 
                headers: { 'X-CSRF-token': csrfToken },
                body: { favorites: ['bluetooth-speaker', '16gb-ddr4-ram', 'rtx-4060-graphics-card'] },     
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
            });
        });
    });
  
    it('should return error when not logged in', () => {
        cy.visit('/api/auth/logout');
        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'POST',
                url: 'api/favorites', 
                headers: { 'X-CSRF-token': csrfToken },
                body: { favorites: ['bluetooth-speaker', '16gb-ddr4-ram', 'rtx-4060-graphics-card'] }, 
                failOnStatusCode: false    
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('You need to be logged in');
            });
        });
    });
  
    it('should return error for invalid favorites format', () => {
        cy.login();
        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'POST',
                url: 'api/favorites', 
                headers: { 'X-CSRF-token': csrfToken },
                body: { favorites: 'jooj' },     
                failOnStatusCode: false    
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('Favorites must be an array!');
            });
        });
    });

    it('should return error when body empty', () => {
        cy.login();
        cy.get('meta[name="csrf-token"]').then((meta) => {
            const csrfToken = meta.attr('content');
            cy.request({
                method: 'POST',
                url: 'api/favorites', 
                headers: { 'X-CSRF-token': csrfToken },
                failOnStatusCode: false    
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('body cannot be empty');
            });
        });
    });
});