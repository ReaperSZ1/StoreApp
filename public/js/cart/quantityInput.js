import { updateCartTotal } from '../cart/cartTotal.js';
export const setupCartItemQuantityHandlers = function (container) {
    container.querySelectorAll('.quantity-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('.input-quantity');
        const btnIncrease = wrapper.querySelector('.btn-increase');
        const btnDecrease = wrapper.querySelector('.btn-decrease');
        const slug = wrapper.dataset.slug; // <- Isso precisa estar no HTML!
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

        // Atualiza no back-end e front-end
        const updateCartItemQuantity = (slug, newQuantity) => {
            fetch(`/cart/updateQuantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'csrf-token': csrfToken
                },
                body: JSON.stringify({ quantity: newQuantity, slug })
            })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao atualizar quantidade');
                return res.json();
            })
            .then(() => {
                if (typeof updateCartTotal === 'function') updateCartTotal();
            })
            .catch(err => {
                console.error('Erro ao atualizar quantidade:', err);
            });
        };

        btnIncrease.addEventListener('click', () => {
            input.value = parseInt(input.value) + 1;
            updateCartItemQuantity(slug, input.value);
        });

        btnDecrease.addEventListener('click', () => {
            const newVal = Math.max(1, parseInt(input.value) - 1);
            input.value = newVal;
            updateCartItemQuantity(slug, newVal);
        });

        input.addEventListener('change', () => {
            const newVal = Math.max(1, parseInt(input.value));
            input.value = newVal;
            updateCartItemQuantity(slug, newVal);
        });
    });
};
