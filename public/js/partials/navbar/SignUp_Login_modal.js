document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const modalSignUp = document.getElementById("modalSignUp");
    const modalLogin = document.getElementById("modalLogin");
    const openSignUp = document.getElementById("openSignUp");
    const openLogin = document.getElementById("openLogin");
    const closeButtons = document.querySelectorAll(".close-modal");

    function openModal(modal) {
        modal.classList.add("show");
        body.classList.add("modal-open"); // Impede a rolagem
    }
    
    openSignUp.addEventListener("click", () => openModal(modalSignUp));
    openLogin.addEventListener("click", () => openModal(modalLogin));

    function closeModal(modal) {
        modal.classList.remove("show");
        body.classList.remove("modal-open");
    }

    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            closeModal(this.closest(".modal-overlay"));
        });
    });

    // Fecha o modal ao clicar fora
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal-overlay")) {
            closeModal(event.target);
        }
    });
});
