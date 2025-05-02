window.updateCartTotal = function () {
    let total = 0;
    const items = document.querySelectorAll('#cartItems .cart-item');
    items.forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').innerText.replace('R$ ', '').replace(',', '.'));
        const quantity = parseInt(item.querySelector('.input-quantity').value);
        total += price * quantity;
    });
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
};
