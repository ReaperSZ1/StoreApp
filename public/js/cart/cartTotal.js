export const updateCartTotal = function () {
    let total = 0;
    const items = document.querySelectorAll('#cartItems .cart-item');
    items.forEach(item => {
        const priceElement = item.querySelector('.cart-item-price-responsive');
        const quantityElement = item.querySelector('.input-quantity');
    
        if (!priceElement || !quantityElement) {
            console.warn('Item without price or quantity:', item);
            return;
        }
    
        const priceText = priceElement.textContent.trim().replace('R$ ', '').replace(',', '.');
        const quantityText = quantityElement.value.trim();
    
        if (!priceText) {
            console.warn('Price text is empty for an item:', item);
            return;
        }
    
        const price = parseFloat(priceText);
        const quantity = parseInt(quantityText, 10);
    
        if (isNaN(price) || isNaN(quantity) || quantity <= 0) {
            console.warn(`Invalid price or quantity: ${priceText}, ${quantityText}`, item);
            return;
        }
    
        total += price * quantity;
    });
    
    
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
};
