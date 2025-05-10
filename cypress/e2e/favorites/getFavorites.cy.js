describe('Get Favorites E2E Tests', () => {
    it('should fetch favorites when logged in', () => {
        cy.login();
        cy.request({
            method: 'GET',
            url: '/favorites', // Ajuste a rota conforme necessário
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.favorites).to.be.an('array');
        });
    });
  
    it('should return error when user is not logged in', () => {
        cy.visit('/api/auth/logout');
        cy.request({
            method: 'GET',
            url: '/favorites',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq('You need to be logged in');
        });
    });
});
  