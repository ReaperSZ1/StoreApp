describe('checkout - E2E Tests', () => {
	it('should return success when access checkout', () => {
		cy.login();
        cy.get('#openModalIcon').click();
        cy.get('.modal-checkout-btn-responsive').click();

        cy.get('.msg-responsive').should('contain.text', 'order completed! ;-)');
        cy.url().should('include', '/');
	});

    it('should close the modal when click in close buttom', () => {
        cy.login();
        cy.get('#openModalIcon').click()
        cy.wait(1000);
        cy.get('#cartModal').should('be.visible')
        cy.get('#closeModal').click()
        cy.wait(1500)
        cy.get('#cartModal').should('not.be.visible')
    });

    it('should correctly calculate the cart total based on items and quantities', () => {
        cy.login();
    cy.get('#openModalIcon').click();
    cy.wait(1000);

    let calculatedTotal = 0;
    cy.get('.cart-item').each(($el) => {
        // Remove R$ e espaços extras, depois processa
        const priceText = $el.find('.cart-item-price-responsive').text().replace('R$', '').trim();
        const quantityText = $el.find('.cart-item-qty-input-responsive').val();

        // CORREÇÃO AQUI:
        // Para priceText dos itens (ex: "49.9", "299.99"), o '.' é decimal.
        // Apenas substitua a vírgula por ponto, caso a vírgula seja usada como decimal.
        // Não remova o ponto indiscriminadamente.
        const price = parseFloat(priceText.replace(',', '.'));
        const quantity = parseInt(quantityText);

        cy.log(`Item - Preço Texto Original: ${$el.find('.cart-item-price-responsive').text()}, Preço Texto Limpo: ${priceText}, Preço Calculado: ${price}, Quantidade Texto: ${quantityText}, Quantidade: ${quantity}`);

        if (!isNaN(price) && !isNaN(quantity)) {
            calculatedTotal += price * quantity;
        }
    }).then(() => {
        // Arredondar para duas casas decimais para evitar problemas de precisão de ponto flutuante
        calculatedTotal = parseFloat(calculatedTotal.toFixed(2));
        cy.log(`Calculated Total: ${calculatedTotal}`);

        cy.get('#cartTotal')
            .invoke('text')
            .then((totalText) => {
                // Para o total exibido (ex: "R$ 4.686,59"), a lógica original de limpeza está correta:
                // 1. Remover "R$"
                // 2. Remover os pontos (separadores de milhar)
                // 3. Substituir a vírgula (separador decimal) por ponto
                const displayedTotalTextCleaned = totalText.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
                const displayedTotal = parseFloat(displayedTotalTextCleaned);
                cy.log(`Displayed Total Text Original: ${totalText}, Displayed Total Text Limpo: ${displayedTotalTextCleaned}, Displayed Total Calculado: ${displayedTotal}`);
                
                expect(displayedTotal).to.eq(calculatedTotal);
            });
    });
    });
});
