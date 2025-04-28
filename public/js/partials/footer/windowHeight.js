document.addEventListener("DOMContentLoaded", function () {
    const footers = document.querySelectorAll(".footer");

    const checkFooterPosition = (footer) => {
        const htmlHeight = document.documentElement.scrollHeight;  // Altura total do conteúdo
        const windowHeight = window.innerHeight;  // Altura da janela

        // Verifica se o conteúdo é menor que a altura da tela
        if (htmlHeight <= windowHeight) {
            footer.classList.remove("sticky");
            footer.classList.add("fixed");
        } else {
            footer.classList.remove("fixed");
            footer.classList.add("sticky");
        }
    };

    // Chama a função para cada footer quando o documento for carregado
    footers.forEach(footer => {
      checkFooterPosition(footer);
    });
});
