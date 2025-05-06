const { updateCartTotal } = require('../cart/cartTotal');
const { setupCartItemQuantityHandlers } = require('../cart/quantityInput');
document.addEventListener('DOMContentLoaded', () => {
	const modal = document.getElementById('cartModal');
    const modalContent = document.getElementById('modalContent');
    const cartItemsContainer = document.getElementById('cartItems');

    // Função para abrir o modal
    function openModal() {
        document.documentElement.classList.add('overflow-hidden');
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100', 'visible');
        modalContent.classList.remove('translate-x-full', 'opacity-0');
        modalContent.classList.add('slide-in-right', 'opacity-100');
        loadCartItems();
    }

    // Função para fechar o modal
    function closeModal() {
        document.documentElement.classList.remove('overflow-hidden');
    
        modalContent.classList.remove('slide-in-right', 'opacity-100');
        modalContent.classList.add('slide-out-right');
    
        setTimeout(() => {
            modal.classList.remove('opacity-100', 'visible');
            modal.classList.add('opacity-0', 'invisible');
            modalContent.classList.remove('slide-out-right');
            modalContent.classList.add('translate-x-full', 'opacity-0');
        }, 1000);
    }

    function setupRemoveItemHandlers() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', async (event) => {
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const slug = event.target.getAttribute('data-slug');
                if (!slug) return;
    
                try {
                    const response = await fetch(`http://localhost:8081/cart/removeFromCart/${slug}`, {
                        method: 'DELETE',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'csrf-token': csrfToken, 
                            'X-Requested-With': 'XMLHttpRequest' 
                        },
                    });
    
                    console.log('jooj');
                    if (response.ok) {
                        await loadCartItems();
                    }
                } catch (err) {
                    console.error('Erro ao fazer a requisição', err);
                }
            });
        });
    }

    // Função para carregar os itens do carrinho
    async function loadCartItems() {
        await fetch('/cart/getUserCart')
            .then(res => res.text())
            .then(html => {
                cartItemsContainer.innerHTML = html;  
                setupCartItemQuantityHandlers(cartItemsContainer); 
                updateCartTotal();
                setupRemoveItemHandlers();
            })
            .catch(err => {
                console.error('Erro ao carregar carrinho:', err);
            }); 
    }

    async function checkout() {
        console.log('checkout');
        await fetch('/cart/checkout')
            .then(res => res.text())
            .catch(err => {
                console.error('Erro ao carregar carrinho:', err);
            }); 
    }

    document.getElementById('openModalIcon').addEventListener('click', openModal);

    modal.addEventListener('click', closeModal);
    // Impede que o clique dentro do conteúdo feche o modal
    modalContent.addEventListener('click', (event) => { event.stopPropagation(); });
    // Adicionando o evento para fechar o modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('checkoutButton').addEventListener('click', checkout);
});
