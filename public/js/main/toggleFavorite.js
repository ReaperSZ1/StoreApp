document.addEventListener('DOMContentLoaded', async () => {
    const userId = document.body.dataset.userId;
    const isMyFavoritesPage = window.location.pathname === '/my-favorites';

    if (!userId) return;

    const getFavoritesFromDB = async () => {
        const res = await fetch(`/favorites/${userId}`);
        const data = await res.json();
        return data.favorites || [];
    };

    const saveFavoritesToDB = async (updatedFavorites) => {
        await fetch(`/api/favorites/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ favorites: updatedFavorites })
        });
    };

    let favorites = await getFavoritesFromDB();

    const toggleFavorite = async (element) => {
        const slug = element.dataset.slug;
        const filled = element.querySelector('.favorite-icon-filled');
        const outline = element.querySelector('.favorite-icon-outline');

        if (!outline || !filled) {
            console.warn('⚠️Ícones não encontrados dentro do botão favorito.');
            return;
        }

        const isFavorited = favorites.includes(slug);

        if (isFavorited) {
            const freshFavorites = await getFavoritesFromDB();
            const updatedFavorites = freshFavorites.filter(id => id !== slug);
            favorites = updatedFavorites; 
            await saveFavoritesToDB(updatedFavorites);
            filled.classList.add('hidden');
            outline.classList.remove('hidden');
            if (isMyFavoritesPage) { window.location.reload(); }
        } else {
            if (!favorites.includes(slug)) {
                favorites.push(slug);
                await saveFavoritesToDB(favorites);
            }
            filled.classList.remove('hidden');
            outline.classList.add('hidden');
        }
    };

    document.querySelectorAll('.product-card-favorite').forEach(favBtn => {
        favBtn.addEventListener('click', async () => {
            await toggleFavorite(favBtn);
        });
    });
});
