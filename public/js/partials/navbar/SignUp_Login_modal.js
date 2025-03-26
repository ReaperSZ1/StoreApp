document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const modalSignUp = document.getElementById("modalSignUp");
    const modalLogin = document.getElementById("modalLogin");
    const openSignUp = document.getElementById("openSignUp");
    const openLogin = document.getElementById("openLogin");
    const accountOpenLog = document.getElementById("accountOpenLogin");
    const closeButtons = document.querySelectorAll(".close-modal");

    function openModal(modal) {
        modal.classList.add("show");
        body.classList.add("modal-open"); // Impede a rolagem
    }
    function closeModal(modal) {
        modal.classList.remove("show");
        body.classList.remove("modal-open");
    }
    function accountOpenModal(modalSignUp, modalLogin) {
        modalSignUp.classList.remove("show");
        body.classList.remove("modal-open");
        modalLogin.classList.add("show");
        body.classList.add("modal-open"); 
    }
    
    openSignUp.addEventListener("click", () => openModal(modalSignUp));
    openLogin.addEventListener("click", () => openModal(modalLogin));
    accountOpenLog.addEventListener("click", () => accountOpenModal(modalSignUp, modalLogin));
  
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
