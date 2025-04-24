document.addEventListener('DOMContentLoaded', async () => {
    const isMyFavoritesPage = window.location.pathname === '/my-favorites';
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    const getFavoritesFromDB = async () => {
        try {
            const response = await fetch(`/favorites`);
            const data = await response.json();
            return data.favorites || [];
        } catch (err) {
            console.error('Error getting user favorites', err);
            return [];
        }
    };

    const saveFavoritesToDB = async (updatedFavorites) => {
        try {
            await fetch(`/api/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({ favorites: updatedFavorites })
            });
        } catch (err) {
            console.error('Error saving favorites:', err);
        }
    };

    const updateFavoriteIcons = (filled, outline, isFavorited) => {
        if (isFavorited) {
            filled.classList.add('hidden');
            outline.classList.remove('hidden');
        } else {
            filled.classList.remove('hidden');
            outline.classList.add('hidden');
        }
    };

    const handleFavoriteClick = async (slug, filled, outline) => {
        const isFavorited = favorites.includes(slug);

        if (isFavorited) { favorites = favorites.filter(id => id !== slug); } // remove favorite
        else { favorites.push(slug); } // add favorite
        
        await saveFavoritesToDB(favorites);

        updateFavoriteIcons(filled, outline, isFavorited);

        if (isMyFavoritesPage) { window.location.reload(); }
    };

    let favorites = await getFavoritesFromDB();

    // add event listener to each favorite button
    document.querySelectorAll('.product-card-favorite').forEach(favBtn => {
        favBtn.addEventListener('click', async () => {
            const slug = favBtn.dataset.slug;
            const filled = favBtn.querySelector('.favorite-icon-filled');
            const outline = favBtn.querySelector('.favorite-icon-outline');

            if (!outline || !filled) {
                console.warn('⚠️Icons not found inside favorite button.');
                return;
            }

            await handleFavoriteClick(slug, filled, outline);
        });
    });
});
