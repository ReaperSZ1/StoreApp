function toggleFavorite(element) {
    const outline = element.querySelector('.icon-outline');
    const filled = element.querySelector('.icon-filled');
  
    if (!outline || !filled) {
      console.warn('Ícones não encontrados dentro do botão favorito.');
      return;
    }
  
    outline.classList.toggle('hidden');
    outline.classList.toggle('block');
  
    filled.classList.toggle('hidden');
    filled.classList.toggle('block');
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.product-card-favorite').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFavorite(btn);
      });
    });
  });
  