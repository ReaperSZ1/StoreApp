document.addEventListener('DOMContentLoaded', () => {
    const favoriteIcon = document.getElementById('go-to-favorites');

    if (favoriteIcon) {
      favoriteIcon.addEventListener('click', () => {
        window.location.href = '/my-favorites';
      });
    }
});