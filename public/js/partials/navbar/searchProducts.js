document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('searchIcon');
    const searchInput = document.getElementById('searchInput');

    searchIcon.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            window.location.href = `/search?query=${encodeURIComponent(query)}`;
        }
    });
});
